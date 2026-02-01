// src/components/GetStartedForm.jsx
// import "../styles/GetStartedForm.css";

export default function GetStartedForm() {
  return (
    <div className="getform-container">
      <h2>Get Started with Hostelite 🚀</h2>
      <p>Please fill the form. Our team will contact you shortly.</p>

      <form
        action=""https://getform.io/f/ajjjyqja" method="POST"
        method="POST"
        className="getform"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
        />

        <select name="role" required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
          <option value="admin">Admin</option>
        </select>

        <textarea
          name="message"
          placeholder="Tell us about your hostel / requirement"
        />

        {/* Optional redirect after submit */}
        <input
          type="hidden"
          name="_redirect"
          value="http://localhost:5173/thank-you"
        />

        <button type="submit" className="cta-primary">
          Submit Request →
        </button>
      </form>
    </div>
  );
}
