import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Compute SHA-256 hash of a File's content using Web Crypto API.
 * Takes < 5 ms for a typical 1–5 MB image in the browser.
 */
async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Result of an image upload — tells the caller if the image was deduplicated. */
export interface UploadResult {
  storageId: string;
  /** true = the file already existed in storage (no bytes were uploaded) */
  deduplicated: boolean;
}

/**
 * Hook for the 4-step image upload pipeline with content-hash deduplication:
 *
 *  1. Compute SHA-256 of the file bytes (client-side, very fast)
 *  2. Check if the hash exists in `imageHashes` table
 *     → If yes: return the existing storageId (skip upload entirely!)
 *  3. If not: generate upload URL → PUT raw file → convertToWebp
 *  4. Store hash → storageId mapping for future dedup
 */
export function useImageUpload() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const convertToWebp = useMutation(api.images.convertToWebp);
  const findByHash = useMutation(api.images.findByHash);
  const storeHash = useMutation(api.images.storeHash);

  const uploadImage = async (file: File, quality: number = 82): Promise<UploadResult> => {
    // ── Step 0: Compute content hash ──
    const hash = await computeFileHash(file);

    // ── Step 1: Check dedup — does this exact file already exist? ──
    const existing = await findByHash({ hash });
    if (existing) {
      // Dedup hit! Reuse the existing image — no upload needed.
      return { storageId: existing.storageId, deduplicated: true };
    }

    // ── Step 2: Upload the file ──
    const uploadUrl = await generateUploadUrl({});

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Upload failed: ${result.statusText}`);
    }

    const { storageId: rawStorageId } = await result.json();

    // ── Step 3: Convert to WebP (currently passthrough — returns same ID) ──
    const { storageId: webpStorageId } = await convertToWebp({
      rawStorageId,
      quality,
    });

    // ── Step 4: Store hash mapping (with race-condition guard) ──
    // storeHash returns the canonical storageId, which may differ from
    // webpStorageId if a concurrent upload of the same file won the race.
    const canonicalId = await storeHash({ hash, storageId: webpStorageId });

    return { storageId: canonicalId, deduplicated: canonicalId !== webpStorageId };
  };

  return { uploadImage };
}