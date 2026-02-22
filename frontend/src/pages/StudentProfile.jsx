import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ImageUploadSimple from "../components/ImageUploadSimple";
import "../styles/StudentProfile.css";

export default function StudentProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    phone: "",
    address: "",
    aadhaarNumber: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [aadhaarPhotoUrl, setAadhaarPhotoUrl] = useState("");

  const checkProfile = async () => {
    try {
      const res = await API.get("/profile/me");
      if (res.data?.submitted) {
        setSubmitted(true);
        setFormData(res.data);
        // Set profile photo URL if it exists in the response
        if (res.data.profilePhotoUrl) {
          setProfilePhotoUrl(res.data.profilePhotoUrl);
        }
        if (res.data.aadhaarPhotoUrl) {
          setAadhaarPhotoUrl(res.data.aadhaarPhotoUrl);
        }
      }
    } catch (err) {
      console.log("No profile yet");
    }
    setLoading(false);
  };

  useEffect(() => {
    checkProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full Name is required";

    if (!formData.fatherName.trim())
      newErrors.fatherName = "Father Name is required";

    if (!formData.motherName.trim())
      newErrors.motherName = "Mother Name is required";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.address.trim())
      newErrors.address = "Address is required";

    if (!formData.aadhaarNumber.trim())
      newErrors.aadhaarNumber = "Aadhaar number is required";
    else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber))
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";

    if (!profilePhoto && !submitted)
      newErrors.profilePhoto = "Profile photo is required";

    if (!aadhaarPhoto && !submitted)
      newErrors.aadhaarPhoto = "Aadhaar photo is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Add ImageKit URLs instead of files
    if (profilePhotoUrl) {
      data.append("profilePhotoUrl", profilePhotoUrl);
    }
    if (aadhaarPhotoUrl) {
      data.append("aadhaarPhotoUrl", aadhaarPhotoUrl);
    }

    try {
      await API.post("/profile/submit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile submitted successfully");
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (loading) return (
    <div className="profile-container">
      <div className="profile-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Loading profile...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="profile-header">
          <h1 className="profile-title">Student Personal Profile</h1>
          <p className="profile-subtitle">
            {submitted ? "Your submitted profile information" : "Complete your profile information"}
          </p>
        </div>

        {submitted ? (
          <div className="profile-view">
            <div className="profile-view-header">
              <div className="avatar-section">
                <div className="avatar-container">
                  <div className="avatar-placeholder" style={{ display: profilePhotoUrl ? 'none' : 'flex' }}>
                    <span>👤</span>
                  </div>
                  <div className="status-badge">
                    <span className="status-dot"></span>
                    Verified
                  </div>
                </div>
              </div>
              <div className="profile-summary">
                <h2 className="profile-name">{formData.fullName}</h2>
                <p className="profile-status">Profile Complete & Verified</p>
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="info-item">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">{formData.fullName}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">👨</div>
                <div className="info-content">
                  <div className="info-label">Father Name</div>
                  <div className="info-value">{formData.fatherName}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">👩</div>
                <div className="info-content">
                  <div className="info-label">Mother Name</div>
                  <div className="info-value">{formData.motherName}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📱</div>
                <div className="info-content">
                  <div className="info-label">Phone Number</div>
                  <div className="info-value">{formData.phone}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <div className="info-label">Address</div>
                  <div className="info-value">{formData.address}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🆔</div>
                <div className="info-content">
                  <div className="info-label">Aadhaar Number</div>
                  <div className="info-value">{formData.aadhaarNumber}</div>
                </div>
              </div>
            </div>
            
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
              </button>
              <button className="btn btn-primary">
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  name="fullName" 
                  className="profile-input"
                  placeholder="Enter your full name" 
                  value={formData.fullName}
                  onChange={handleChange} 
                />
                {errors.fullName && <p className="error">{errors.fullName}</p>}
              </div>
              <div className="input-group">
                <label className="input-label">Father Name</label>
                <input 
                  name="fatherName" 
                  className="profile-input"
                  placeholder="Enter father's name" 
                  value={formData.fatherName}
                  onChange={handleChange} 
                />
                {errors.fatherName && <p className="error">{errors.fatherName}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Mother Name</label>
                <input 
                  name="motherName" 
                  className="profile-input"
                  placeholder="Enter mother's name" 
                  value={formData.motherName}
                  onChange={handleChange} 
                />
                {errors.motherName && <p className="error">{errors.motherName}</p>}
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input 
                  name="phone" 
                  className="profile-input"
                  placeholder="10-digit phone number" 
                  value={formData.phone}
                  onChange={handleChange} 
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
            </div>

            <div className="form-row single">
              <div className="input-group">
                <label className="input-label">Permanent Address</label>
                <input 
                  name="address" 
                  className="profile-input"
                  placeholder="Enter your permanent address" 
                  value={formData.address}
                  onChange={handleChange} 
                />
                {errors.address && <p className="error">{errors.address}</p>}
              </div>
            </div>

            <div className="form-row single">
              <div className="input-group">
                <label className="input-label">Aadhaar Number</label>
                <input 
                  name="aadhaarNumber" 
                  className="profile-input"
                  placeholder="12-digit Aadhaar number" 
                  value={formData.aadhaarNumber}
                  onChange={handleChange} 
                />
                {errors.aadhaarNumber && <p className="error">{errors.aadhaarNumber}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="image-upload-section">
                <label className="image-upload-label">Profile Photo</label>
                <ImageUploadSimple
                  onUploadSuccess={(response) => {
                    setProfilePhotoUrl(response.url);
                    setProfilePhoto(response);
                    setErrors({ ...errors, profilePhoto: "" });
                  }}
                  onUploadError={(error) => {
                    setErrors({ ...errors, profilePhoto: "Upload failed" });
                  }}
                  folder="profile-photos"
                  fileName={`profile-${Date.now()}`}
                  accept="image/*"
                />
                {errors.profilePhoto && <p className="error">{errors.profilePhoto}</p>}
              </div>
              <div className="image-upload-section">
                <label className="image-upload-label">Aadhaar Card Photo</label>
                <ImageUploadSimple
                  onUploadSuccess={(response) => {
                    setAadhaarPhotoUrl(response.url);
                    setAadhaarPhoto(response);
                    setErrors({ ...errors, aadhaarPhoto: "" });
                  }}
                  onUploadError={(error) => {
                    setErrors({ ...errors, aadhaarPhoto: "Upload failed" });
                  }}
                  folder="aadhaar-cards"
                  fileName={`aadhaar-${Date.now()}`}
                  accept="image/*"
                />
                {errors.aadhaarPhoto && <p className="error">{errors.aadhaarPhoto}</p>}
              </div>
            </div>

            <div className="btn-group">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
