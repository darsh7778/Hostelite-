import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function AdminStudentProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/profile/${id}`);
      setProfile(res.data);
    } catch (err) {
      alert("Failed to fetch profile");
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


  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Student Profile</h2>
      

      {/* Edit Button */}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit Profile"}
      </button>

      <button
        onClick={downloadPDF}
      >
        Download PDF
      </button>

      <hr />

      {/* Full Name */}
      <p>
        <strong>Full Name:</strong>{" "}
        {isEditing ? (
          <input
            value={profile.fullName || ""}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
          />
        ) : (
          profile.fullName
        )}
      </p>

      {/* Father Name */}
      <p>
        <strong>Father Name:</strong>{" "}
        {isEditing ? (
          <input
            value={profile.fatherName || ""}
            onChange={(e) =>
              setProfile({ ...profile, fatherName: e.target.value })
            }
          />
        ) : (
          profile.fatherName
        )}
      </p>

      {/* Mother Name */}
      <p>
        <strong>Mother Name:</strong>{" "}
        {isEditing ? (
          <input
            value={profile.motherName || ""}
            onChange={(e) =>
              setProfile({ ...profile, motherName: e.target.value })
            }
          />
        ) : (
          profile.motherName
        )}
      </p>

      {/* Phone */}
      <p>
        <strong>Phone:</strong>{" "}
        {isEditing ? (
          <input
            value={profile.phone || ""}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />
        ) : (
          profile.phone
        )}
      </p>

      {/* Address */}
      <p>
        <strong>Address:</strong>{" "}
        {isEditing ? (
          <input
            value={profile.address || ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
          />
        ) : (
          profile.address
        )}
      </p>

      {/* Aadhaar Number */}
      <p>
        <strong>Aadhaar:</strong>{" "}
        {isEditing ? (
          <input
            value={profile.aadhaarNumber || ""}
            onChange={(e) =>
              setProfile({ ...profile, aadhaarNumber: e.target.value })
            }
          />
        ) : (
          profile.aadhaarNumber
        )}
      </p>

      {isEditing && (
        <button onClick={handleUpdate}>Save Changes</button>
      )}

      <hr />

      {/* Profile Photo */}
      {profile.profilePhoto && (
        <div>
          <h4>Profile Photo</h4>
          <img
            src={`http://localhost:5001/${profile.profilePhoto}`}
            alt="Profile"
            width="200"
          />
        </div>
      )}

      {/* Aadhaar Photo */}
      {profile.aadhaarPhoto && (
        <div>
          <h4>Aadhaar Card</h4>
          <img
            src={`http://localhost:5001/${profile.aadhaarPhoto}`}
            alt="Aadhaar"
            width="300"
          />
        </div>
      )}
    </div>
  );
}
