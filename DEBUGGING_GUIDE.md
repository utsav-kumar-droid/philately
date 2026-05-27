# 🐛 Image Upload Debugging Guide

## What Changed:
- ✅ Removed explicit Content-Type header (axios handles FormData automatically now)
- ✅ Added console.log statements to track the upload process
- ✅ Backend now logs file upload details

## How to Test:

### Step 1: Open Browser Developer Tools
- Press `F12` or Right-click → Inspect
- Go to **Console** tab and **Network** tab

### Step 2: Create a New Blog Post
1. Click "Create New Post"
2. Enter Title and Content
3. **Select an image from your computer**
4. Click "Create Post"

### Step 3: Check Console Logs (Frontend)
Look for these messages in the browser console:
```
📸 Image selected: filename.jpg
✅ Post created: {...}
```

### Step 4: Check Network Tab
1. Look for a POST request to `/api/posts`
2. Check the request has:
   - **Headers:** Contains `Authorization: Bearer [token]`
   - **Payload:** Shows FormData with title, content, and image file
3. Response should be 201 with `success: true`

### Step 5: Check Server Logs
Look for these messages in the Terminal running Node:
```
📸 File upload debug: {
  hasFile: true,
  filename: "1234567890-filename.jpg",
  path: "uploads/1234567890-filename.jpg",
  mimetype: "image/jpeg"
}
✅ Post created with image: uploads/1234567890-filename.jpg
```

### Step 6: Verify Files on Disk
Check if image files exist:
```
/Backend/uploads/
├── 1234567890-image1.jpg
├── 1234567890-image2.png
└── ...
```

## Troubleshooting:

### ❌ "Image selected" console log doesn't appear
- → Image file not selected in form
- → Fix: Click on file input and select an image

### ❌ POST request fails (red in Network tab)
- → Check response error message
- → Could be: no auth token, image too large, wrong format

### ❌ Server logs show `hasFile: false`
- → Multer isn't receiving the file
- → Check if Content-Type header is set correctly (should be `multipart/form-data`)
- → Verify axios is sending FormData correctly

### ❌ Files appear in /uploads/ but images still don't show
- → Check the image URL in the post database
- → Go to http://localhost:5000/uploads/[filename] to test
- → Should display the image directly

### ❌ Server responds with image path, but frontend shows purple gradient
- → Image URL might be wrong
- → Check if `http://localhost:5000/${post.image}` is correct
- → Should result in: `http://localhost:5000/uploads/1234567890-filename.jpg`

## Debug Command:
To see what files are uploaded:
```bash
ls -la Backend/uploads/
```

Or on Windows (PowerShell):
```powershell
Get-ChildItem .\Backend\uploads\
```
