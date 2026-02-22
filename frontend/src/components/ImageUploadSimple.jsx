import { useState, useRef } from "react";
import API from "../services/api";

const ImageUploadSimple = ({
  label,
  onUploadSuccess,
  onUploadError,
  folder,
  fileName,
  accept = "image/*",
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setUploadCompleted(false); // Reset upload completion when new file is selected
        setError(null);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("fileName", fileName || `${Date.now()}-${file.name}`);

      const response = await API.post("/imagekit/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setPreview(response.data.url);
        setUploadCompleted(true);
        onUploadSuccess(response.data);
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Upload failed";
      setError(errorMessage);
      onUploadError(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setUploadCompleted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      <label className="upload-label">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="file-input"
        disabled={uploading}
      />

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          <button type="button" onClick={handleRemove} className="remove-btn">
            ×
          </button>
        </div>
      )}

      {preview && !uploading && !uploadCompleted && (
        <button type="button" onClick={handleUpload} className="upload-btn">
          Upload to Cloud
        </button>
      )}

      {preview && !uploading && uploadCompleted && (
        <div className="upload-success">
          <div className="success-message">✓ Uploaded successfully</div>
          <button
            type="button"
            onClick={() => setUploadCompleted(false)}
            className="reupload-btn"
          >
            Choose Different Image
          </button>
        </div>
      )}

      {uploading && (
        <div className="uploading">
          <div className="spinner"></div>
          Uploading...
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <style jsx>{`
        .image-upload {
          margin: 16px 0;
          padding: 18px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e6e6e6;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
          transition: 0.3s ease;
        }

        .image-upload:hover {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        }

        .upload-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #222;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          font-size: 14px;
          transition: 0.2s ease;
          cursor: pointer;
        }

        .file-input:hover {
          border-color: #007bff;
        }

        .file-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
        }

        .preview-container {
          position: relative;
          margin-top: 15px;
          display: inline-block;
        }

        .preview-image {
          max-width: 220px;
          max-height: 220px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid #e0e0e0;
          transition: 0.3s ease;
        }

        .preview-image:hover {
          transform: scale(1.03);
        }

        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ff4d4f;
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 77, 79, 0.3);
          transition: 0.2s ease;
        }

        .remove-btn:hover {
          background: #d9363e;
          transform: scale(1.1);
        }

        .upload-btn {
          margin-top: 14px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: 0.3s ease;
        }

        .upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
        }

        .upload-success {
          margin-top: 14px;
          padding: 12px;
          border-radius: 10px;
          background: #f0fff4;
          border: 1px solid #b7eb8f;
        }

        .success-message {
          color: #ffffff;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .reupload-btn {
          padding: 6px 14px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: 0.2s ease;
        }

        .reupload-btn:hover {
          background: #495057;
        }

        .uploading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 12px;
          font-size: 14px;
          color: #555;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-message {
          color: #ff4d4f;
          font-size: 13px;
          margin-top: 8px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ImageUploadSimple;
