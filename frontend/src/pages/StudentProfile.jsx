import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const res = await API.get("/profile/me");
      if (res.data?.submitted) {
        setSubmitted(true);
        setFormData(res.data);
      }
    } catch (err) {
      console.log("No profile yet");
    }
    setLoading(false);
  };

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

    data.append("profilePhoto", profilePhoto);
    data.append("aadhaarPhoto", aadhaarPhoto);

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

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="profile-container">
      
      <button
        onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h2>Student Personal Profile</h2>

      {submitted ? (
        <div className="profile-view">
          <p><strong>Full Name:</strong> {formData.fullName}</p>
          <p><strong>Father Name:</strong> {formData.fatherName}</p>
          <p><strong>Mother Name:</strong> {formData.motherName}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>Aadhaar:</strong> {formData.aadhaarNumber}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">

          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          <p className="error">{errors.fullName}</p>

          <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
          <p className="error">{errors.fatherName}</p>

          <input name="motherName" placeholder="Mother Name" onChange={handleChange} />
          <p className="error">{errors.motherName}</p>

          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <p className="error">{errors.phone}</p>

          <input name="address" placeholder="Permanent Address" onChange={handleChange} />
          <p className="error">{errors.address}</p>

          <input name="aadhaarNumber" placeholder="Aadhaar Number" onChange={handleChange} />
          <p className="error">{errors.aadhaarNumber}</p>

          <label>Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setProfilePhoto(e.target.files[0]);
              setErrors({ ...errors, profilePhoto: "" });
            }}
          />
          <p className="error">{errors.profilePhoto}</p>

          <label>Upload Aadhaar Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAadhaarPhoto(e.target.files[0]);
              setErrors({ ...errors, aadhaarPhoto: "" });
            }}
          />
          <p className="error">{errors.aadhaarPhoto}</p>

          <button type="submit">Submit Profile</button>
        </form>
      )}
    </div>
  );
}
