import { useEffect, useRef, useState } from "react";

function Navbar({
    user,
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

        // Always return to the very top
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function handleTransactions() {
        setMobileOpen(false);
        setOpen(false);

        onTransactions();

        setTimeout(() => {
            document
                .getElementById("transactions")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 100);
    }

    function handleAnalytics() {
        setMobileOpen(false);
        setOpen(false);

        onAnalytics();

        setTimeout(() => {
            document
                .getElementById("analytics")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 100);
    }

    return (
        <nav className="navbar">
            {/* BRAND */}

            <button
                className="navbar-brand"
                onClick={handleDashboard}
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
                <div
                    className="profile-menu"
                    ref={dropdownRef}
                >
                    <button
                        className="profile-button"
                        onClick={() => setOpen(!open)}
                    >
                        <span className="avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </span>

                        <span className="profile-name">
                            {user.name}
                        </span>

                        <span
                            className={`profile-arrow ${open ? "rotate" : ""
                                }`}
                        >
                            ↓
                        </span>
                    </button>

                    {open && (
                        <div className="profile-dropdown">
                            <div className="dropdown-user">
                                <div className="dropdown-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <strong>{user.name}</strong>
                                    <small>{user.email}</small>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onProfile();
                                }}
                            >
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

                    <button
                        onClick={() => {
                            setMobileOpen(false);
                            onProfile();
                        }}
                    >
                        <span>◉</span>
                        My Profile
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;