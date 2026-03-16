import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, LayoutDashboard, Briefcase, Building2 } from "lucide-react";

const Navbar = ({ title }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        .navbar-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(229,231,235,0.8);
          box-shadow: 0 1px 16px rgba(0,0,0,0.05);
        }

        body {
          padding-top: 80px;
        }

        .navbar-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          position: relative;
        }

        /* ── Logo ── */
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .navbar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          cursor: pointer;
          min-width: 120px;
        }

        .logo-image {
          height: 52px;
          width: auto;
          object-fit: contain;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }

        .logo-brand {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .logo-green { color: #16a34a; }
        .logo-black { color: #111827; }

        /* ── Center image ── */
        .navbar-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .worker-image {
          height: 78px;
          width: auto;
          object-fit: contain;
        }

        /* ── Right side ── */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── Nav links ── */
        .nav-links {
          display: flex;
          gap: 4px;
          align-items: center;
          margin-right: 8px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.18s;
          padding: 8px 14px;
          border-radius: 8px;
          position: relative;
        }
        .nav-link:hover {
          color: #10b981;
          background: #f0fdf4;
        }

        /* ── User section ── */
        .user-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px 6px 6px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-chip:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(16,185,129,0.3);
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          line-height: 1.1;
        }

        .user-role {
          font-size: 11px;
          color: #9ca3af;
          line-height: 1.2;
          font-weight: 500;
        }

        /* ── Divider ── */
        .nav-divider {
          width: 1px;
          height: 22px;
          background: #e5e7eb;
          margin: 0 4px;
        }

        /* ── Buttons ── */
        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          font-size: 13.5px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
          white-space: nowrap;
          letter-spacing: 0.1px;
        }

        /* Ghost/outline logout */
        .btn-logout {
          background: transparent;
          color: #6b7280;
          border: 1.5px solid #e5e7eb;
        }
        .btn-logout:hover {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #dc2626;
        }

        /* Login — outlined with subtle bg */
        .btn-login {
          background: white;
          color: #374151;
          border: 1.5px solid #d1d5db;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .btn-login:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #111827;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }

        /* Sign up — solid green primary */
        .btn-signup {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: 1.5px solid transparent;
          box-shadow: 0 3px 12px rgba(16,185,129,0.35);
        }
        .btn-signup:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 5px 18px rgba(16,185,129,0.45);
          transform: translateY(-1px);
        }
        .btn-signup:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(16,185,129,0.3);
        }

        /* Banner ad */
        .banner-ad-image {
          height: 60px;
          width: auto;
          object-fit: contain;
          border-radius: 8px;
          margin-left: 8px;
        }

        @media (max-width: 1024px) {
          .navbar-container { padding: 0 24px; }
          .navbar-center { position: static; transform: none; }
          .banner-ad-image { display: none; }
        }

        @media (max-width: 768px) {
          body { padding-top: 72px; }
          .navbar-container { padding: 0 16px; height: 72px; }
          .logo-image { height: 44px; }
          .logo-brand { font-size: 12px; }
          .worker-image { height: 44px; }
          .navbar-center { display: none; }
          .nav-links { display: none; }
          .user-name, .user-role { display: none; }
          .user-chip { padding: 6px; }
          .nav-btn { padding: 8px 14px; font-size: 13px; }
        }
      `}</style>

      <nav className="navbar-fixed">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <img
                src="/solar-is-my-passion-logo.jpeg"
                alt="Solar is my passion"
                className="logo-image"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="logo-text">
                <div className="logo-brand">
                  <span className="logo-green">Green</span>
                  <span className="logo-black">Jobs</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center worker image */}
          <div className="navbar-center">
            <img
              src="/worker-navbar.jpeg"
              alt="Worker"
              className="worker-image"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>

          {/* Right side */}
          <div className="navbar-right">
            {isAuthenticated ? (
              <>
                <div className="nav-links">
                  <Link to="/jobs" className="nav-link">
                    <Briefcase size={15} />
                    Jobs
                  </Link>
                  <Link to="/dashboard" className="nav-link">
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                </div>

                <div className="nav-divider" />

                <div className="user-section">
                  <div className="user-chip">
                    <div className="user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="user-details">
                      <span className="user-name">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                      <span className="user-role">Job Seeker</span>
                    </div>
                  </div>

                  <button onClick={handleLogout} className="nav-btn btn-logout">
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>

                <img
                  src="/banner-ad-right.jpeg"
                  alt="Banner"
                  className="banner-ad-image"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </>
            ) : (
              <>
                <div className="nav-links">
                  <Link to="/jobs" className="nav-link">
                    <Briefcase size={15} />
                    Jobs
                  </Link>
                  <Link to="/businesses" className="nav-link">
                    <Building2 size={15} />
                    Companies
                  </Link>
                </div>

                <div className="nav-divider" />

                <button
                  onClick={() => navigate("/login")}
                  className="nav-btn btn-login"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="nav-btn btn-signup"
                >
                  Sign Up Free
                </button>

                <img
                  src="/banner-ad-right.jpeg"
                  alt="Banner"
                  className="banner-ad-image"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;