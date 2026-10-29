import { useState } from "react";
import { authAPI } from "../api";

// Clean, modern inline SVG icons
function MailIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

function Login({ onLogin }) {
    const [mode, setMode] = useState("login"); // "login" | "register"

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        setPassword("");
        setPassword2("");
        if (nextMode === "register") {
            setName("");
        }
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
        if (err?.email) {
            const emailError = Array.isArray(err.email) ? err.email[0] : err.email;
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
            return Array.isArray(err.password) ? err.password[0] : err.password;
        }
        if (err?.name) {
            return Array.isArray(err.name) ? err.name[0] : err.name;
        }
        if (err?.password2) {
            return Array.isArray(err.password2) ? err.password2[0] : err.password2;
        }
        if (err?.non_field_errors) {
            return Array.isArray(err.non_field_errors) ? err.non_field_errors[0] : err.non_field_errors;
        }
        if (err?.error) {
            return err.error;
        }

        return "Could not connect to the server or invalid credentials. Please try again.";
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        const normalizedEmail = email.trim().toLowerCase();

        // ---------------- LOGIN ----------------
        if (mode === "login") {
            if (!normalizedEmail || !password) {
                setError("Please enter both email and password.");
                return;
            }

            setLoading(true);

            try {
                const user = await authAPI.login({
                    email: normalizedEmail,
                    password,
                });
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
                email: normalizedEmail,
                password,
                password2,
            });

            setSuccess("Account created successfully! Please sign in with your credentials.");
            setMode("login");
            setPassword("");
            setPassword2("");
            setName("");
            setEmail(normalizedEmail);
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

            {/* LEFT VISUAL HERO SIDE */}
            <div className="login-visual">
                <div className="visual-content">
                    <div className="login-brand">
                        <div className="brand-mark large">S</div>
                        <span>
                            Spend<span>Wise</span>
                        </span>
                    </div>

                    <span className="eyebrow light">PERSONAL FINANCE INTELLIGENCE</span>

                    <h1>
                        Your money.
                        <br />
                        <span>Your decisions.</span>
                    </h1>

                    <p>
                        Understand your spending, stay within your budget, and build lasting financial habits with real-time tracking.
                    </p>

                    <div className="feature-pills">
                        <div>
                            <span><CheckIcon /></span>
                            Track expenses
                        </div>
                        <div>
                            <span><CheckIcon /></span>
                            Smart analytics
                        </div>
                        <div>
                            <span><CheckIcon /></span>
                            Budget controls
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
                        <div className="floating-icon">₹</div>
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

            {/* RIGHT FORM SIDE */}
            <div className="login-panel">
                <div className="login-box">
                    {/* MOBILE BRAND */}
                    <div className="mobile-login-brand">
                        <div className="brand-mark">S</div>
                        <span>
                            Spend<span>Wise</span>
                        </span>
                    </div>

                    {/* SEGMENTED AUTH TABS */}
                    <div className="auth-tabs" role="tablist">
                        <button
                            role="tab"
                            aria-selected={mode === "login"}
                            className={`auth-tab ${mode === "login" ? "active" : ""}`}
                            onClick={() => switchMode("login")}
                            type="button"
                        >
                            Sign In
                        </button>
                        <button
                            role="tab"
                            aria-selected={mode === "register"}
                            className={`auth-tab ${mode === "register" ? "active" : ""}`}
                            onClick={() => switchMode("register")}
                            type="button"
                        >
                            Create Account
                        </button>
                    </div>

                    {/* HEADING */}
                    <div className="login-heading">
                        <span className="eyebrow">
                            {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
                        </span>
                        <h2>
                            {mode === "login" ? (
                                <>
                                    Sign in to your
                                    <br />
                                    SpendWise account
                                </>
                            ) : (
                                <>
                                    Join SpendWise
                                    <br />
                                    free today
                                </>
                            )}
                        </h2>
                        <p>
                            {mode === "login"
                                ? "Enter your email and password to access your dashboard."
                                : "Create your account and start managing your finances."}
                        </p>
                    </div>

                    {/* SUCCESS BANNER */}
                    {success && (
                        <div className="login-success">
                            <CheckIcon />
                            <div>{success}</div>
                        </div>
                    )}

                    {/* ERROR BANNER */}
                    {error && (
                        <div className="login-error">
                            <AlertIcon />
                            <div>{error}</div>
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* FULL NAME (Register only) */}
                        {mode === "register" && (
                            <div className="login-field">
                                <label htmlFor="auth-name">Full Name</label>
                                <div className="input-wrapper">
                                    <span className="field-icon"><UserIcon /></span>
                                    <input
                                        id="auth-name"
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        {/* EMAIL */}
                        <div className="login-field">
                            <label htmlFor="auth-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="field-icon"><MailIcon /></span>
                                <input
                                    id="auth-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="login-field">
                            <div className="field-label-row">
                                <label htmlFor="auth-password">Password</label>
                            </div>
                            <div className="input-wrapper">
                                <span className="field-icon"><LockIcon /></span>
                                <input
                                    id="auth-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={
                                        mode === "register" ? "At least 8 characters" : "Enter your password"
                                    }
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {mode === "register" && (
                                <small className="password-hint">
                                    At least 8 characters, including 1 uppercase, 1 lowercase & 1 number.
                                </small>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD (Register only) */}
                        {mode === "register" && (
                            <div className="login-field">
                                <label htmlFor="auth-password2">Confirm Password</label>
                                <div className="input-wrapper">
                                    <span className="field-icon"><LockIcon /></span>
                                    <input
                                        id="auth-password2"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Re-type your password"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        )}

                        {/* SUBMIT BUTTON */}
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
                                    : "Create Account"}
                            </span>
                            {!loading && <ArrowRightIcon />}
                        </button>
                    </form>

                    {/* FOOTER */}
                    <p className="login-footer">
                        SpendWise · Smart Personal Expense & Budget Management
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
