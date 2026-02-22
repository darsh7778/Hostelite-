# ImageKit Integration Setup Guide

This guide explains how to set up ImageKit for storing profile photos and Aadhaar cards in the Hostelite application.

## 1. Get ImageKit Credentials

1. Sign up at [ImageKit.io](https://imagekit.io/)
2. Create a new account or log in
3. Go to your dashboard → Developer Options
4. Note down these credentials:
   - Public Key
   - Private Key  
   - URL Endpoint (https://ik.imagekit.io/your_id)

## 2. Backend Setup

### Environment Variables
Add these to your `backend/.env` file:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here  
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### Dependencies
The following packages are already installed:
- `@imagekit/nodejs` - Backend SDK
- `multer` - File upload handling

### Key Files Created/Modified:
- `backend/utils/imagekit.js` - ImageKit configuration
- `backend/utils/uploadToImageKit.js` - Upload utility functions
- `backend/controllers/imagekitController.js` - Server-side upload endpoint
- `backend/routes/imagekitRoutes.js` - ImageKit API routes
- `backend/controllers/userProfileController.js` - Updated to use ImageKit
- `backend/models/UserProfile.js` - Added ImageKit file ID fields
- `backend/middleware/multer.js` - Updated for memory storage

## 3. Frontend Setup

### Environment Variables
Add these to your `frontend/.env` file:

```env
# ImageKit Configuration
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key_here
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
VITE_API_URL=http://localhost:5001
```

### Dependencies
The following packages are installed:
- `@imagekit/react` - React SDK for ImageKit

### Key Files Created/Modified:
- `frontend/src/utils/imagekit.js` - ImageKit configuration
- `frontend/src/components/ImageUpload.jsx` - Reusable upload component
- `frontend/src/pages/StudentProfile.jsx` - Updated to use ImageKit

## 4. Features

### ImageUpload Component
- **Preview**: Shows image preview before upload
- **Progress**: Shows upload progress indicator
- **Error Handling**: Displays upload errors
- **File Validation**: Only accepts image files
- **Remove Option**: Allows removing selected images

### Folder Structure in ImageKit
```
profile-photos/     # Student profile pictures
aadhaar-cards/      # Aadhaar card scans
```

### Upload Methods
1. **Client-side Upload** (Recommended): Direct upload from browser
2. **Server-side Upload**: Backend handles the upload

## 5. Usage Example

```jsx
import ImageUpload from '../components/ImageUpload';

<ImageUpload
  label="Upload Profile Photo"
  onUploadSuccess={(response) => {
    console.log('Upload successful:', response.url);
  }}
  onUploadError={(error) => {
    console.error('Upload failed:', error);
  }}
  folder="profile-photos"
  accept="image/*"
/>
```

## 6. API Endpoints

### POST `/api/imagekit/upload`
Server-side upload endpoint for image files.

Request:
```json
Content-Type: multipart/form-data
{
  "file": <image_file>,
  "folder": "profile-photos",
  "fileName": "custom-name.jpg"
}
```

Response:
```json
{
  "success": true,
  "url": "https://ik.imagekit.io/your_id/folder/filename.jpg",
  "fileId": "unique_file_id",
  "filePath": "folder/filename.jpg"
}
```

### POST `/api/profile/submit`
Accepts ImageKit URLs from frontend uploads.

## 7. Benefits of ImageKit

- **CDN Delivery**: Fast image delivery globally
- **Automatic Optimization**: Resizes and optimizes images
- **Storage**: No need to manage local file storage
- **Security**: Signed URLs for secure access
- **Transformations**: On-the-fly image manipulation

## 8. Migration from Local Storage

The application now supports both:
- **Old Method**: Local file storage (for backward compatibility)
- **New Method**: ImageKit cloud storage

Existing profiles with local storage will continue to work. New submissions will use ImageKit.

## 9. Troubleshooting

### Common Issues:
1. **Upload Failed**: Check ImageKit credentials in .env
2. **CORS Errors**: Ensure ImageKit URL endpoint is correct
3. **File Size Limits**: Default limit is 5MB per image
4. **Authentication Error**: Check private/public key pairing

### Debug Mode:
Enable debug logging by setting:
```env
DEBUG=imagekit:*
```

## 10. Security Considerations

- Private keys are never exposed to frontend
- Server-side uploads ensure secure file handling
- File type validation prevents malicious uploads
- Folder structure isolates different document types
- Memory storage prevents temporary files on disk

## 11. Next Steps

1. Set up ImageKit account and get credentials
2. Update environment variables
3. Test the upload functionality
4. Consider adding image transformations for avatars
5. Set up automatic cleanup of unused images
