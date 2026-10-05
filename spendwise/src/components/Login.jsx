import { useState } from "react";
import { authAPI } from "../api";

function Login({ onLogin }) {
    const [mode, setMode] = useState("login"); // "login" | "register"

    // Shared fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Register fields
    const [name, setName] = useState("");
    const [password2, setPassword2] = useState("");

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    function switchMode(nextMode) {
        setMode(nextMode);
        setError("");
        setSuccess("");
        setEmail("");
        setPassword("");
        setPassword2("");
        setName("");
    }

    function validateRegistration() {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            return "Please enter your full name.";
        }

        if (trimmedName.length < 2) {
            return "Name must contain at least 2 characters.";
        }

        if (!trimmedEmail) {
            return "Please enter your email address.";
        }

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {
            return "Please enter a valid email address.";
        }

        if (!password) {
            return "Please create a password.";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (!password2) {
            return "Please confirm your password.";
        }

        if (password !== password2) {
            return "Passwords do not match.";
        }

        return null;
    }

    function getErrorMessage(err) {
        // Django may return:
        // { email: ["user with this email already exists."] }

        if (err?.email) {
            const emailError = Array.isArray(err.email)
                ? err.email[0]
                : err.email;

            if (
                emailError?.toLowerCase().includes("already") ||
                emailError?.toLowerCase().includes("exists") ||
                emailError?.toLowerCase().includes("unique")
            ) {
                return "An account with this email already exists. Please sign in instead.";
            }

            return emailError;
        }

        if (err?.password) {
            return Array.isArray(err.password)
                ? err.password[0]
                : err.password;
        }

        if (err?.name) {
            return Array.isArray(err.name)
                ? err.name[0]
                : err.name;
        }

        if (err?.password2) {
            return Array.isArray(err.password2)
                ? err.password2[0]
                : err.password2;
        }

        if (err?.non_field_errors) {
            return Array.isArray(err.non_field_errors)
                ? err.non_field_errors[0]
                : err.non_field_errors;
        }

        if (err?.error) {
            return err.error;
        }

        return "Something went wrong. Please try again.";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ---------------- LOGIN ----------------
        if (mode === "login") {
            if (!email.trim() || !password) {
                setError("Please enter your email and password.");
                return;
            }

            setLoading(true);

            try {
                const user = await authAPI.login({
                    email: email.trim(),
                    password,
                });

                // Successful login → Dashboard
                onLogin(user);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }

            return;
        }

        // ---------------- REGISTER ----------------
        const validationError = validateRegistration();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await authAPI.register({
                name: name.trim(),
                email: email.trim(),
                password,
                password2,
            });

            /*
             * IMPORTANT:
             * We do NOT call onLogin() here.
             *
             * Registration is successful, so we send the
             * user back to the Login form.
             */

            setSuccess(
                "Account created successfully! Please sign in with your new account."
            );

            // Keep email so the user doesn't need to type it again
            const registeredEmail = email.trim();

            setMode("login");
            setName("");
            setPassword("");
            setPassword2("");
            setEmail(registeredEmail);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">

            {/* BACKGROUND DECORATION */}
            <div className="login-background">
                <div className="glow glow-one"></div>
                <div className="glow glow-two"></div>
                <div className="glow glow-three"></div>
                <div className="grid-pattern"></div>
            </div>

            {/* LEFT VISUAL SIDE */}
            <div className="login-visual">

                <div className="visual-content">

                    <div className="login-brand">
                        <div className="brand-mark large">
                            S
                        </div>

                        <span>
                            Spend<span>Wise</span>
                        </span>
                    </div>

                    <span className="eyebrow light">
                        PERSONAL FINANCE INTELLIGENCE
                    </span>

                    <h1>
                        Your money.
                        <br />
                        <span>Your decisions.</span>
                    </h1>

                    <p>
                        Understand your spending, stay within your
                        budget and build better financial habits.
                    </p>

                    {/* FEATURE PILLS */}
                    <div className="feature-pills">

                        <div>
                            <span>✓</span>
                            Track expenses
                        </div>

                        <div>
                            <span>✓</span>
                            Smart insights
                        </div>

                        <div>
                            <span>✓</span>
                            Budget better
                        </div>

                    </div>

                </div>

                {/* ANIMATED FINANCE VISUAL */}
                <div className="finance-visual">

                    {/* MAIN CARD */}
                    <div className="money-card">

                        <div className="money-card-top">
                            <span>MONTHLY SPENDING</span>
                            <span>•••</span>
                        </div>

                        <strong>₹24,580</strong>

                        <div className="mini-chart">
                            <span style={{ height: "35%" }}></span>
                            <span style={{ height: "55%" }}></span>
                            <span style={{ height: "42%" }}></span>
                            <span style={{ height: "72%" }}></span>
                            <span style={{ height: "60%" }}></span>
                            <span style={{ height: "86%" }}></span>
                            <span style={{ height: "75%" }}></span>
                            <span style={{ height: "95%" }}></span>
                        </div>

                        <div className="money-card-bottom">
                            <span>This month</span>
                            <strong>+12.4%</strong>
                        </div>

                    </div>

                    {/* FLOATING BALANCE CARD */}
                    <div className="floating-finance-card balance-card">

                        <div className="floating-icon">
                            ₹
                        </div>

                        <div>
                            <small>Available</small>
                            <strong>₹18,420</strong>
                        </div>

                    </div>

                    {/* FLOATING BUDGET CARD */}
                    <div className="floating-finance-card budget-floating">

                        <div className="budget-circle">
                            <span>72%</span>
                        </div>

                        <div>
                            <small>Budget used</small>
                            <strong>On track</strong>
                        </div>

                    </div>

                    {/* FLOATING COINS */}
                    <div className="coin coin-one">₹</div>
                    <div className="coin coin-two">₹</div>
                    <div className="coin coin-three">₹</div>

                </div>

            </div>

            {/* LOGIN / REGISTER SIDE */}
            <div className="login-panel">

                <div className="login-box">

                    {/* MOBILE BRAND */}
                    <div className="mobile-login-brand">

                        <div className="brand-mark">
                            S
                        </div>

                        <span>
                            Spend<span>Wise</span>
                        </span>

                    </div>

                    {/* MODE TABS */}
                    <div className="auth-tabs">

                        <button
                            className={`auth-tab ${
                                mode === "login" ? "active" : ""
                            }`}
                            onClick={() => switchMode("login")}
                            type="button"
                        >
                            Sign In
                        </button>

                        <button
                            className={`auth-tab ${
                                mode === "register" ? "active" : ""
                            }`}
                            onClick={() => switchMode("register")}
                            type="button"
                        >
                            Create Account
                        </button>

                    </div>

                    {/* HEADING */}
                    <div className="login-heading">

                        <span className="eyebrow">
                            {mode === "login"
                                ? "WELCOME BACK"
                                : "GET STARTED"}
                        </span>

                        <h2>
                            {mode === "login" ? (
                                <>
                                    Let's make your
                                    <br />
                                    money work smarter.
                                </>
                            ) : (
                                <>
                                    Join SpendWise
                                    <br />
                                    for free today.
                                </>
                            )}
                        </h2>

                        <p>
                            {mode === "login"
                                ? "Sign in to continue to your financial dashboard."
                                : "Create your account and start tracking instantly."}
                        </p>

                    </div>

                    {/* SUCCESS MESSAGE */}
                    {success && (
                        <div className="login-success">
                            <span>✓</span>
                            {success}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit}>

                        {/* NAME */}
                        {mode === "register" && (
                            <div className="login-field">

                                <label>Full name</label>

                                <div className="input-wrapper">

                                    <span>👤</span>

                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        autoComplete="name"
                                    />

                                </div>

                            </div>
                        )}

                        {/* EMAIL */}
                        <div className="login-field">

                            <label>Email address</label>

                            <div className="input-wrapper">

                                <span>✉</span>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}
                        <div className="login-field">

                            <label>Password</label>

                            <div className="input-wrapper">

                                <span>⌑</span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder={
                                        mode === "register"
                                            ? "Create a password"
                                            : "Enter your password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete={
                                        mode === "register"
                                            ? "new-password"
                                            : "current-password"
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                            {/* Password requirements */}
                            {mode === "register" && (
                                <small className="password-hint">
                                    At least 8 characters, including
                                    uppercase, lowercase and a number.
                                </small>
                            )}

                        </div>

                        {/* CONFIRM PASSWORD */}
                        {mode === "register" && (
                            <div className="login-field">

                                <label>Confirm password</label>

                                <div className="input-wrapper">

                                    <span>⌑</span>

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Repeat your password"
                                        value={password2}
                                        onChange={(e) =>
                                            setPassword2(e.target.value)
                                        }
                                        autoComplete="new-password"
                                    />

                                </div>

                            </div>
                        )}

                        {/* ERROR */}
                        {error && (
                            <div className="login-error">
                                <span>!</span>
                                {error}
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >

                            <span>
                                {loading
                                    ? "Please wait…"
                                    : mode === "login"
                                    ? "Sign in to SpendWise"
                                    : "Create my account"}
                            </span>

                            {!loading && <span>→</span>}

                        </button>

                    </form>

                    <p className="login-footer">
                        SpendWise · Personal Finance Dashboard
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;