import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        body {
          padding-top: 82px;
        }

        .navbar-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 82px;
          position: relative;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
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

.logo-green {
  color: #16a34a; /* green */
}

.logo-black {
  color: #111827; /* dark text */
}

        .navbar-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
        }

        .worker-image {
          height: 80px;
          width: auto;
          object-fit: contain;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-links {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .nav-link {
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #10b981;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: #f3f4f6;
          border-radius: 8px;
          cursor: pointer;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          line-height: 1;
          margin-bottom: 3px;
        }

        .user-role {
          font-size: 12px;
          color: #6b7280;
          line-height: 1;
        }

        .nav-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-logout {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-logout:hover {
          background: #f9fafb;
        }

        .btn-login {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-login:hover {
          background: #f9fafb;
        }

        .btn-signup {
          background: #10b981;
          color: white;
        }

        .btn-signup:hover {
          background: #059669;
        }

        .banner-ad-image {
          height: 62px;
          width: auto;
          object-fit: contain;
        }

        @media (max-width: 1024px) {
          .navbar-container {
            padding: 0 24px;
          }

          .navbar-center {
            position: static;
            transform: none;
          }

          .nav-links {
            gap: 18px;
          }

          .navbar-right {
            gap: 16px;
          }

          .banner-ad-image {
            display: none;
          }
        }

        @media (max-width: 768px) {
          body {
            padding-top: 72px;
          }

          .navbar-container {
            padding: 0 16px;
            height: 72px;
          }

          .logo-image {
            height: 44px;
          }

          .logo-brand {
            font-size: 12px;
          }

          .worker-image {
            height: 46px;
          }

          .navbar-center {
            display: none;
          }

          .nav-links {
            display: none;
          }

          .user-name,
          .user-role {
            display: none;
          }

          .user-info {
            padding: 6px;
          }
        }
      `}</style>

      <nav className="navbar-fixed">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <img
                src="/solar-is-my-passion-logo.jpeg"
                alt="Solar is my passion"
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="logo-text">
                <div className="logo-brand">
  <span className="logo-green">Green</span>
  <span className="logo-black">Jobs</span>
</div>
              </div>
            </Link>
          </div>

          <div className="navbar-center">
            <img
              src="/worker-navbar.jpeg"
              alt="Worker"
              className="worker-image"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="navbar-right">
            {isAuthenticated ? (
              <>
                <div className="nav-links">
                  <Link to="/jobs" className="nav-link">
                    Jobs
                  </Link>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </div>

                <div className="user-section">
                  <div className="user-info">
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
                    Logout
                  </button>
                </div>

                <img
                  src="/banner-ad-right.jpeg"
                  alt="Banner"
                  className="banner-ad-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </>
            ) : (
              <>
                <div className="nav-links">
                  <Link to="/jobs" className="nav-link">
                    Jobs
                  </Link>
                  <Link to="/businesses" className="nav-link">
                    Companies
                  </Link>
                </div>

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
                  Sign Up
                </button>

                <img
                  src="/banner-ad-right.jpeg"
                  alt="Banner"
                  className="banner-ad-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
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