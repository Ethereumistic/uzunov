# Phase 11e — End-to-End Test: Create → View on Public Site

> **Prerequisite:** Phase 11d completed (editor with live preview).
> **Commit message suggestion:** `test: verify end-to-end create → view on public site`

---

## Objective

Manually verify the complete flow: create a new project in the admin panel, save it, and view it on the public-facing website. Fix any integration issues that come up.

---

## Test Steps

### 1. Create a new project via admin

1. Navigate to `/admin/projects/new`
2. Fill in all fields:
   - **BG Title:** "Тестова Сграда - Габрово"
   - **EN Title:** "Test Building - Gabrovo"
   - **Slug:** auto-generates to "testova-sgrada-gabrovo"
   - **Description BG/EN**
   - **Category:** Office
   - **Status:** done
   - **Featured:** toggle on
   - **Location BG/EN**
   - **Area:** 1500
   - **Investor BG/EN**
   - **Completion Date:** 2024-01-01
3. Switch to BG tab — verify all BG fields are shown
4. Switch to EN tab — verify all EN fields are shown
5. Verify live preview updates in real-time

### 2. Upload an image

1. Drop/select an image in the main image drop zone
2. Wait for the upload + WebP conversion to complete
3. Verify the image appears in the preview's carousel
4. Add 2-3 extra images
5. Set AR badges (L, S, V) on images
6. Verify bento grid updates in the preview

### 3. Add awards and details

1. Add an award with BG + EN text
2. Add a sub-building with BG/EN name and area
3. Verify these appear in the preview's detail card

### 4. Save/publish the project

1. Click "Publish"
2. Verify redirect to `/admin/projects`
3. Verify the new project appears in the table
4. Verify the thumbnail, title, category, and status are correct

### 5. View on public site

1. Navigate to `/projects`
2. Verify the new project appears in the grid
3. Click on the project card
4. Verify the project detail page at `/projects/testova-sgrada-gabrovo` renders correctly
5. Verify all fields (title, description, location, investor, etc.) display in Bulgarian
6. Verify images render correctly (WebP from Convex storage)
7. Verify awards and sub-buildings display correctly

### 6. Edit the project

1. Go back to `/admin/projects`
2. Click the edit icon on the test project
3. Verify the form is pre-populated with all existing data
4. Change a field (e.g., add "РЕДАКТИРАНО" to the title)
5. Save the changes
6. Verify changes appear on the public site

### 7. Delete the project

1. Go to `/admin/projects`
2. Click the delete icon on the test project
3. Confirm in the dialog
4. Verify the project is removed from the list
5. Verify `/projects` no longer shows the project
6. Verify `/projects/testova-sgrada-gabrovo` returns "not found"

---

## Common Issues to Watch For

| Issue | Cause | Fix |
|-------|-------|-----|
| Images not showing in preview | `storageId` not resolved to URL yet | Add loading state or use `useQuery` for URL resolution |
| Slug not auto-populating | `slugify` not imported or `slugManuallyEdited` stuck at `true` | Reset `slugManuallyEdited` on title change |
| Convex mutation error on create | Argument type mismatch (string vs number for `area`) | Ensure `parseFloat()` is called before passing to mutation |
| 404 on public project page | Route param is `$slug` but Convex query uses different field | Verify `getBySlug` query matches the route param |
| WebP images too large | Sharp quality setting too high | Lower quality in `convertToWebp` (default 82 is usually fine) |
| Auth error on mutations | Not authenticated | Verify auth guard in `_layout.tsx` and `getUserIdentity()` in mutations |

---

## Files Touched

None (this is a validation phase). Fix any bugs found during testing.

---

## Validation Checklist

- [ ] New project can be created via admin form
- [ ] All form fields save correctly to Convex
- [ ] Images upload, convert to WebP, and display in the public site
- [ ] AR badges (L/S/V) are saved and affect bento grid layout
- [ ] Awards and sub-buildings save and display correctly
- [ ] Public project list (`/projects`) shows the new project
- [ ] Public project detail (`/projects/{slug}`) renders all fields
- [ ] Edit flow pre-populates all fields correctly
- [ ] Delete flow works and removes from Convex
- [ ] Auth guard works — unauthenticated users can't access admin