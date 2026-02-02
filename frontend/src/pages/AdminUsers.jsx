import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    roomNumber: "", // NEW
  });
  const [processingUser, setProcessingUser] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const highlight = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      roomNumber: user.roomNumber || "", // NEW
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "student", roomNumber: "" }); // NEW
  };

  const submitEdit = async (id) => {
    try {
      setProcessingUser(id);
      await API.put(`/users/${id}`, formData);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...formData } : u))
      );

      // ---------------- UPDATE LOCAL STORAGE FOR LOGGED-IN STUDENT ----------------
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser._id === id) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, ...formData })
        );
      }
      // ------------------------------------------------------------------------------

      cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setProcessingUser(null);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setProcessingUser(id);
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setProcessingUser(null);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-users-container">
      <div className="users-card">
        <h2>Manage Users</h2>

        <input
          type="text"
          className="search-input"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Room Number</th> {/* NEW */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    ) : (
                      <span
                        className="user-name"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        {highlight(user.name)}
                      </span>
                    )}
                  </td>

                  <td>
                    {editingUser === user._id ? (
                      <input
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    ) : (
                      highlight(user.email)
                    )}
                  </td>

                  <td>
                    {editingUser === user._id ? (
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      >
                        <option value="student">Student</option>
                        <option value="warden">Warden</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>

                  <td>
                    {editingUser === user._id ? (
                      <input
                        value={formData.roomNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            roomNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.roomNumber || "-" // show "-" if not assigned
                    )}
                  </td>

                  <td>
                    {user.role !== "admin" ? (
                      editingUser === user._id ? (
                        <div className="action-buttons">
                          <button
                            className="save-btn"
                            onClick={() => submitEdit(user._id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => startEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )
                    ) : (
                      "Admin"
                    )}

                    {processingUser === user._id && (
                      <span className="processing-text"> Processing...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
