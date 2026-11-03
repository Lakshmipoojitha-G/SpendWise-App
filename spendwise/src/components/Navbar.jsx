
import { useEffect, useRef, useState } from "react";

function Navbar({
    user,
    theme,
    onToggleTheme,
    onDashboard,
    onTransactions,
    onAnalytics,
    onProfile,
    onLogoutRequest,
}) {
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    function handleDashboard() {
        setMobileOpen(false);
        setOpen(false);
        onDashboard();
    }

    function handleTransactions() {
        setMobileOpen(false);
        setOpen(false);
        onTransactions();
    }

    function handleAnalytics() {
        setMobileOpen(false);
        setOpen(false);
        onAnalytics();
    }

    function handleProfile() {
        setMobileOpen(false);
        setOpen(false);
        onProfile();
    }

    function handleThemeToggle() {
        setMobileOpen(false);
        onToggleTheme();
    }

    return (
        <nav className="navbar">

            {/* BRAND */}

            <button
                className="navbar-brand"
                onClick={handleDashboard}
                type="button"
            >
                <span className="brand-mark">S</span>

                <span className="brand-name">
                    Spend<span>Wise</span>
                </span>
            </button>

            {/* DESKTOP NAVIGATION */}

            <div className="nav-links">
                <button
                    className="nav-link-button"
                    onClick={handleDashboard}
                >
                    Dashboard
                </button>

                <button
                    className="nav-link-button"
                    onClick={handleTransactions}
                >
                    Transactions
                </button>

                <button
                    className="nav-link-button"
                    onClick={handleAnalytics}
                >
                    Analytics
                </button>
            </div>

            {/* RIGHT SIDE */}

            <div className="navbar-right">

                {/* THEME TOGGLE */}

                <button
                    className="navbar-theme-toggle"
                    onClick={handleThemeToggle}
                    type="button"
                    aria-label={
                        theme === "light"
                            ? "Switch to dark mode"
                            : "Switch to light mode"
                    }
                    title={
                        theme === "light"
                            ? "Switch to dark mode"
                            : "Switch to light mode"
                    }
                >
                    <span className="theme-icon">
                        {theme === "light" ? "🌙" : "☀️"}
                    </span>

                    <span className="theme-label">
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                </button>

                {/* PROFILE MENU */}

                <div
                    className="profile-menu"
                    ref={dropdownRef}
                >
                    <button
                        className="profile-button"
                        onClick={() => setOpen(!open)}
                        type="button"
                    >
                        <span className="avatar">
                            {(user?.name || "U").charAt(0).toUpperCase()}
                        </span>

                        <span className="profile-name">
                            {user?.name || "User"}
                        </span>

                        <span
                            className={`profile-arrow ${
                                open ? "rotate" : ""
                            }`}
                        >
                            ↓
                        </span>
                    </button>

                    {open && (
                        <div className="profile-dropdown">

                            <div className="dropdown-user">
                                <div className="dropdown-avatar">
                                    {(user?.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <strong>{user?.name || "User"}</strong>
                                    <small>{user?.email || ""}</small>
                                </div>
                            </div>

                            <button onClick={handleProfile}>
                                <span>◉</span>
                                My Profile
                            </button>

                            <button
                                className="dropdown-danger"
                                onClick={() => {
                                    setOpen(false);
                                    onLogoutRequest();
                                }}
                            >
                                <span>↗</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* MOBILE BUTTON */}

                <button
                    className="mobile-menu-button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    type="button"
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? "×" : "☰"}
                </button>
            </div>

            {/* MOBILE MENU */}

            {mobileOpen && (
                <div className="mobile-nav">

                    <button onClick={handleDashboard}>
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button onClick={handleTransactions}>
                        <span>≡</span>
                        Transactions
                    </button>

                    <button onClick={handleAnalytics}>
                        <span>◌</span>
                        Analytics
                    </button>

                    <button onClick={handleProfile}>
                        <span>◉</span>
                        My Profile
                    </button>

                    {/* MOBILE THEME TOGGLE */}

                    <button
                        onClick={handleThemeToggle}
                        className="mobile-theme-button"
                    >
                        <span>
                            {theme === "light" ? "🌙" : "☀️"}
                        </span>

                        {theme === "light"
                            ? "Switch to Dark Mode"
                            : "Switch to Light Mode"}
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
