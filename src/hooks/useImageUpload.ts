import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { optimizeImageToWebP } from "../utils/imageOptimization";

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
  /** Original file size in bytes */
  originalSize: number;
  /** Optimized file size in bytes */
  optimizedSize: number;
}

/**
 * Hook for the image upload pipeline with client-side WebP optimization:
 *
 *  1. Compute SHA-256 of the original file bytes
 *  2. Check if the hash exists in `imageHashes` table
 *     → If yes: return the existing storageId (skip upload entirely!)
 *  3. Optimize image to WebP using Canvas API (browser-native)
 *  4. Upload pre-optimized WebP directly to Convex storage
 *  5. Store hash → storageId mapping for future dedup
 * 
 * No server-side conversion needed — optimization happens client-side!
 */
export function useImageUpload() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const findByHash = useMutation(api.images.findByHash);
  const storeHash = useMutation(api.images.storeHash);

  const uploadImage = async (file: File, quality: number = 0.82): Promise<UploadResult> => {
    const originalSize = file.size;

    // ── Step 0: Compute content hash of ORIGINAL file ──
    // We hash the original so identical uploads dedup regardless of optimization
    const hash = await computeFileHash(file);

    // ── Step 1: Check dedup — does this exact file already exist? ──
    const existing = await findByHash({ hash });
    if (existing) {
      return { storageId: existing.storageId, deduplicated: true, originalSize, optimizedSize: 0 };
    }

    // ── Step 2: Optimize to WebP in the browser ──
    // Canvas API converts to WebP without any external dependencies
    const optimizedBlob = await optimizeImageToWebP(file, quality);

    // ── Step 3: Upload the pre-optimized WebP directly to Convex ──
    // No backend conversion needed — file is already WebP and optimized!
    const uploadUrl = await generateUploadUrl({});

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/webp" },
      body: optimizedBlob,
    });

    if (!result.ok) {
      throw new Error(`Upload failed: ${result.statusText}`);
    }

    const { storageId } = await result.json();

    // ── Step 4: Store hash mapping ──
    await storeHash({ hash, storageId });

    return {
      storageId,
      deduplicated: false,
      originalSize,
      optimizedSize: optimizedBlob.size,
    };
  };

  return { uploadImage };
}