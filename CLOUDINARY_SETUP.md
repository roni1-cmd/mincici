# Cloudinary Setup Guide for mincici

## Issue
You're getting "Upload failed: Bad Request" error when uploading images.

## Root Cause
The upload preset `ml_default` needs to be created in your Cloudinary account as an **unsigned** preset.

## Solution - Create Upload Preset

1. **Go to Cloudinary Dashboard**
   - Visit: https://cloudinary.com/console
   - Login with your account

2. **Navigate to Upload Settings**
   - Click on "Settings" (gear icon) in top right
   - Select "Upload" from the left sidebar
   - Scroll down to "Upload presets" section

3. **Create New Unsigned Preset**
   - Click "Add upload preset"
   - **Preset name**: `ml_default` (must match exactly)
   - **Signing mode**: Select "Unsigned" ⚠️ IMPORTANT
   - **Folder**: (optional) You can specify a folder like "mincici-uploads"
   - **Access mode**: Public (recommended for social media)
   - Click "Save"

4. **Verify Settings**
   Your preset should have:
   - Name: `ml_default`
   - Mode: Unsigned ✓
   - Status: Enabled ✓

## Current Configuration
```javascript
cloudName: 'dwnzxkata'
uploadPreset: 'ml_default'
```

## Alternative: Use Existing Preset
If you already have an unsigned preset, update `/app/frontend/src/config/cloudinary.js`:

```javascript
export const cloudinaryConfig = {
  cloudName: 'dwnzxkata',
  uploadPreset: 'your-existing-preset-name' // Change this
};
```

## Testing
After creating the preset:
1. Refresh your app
2. Try uploading an image in a post
3. Should upload successfully to Cloudinary

## Support
If issues persist, check:
- Cloudinary account status
- Upload preset is "Unsigned"
- Cloud name is correct: `dwnzxkata`
