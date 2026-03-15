import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { Search, MapPin, Briefcase, MapPinIcon, DollarSign, Clock } from "lucide-react";

export default function GreenJobsHomepage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = () => {
    navigate(`/jobs?search=${searchKeyword}&location=${searchLocation}`);
  };

  // Job categories for the carousel
  const jobCategories = [
    { name: "IT", count: 245, icon: "💻" },
    { name: "Sales", count: 189, icon: "📊" },
    { name: "Operations", count: 156, icon: "⚙️" },
    { name: "Marketing", count: 203, icon: "📢" },
  ];

  // Top companies with logos
  const topCompanies = [
    { name: "Gronsol", logo: "/companies/gronsol.jpeg" },
    { name: "Kalpa Power", logo: "/companies/kalpa-power.jpeg" },
    { name: "Selec", logo: "/companies/selec.jpeg" },
    { name: "Feston", logo: "/companies/feston.jpeg" },
    { name: "SuryaLogix", logo: "/companies/suryalogix.jpeg" },
    { name: "Nova SYS", logo: "/companies/novasys.jpeg" },
  ];

  // Featured jobs
  const featuredJobs = [
    {
      title: "Solar Project Manager",
      company: "Tata Power Solar",
      location: "Mumbai, Maharashtra",
      experience: "5-8 years",
      salary: "₹12-18 LPA",
      type: "Full-time",
      postedDays: 2
    },
    {
      title: "Wind Turbine Technician",
      company: "Suzlon Energy",
      location: "Pune, Maharashtra",
      experience: "2-4 years",
      salary: "₹6-9 LPA",
      type: "Full-time",
      postedDays: 1
    },
    {
      title: "EV Charging Infrastructure Lead",
      company: "Tata Power",
      location: "Bangalore, Karnataka",
      experience: "4-7 years",
      salary: "₹10-15 LPA",
      type: "Full-time",
      postedDays: 3
    },
    {
      title: "Solar Sales Executive",
      company: "Adani Green Energy",
      location: "Delhi NCR",
      experience: "3-5 years",
      salary: "₹8-12 LPA",
      type: "Full-time",
      postedDays: 4
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
        }

        /* Main Wrapper */
        .homepage-wrapper {
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Hero Section - "Get the Right Green Jobs" */
        .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 100px 40px 80px;
          text-align: center;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 48px;
        }

        .hero-image {
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .hero-image img {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }

        /* Search Box */
        .search-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 50px;
          padding: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          gap: 8px;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
        }

        .search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          font-size: 15px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 25px;
          outline: none;
        }

        .search-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .search-btn {
          padding: 16px 48px;
          font-size: 15px;
          font-weight: 600;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-btn:hover {
          background: #059669;
        }

        /* Job Categories Carousel */
        .categories-carousel {
          background: white;
          padding: 60px 40px;
          overflow: hidden;
        }

        .categories-title {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 40px;
        }

        .categories-scroll {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 8px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .categories-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .categories-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .categories-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .category-card {
          min-width: 200px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-card:hover {
          border-color: #10b981;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
        }

        .category-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .category-name {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .category-count {
          font-size: 14px;
          color: #64748b;
        }

        .scroll-arrows {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }

        .scroll-arrow {
          width: 40px;
          height: 40px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scroll-arrow:hover {
          background: #059669;
        }

        /* Top Companies Section */
        .companies-section {
          background: #f8fafc;
          padding: 60px 40px;
        }

        .companies-title {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 40px;
        }

        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .company-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 140px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .company-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
          transform: translateY(-2px);
        }

        .company-logo {
          max-width: 100%;
          max-height: 70px;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        /* Banner Ad Section */
        .banner-ad-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 48px 40px;
          text-align: center;
          margin: 40px 0;
        }

        .ad-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .ad-title {
          font-size: 28px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 12px;
        }

        .ad-text {
          font-size: 16px;
          color: #78350f;
        }

        .scroll-arrows-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }

        /* Show All Jobs Section */
        .jobs-section {
          padding: 60px 40px;
          background: white;
        }

        .jobs-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .jobs-title {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .jobs-subtitle {
          font-size: 16px;
          color: #64748b;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .job-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .job-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
          transform: translateY(-2px);
        }

        .job-header {
          margin-bottom: 16px;
        }

        .job-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .job-company {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .job-type {
          display: inline-block;
          padding: 4px 12px;
          background: #dcfce7;
          color: #065f46;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .job-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 16px 0;
          font-size: 14px;
          color: #64748b;
        }

        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .job-salary {
          font-size: 16px;
          font-weight: 700;
          color: #10b981;
          margin-top: 12px;
        }

        .job-posted {
          font-size: 12px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
        }

        /* Footer */
        .footer {
          background: linear-gradient(to bottom, #1e293b, #0f172a);
          padding: 60px 40px 32px;
          color: white;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto 40px;
        }

        .footer-brand {
          font-size: 24px;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 12px;
        }

        .footer-desc {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
        }

        .footer-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: white;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          font-size: 14px;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #10b981;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 32px;
          border-top: 1px solid #334155;
          color: #64748b;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .search-box {
            flex-direction: column;
          }

          .search-btn {
            width: 100%;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      <div className="homepage-wrapper">
        {/* 1. Hero Section - "Get the Right Green Jobs" */}
        <section className="hero-section">
          <h1 className="hero-title">Get the Right Green Jobs</h1>
          <p className="hero-subtitle">
            Depicting Renewable Energy & Jobs
          </p>

          {/* Guy Picture Placeholder */}
          <div className="hero-image">
            <img 
              src="/hero-green-jobs.jpg" 
              alt="Green Energy Professional" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Search: Enter Skill / Exp / Location */}
          <div className="search-container">
            <div className="search-box">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} color="#64748b" />
                <input
                  type="text"
                  placeholder="Enter skill, experience or job title..."
                  className="search-input"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="search-input-wrapper" style={{ flex: '0.6' }}>
                <MapPin className="search-icon" size={20} color="#64748b" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="search-input"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className="search-btn" onClick={handleSearch}>
                Search Jobs
              </button>
            </div>
          </div>
        </section>

        {/* 2. Job Categories Carousel - IT, Sales, Operations, Marketing */}
        <section className="categories-carousel">
          <h2 className="categories-title">Browse Jobs by Category</h2>
          <div className="categories-scroll" id="categoriesScroll">
            {jobCategories.map((category, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => navigate(`/jobs?category=${category.name}`)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.count} jobs</div>
              </div>
            ))}
          </div>
          <div className="scroll-arrows">
            <button 
              className="scroll-arrow"
              onClick={() => {
                document.getElementById('categoriesScroll').scrollBy({ left: -220, behavior: 'smooth' });
              }}
            >
              ◀
            </button>
            <button 
              className="scroll-arrow"
              onClick={() => {
                document.getElementById('categoriesScroll').scrollBy({ left: 220, behavior: 'smooth' });
              }}
            >
              ▶
            </button>
          </div>
        </section>

        {/* 3. Top Companies Hiring Now */}
        <section className="companies-section">
          <h2 className="companies-title">Top Companies Hiring Now</h2>
          <div className="companies-grid">
            {topCompanies.map((company, index) => (
              <div
                key={index}
                className="company-card"
                onClick={() => navigate(`/jobs?company=${company.name}`)}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="company-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div style="font-size: 18px; font-weight: 600; color: #374151;">${company.name}</div>`;
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Banner Ads Section */}
        <section className="banner-ad-section">
          <div className="ad-content">
            <h2 className="ad-title">🌟 Featured Green Energy Opportunities</h2>
            <p className="ad-text">
              Join India's leading renewable energy companies - Post your jobs or apply today!
            </p>
          </div>
          <div className="scroll-arrows-container">
            <span style={{ fontSize: '24px' }}>◀</span>
            <span style={{ fontSize: '24px' }}>▶</span>
          </div>
        </section>

        {/* 5. Show All Jobs Listed Right Now */}
        <section className="jobs-section">
          <div className="jobs-header">
            <h2 className="jobs-title">Show All Jobs Listed Right Now</h2>
            <p className="jobs-subtitle">Explore the latest opportunities in renewable energy</p>
          </div>
          <div className="jobs-grid">
            {featuredJobs.map((job, index) => (
              <div
                key={index}
                className="job-card"
                onClick={() => navigate('/jobs')}
              >
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <span className="job-type">{job.type}</span>
                </div>
                
                <div className="job-meta">
                  <div className="job-meta-item">
                    <MapPinIcon size={16} />
                    {job.location}
                  </div>
                  <div className="job-meta-item">
                    <Briefcase size={16} />
                    {job.experience}
                  </div>
                </div>

                <div className="job-salary">{job.salary}</div>
                
                <div className="job-posted">
                  <Clock size={12} />
                  Posted {job.postedDays} days ago
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">GreenJobs</div>
            <p className="footer-desc">
              Your gateway to renewable energy careers. Connecting talent with purpose-driven opportunities.
            </p>
          </div>
          <div>
            <div className="footer-title">Quick Links</div>
            <div className="footer-links">
              <span className="footer-link" onClick={() => navigate("/")}>Home</span>
              <span className="footer-link">About Us</span>
            </div>
          </div>
          <div>
            <div className="footer-title">For Recruiters</div>
            <div className="footer-links">
              <span className="footer-link" onClick={() => navigate("/login")}>Sign In</span>
              <span className="footer-link" onClick={() => navigate("/signup")}>Sign Up</span>
            </div>
          </div>
          <div>
            <div className="footer-title">Contact</div>
            <div className="footer-links">
              <span className="footer-link">Address: Delhi</span>
              <span className="footer-link">Phone No.</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 GreenJobs. All rights reserved.
        </div>
      </footer>
    </>
  );
}
