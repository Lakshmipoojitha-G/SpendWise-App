import { useState } from "react";
import { authAPI } from "../api";

function Profile({ user, onSave, onLogout, onBack }) {
    const [name, setName] = useState(user.name || "");
    const [currency, setCurrency] = useState(user.currency || "INR");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        setLoading(true);
        try {
            const updatedUser = await authAPI.updateProfile({ name: name.trim(), currency });
            onSave(updatedUser);
        } catch (err) {
            setError(err?.name?.[0] || err?.error || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    }

    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—";

    return (
        <div className="profile-page">
            <div className="profile-container">
                <button className="back-button" onClick={onBack}>
                    ← Back to Dashboard
                </button>

                <div className="profile-header">
                    <div className="large-avatar">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <span className="eyebrow">ACCOUNT</span>
                        <h1>My Profile</h1>
                        <p>Manage your SpendWise account information.</p>
                    </div>
                </div>

                <div className="profile-grid">
                    <section className="profile-card">
                        <span className="eyebrow">PERSONAL DETAILS</span>

                        <h2>Account information</h2>

                        <form onSubmit={handleSubmit}>
                            <label>Full name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                            />

                            <label>Email address</label>
                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                style={{ opacity: 0.6, cursor: "not-allowed" }}
                                title="Email cannot be changed"
                            />

                            <label>Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="INR">₹ Indian Rupee (INR)</option>
                                <option value="USD">$ US Dollar (USD)</option>
                                <option value="EUR">€ Euro (EUR)</option>
                                <option value="GBP">£ British Pound (GBP)</option>
                            </select>

                            {error && (
                                <div className="form-error">{error}</div>
                            )}

                            <button className="primary-button" disabled={loading}>
                                {loading ? "Saving…" : "Save Changes"}
                            </button>
                        </form>
                    </section>

                    <section className="profile-card account-card">
                        <span className="eyebrow">ACCOUNT STATUS</span>

                        <div className="status-row">
                            <span>Account</span>
                            <strong>Active</strong>
                        </div>

                        <div className="status-row">
                            <span>Authentication</span>
                            <strong>Email & Password</strong>
                        </div>

                        <div className="status-row">
                            <span>Data storage</span>
                            <strong>PostgreSQL Cloud</strong>
                        </div>

                        <div className="status-row">
                            <span>Member since</span>
                            <strong>{memberSince}</strong>
                        </div>

                        <button
                            className="danger-button full"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Profile;