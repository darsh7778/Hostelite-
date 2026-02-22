import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/StudentProfile.css";

export default function AdminStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/profile/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

const handleUpdate = async () => {
  try {
    const updatedData = {
      fullName: profile.fullName,
      fatherName: profile.fatherName,
      motherName: profile.motherName,
      phone: profile.phone,
      address: profile.address,
      aadhaarNumber: profile.aadhaarNumber,
    };

    const res = await API.put(`/profile/${id}`, updatedData);

    //  Use returned updated profile directly
    if (res.data.profile) {
      setProfile(res.data.profile);
    } else {
      setProfile(res.data);
    }

    setIsEditing(false);

    alert("Profile updated successfully");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Update failed");
  }
};

const downloadPDF = async () => {
  try {
    const response = await API.get(`/profile/download/${profile.user._id}`, { responseType: "blob" });


    if (response.data.size === 0) {
      alert("PDF is empty or not generated");
      return;
    }

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Student_Profile.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(error);
    alert("Failed to download PDF");
  }
};


  if (loading) return (
    <div className="profile-container">
      <div className="profile-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Loading student profile...</p>
        </div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="profile-container">
      <div className="profile-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#dc2626', fontSize: '16px' }}>Profile not found</p>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin')}
            style={{ marginTop: '16px' }}
          >
            ← Back to Admin
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          ← Back to Admin
        </button>

        <div className="profile-header">
          <h1 className="profile-title">Student Profile Management</h1>
          <p className="profile-subtitle">
            {isEditing ? "Edit student information" : "View student profile details"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="btn-group" style={{ marginBottom: '32px' }}>
          <button 
            className={`btn ${isEditing ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '✕ Cancel Editing' : '✏️ Edit Profile'}
          </button>
          <button className="btn btn-secondary" onClick={downloadPDF}>
            📄 Download PDF
          </button>
        </div>

        {/* Profile Summary Section */}
        <div className="profile-view-header" style={{ alignItems: 'center', gap: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <div className="avatar-section" style={{ flexShrink: 0, marginBottom: '0' }}>
            <div className="avatar-container" style={{ position: 'relative', marginBottom: '16px' }}>
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `http://localhost:5001/${profile.profilePhoto}`}
                  alt="Profile"
                  className="profile-photo"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '3px solid #ffffff',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="avatar-placeholder" style={{ 
                display: profile.profilePhoto ? 'none' : 'flex',
                width: '120px', 
                height: '120px', 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
              }}>
                <span>👤</span>
              </div>
              <div className="status-badge" style={{ 
                position: 'absolute', 
                bottom: '8px', 
                right: '8px',
                background: '#10b981',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                zIndex: 10
              }}>
                <span className="status-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  background: 'white', 
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></span>
                {profile.user?.email ? 'Active' : 'Pending'}
              </div>
            </div>
          </div>
          <div className="profile-summary">
            <h2 className="profile-name" style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1e293b', 
              margin: '0 0 4px 0',
              lineHeight: '1.2'
            }}>
              {profile.fullName || 'N/A'}
            </h2>
            <p className="profile-status" style={{ 
              margin: '0', 
              fontSize: '14px', 
              color: '#10b981',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📧 {profile.user?.email || 'No email'}
            </p>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="profile-info-grid">
          <div className="info-item">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <div className="info-label">Full Name</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  value={profile.fullName || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              ) : (
                <div className="info-value">{profile.fullName || 'N/A'}</div>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">👨</div>
            <div className="info-content">
              <div className="info-label">Father Name</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  value={profile.fatherName || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, fatherName: e.target.value })
                  }
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              ) : (
                <div className="info-value">{profile.fatherName || 'N/A'}</div>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">👩</div>
            <div className="info-content">
              <div className="info-label">Mother Name</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  value={profile.motherName || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, motherName: e.target.value })
                  }
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              ) : (
                <div className="info-value">{profile.motherName || 'N/A'}</div>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📱</div>
            <div className="info-content">
              <div className="info-label">Phone Number</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              ) : (
                <div className="info-value">{profile.phone || 'N/A'}</div>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📍</div>
            <div className="info-content">
              <div className="info-label">Address</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  value={profile.address || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              ) : (
                <div className="info-value">{profile.address || 'N/A'}</div>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">🆔</div>
            <div className="info-content">
              <div className="info-label">Aadhaar Number</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  value={profile.aadhaarNumber || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, aadhaarNumber: e.target.value })
                  }
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              ) : (
                <div className="info-value">{profile.aadhaarNumber || 'N/A'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="btn-group" style={{ marginTop: '32px' }}>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              ✕ Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              ✓ Save Changes
            </button>
          </div>
        )}

        {/* Document Photos Section */}
        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>📋 Document Photos</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Profile Photo */}
            {profile.profilePhoto && (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>👤 Profile Photo</h4>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `http://localhost:5001/${profile.profilePhoto}`}
                    alt="Profile"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      maxHeight: '200px',
                      border: '2px solid #e2e8f0', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    onError={(e) => {
                      e.target.src = '/placeholder-profile.svg';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Aadhaar Photo */}
            {profile.aadhaarPhoto && (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>🆔 Aadhaar Card</h4>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={profile.aadhaarPhoto.startsWith('http') ? profile.aadhaarPhoto : `http://localhost:5001/${profile.aadhaarPhoto}`}
                    alt="Aadhaar"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      maxHeight: '200px',
                      border: '2px solid #e2e8f0', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    onError={(e) => {
                      e.target.src = '/placeholder-aadhaar.svg';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {!profile.profilePhoto && !profile.aadhaarPhoto && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              background: '#f8fafc', 
              borderRadius: '12px',
              border: '1px dashed #cbd5e1'
            }}>
              <p style={{ color: '#64748b', fontSize: '14px' }}>📷 No document photos available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
