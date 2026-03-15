import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
  Search,
  MapPin,
  Briefcase,
  MapPinIcon,
  Clock,
  Building2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function GreenJobsHomepage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // ── Live jobs state ──
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);

  const adScrollRef = useRef(null);

  // ── Fetch approved jobs from backend ──
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const response = await axios.get(
          `${API_BASE_URL}/api/jobs/public?page=1&limit=8`,
          { timeout: 10000 }
        );

        let jobs = [];
        if (response.data.jobs && Array.isArray(response.data.jobs)) {
          jobs = response.data.jobs;
        } else if (Array.isArray(response.data)) {
          jobs = response.data;
        }

        const approved = jobs.filter(
          (job) => job && job._id && job.title && job.status === "approved"
        );
        setFeaturedJobs(approved);
      } catch (err) {
        console.error("Homepage jobs fetch error:", err);
        // Fallback to generic endpoint
        try {
          const fallback = await axios.get(`${API_BASE_URL}/api/jobs`, {
            timeout: 5000,
          });
          const fallbackJobs = (fallback.data.jobs || fallback.data || []).filter(
            (job) => job.status === "approved"
          );
          setFeaturedJobs(fallbackJobs.slice(0, 8));
        } catch {
          setJobsError("Could not load jobs. Please try again later.");
        }
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    navigate(`/jobs?search=${searchKeyword}&location=${searchLocation}`);
  };

  // ── Helper: format pay label ──
  const formatSalaryLabel = (job) => {
    if (!job.isPaid) return "Unpaid / Volunteer";
    if (job.stipend) {
      const periods = {
        monthly: "/mo",
        yearly: "/yr",
        weekly: "/wk",
        hourly: "/hr",
        project: "/project",
      };
      return `${job.stipend} ${periods[job.stipendPeriod] || ""}`.trim();
    }
    if (job.salary) return job.salary;
    return "Paid";
  };

  // ── Helper: days since posted ──
  const daysSincePosted = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  const jobCategories = [
    { name: "Freshers", count: 1240, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    )},
    { name: "IT", count: 3890, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    )},
    { name: "Sales & Marketing", count: 2670, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    )},
    { name: "Operations", count: 1340, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    )},
    { name: "Manufacturing", count: 820, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
    )},
    { name: "Engineering", count: 1560, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93A10 10 0 0 1 19.07 19.07"/></svg>
    )},
    { name: "Finance", count: 940, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    )},
    { name: "Solar & Renewable", count: 2100, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    )},
  ];

  const topCompanies = [
    { name: "Gronsol", logo: "/companies/gronsol.jpeg" },
    { name: "Kalpa Power", logo: "/companies/kalpa-power.jpeg" },
    { name: "Selec", logo: "/companies/selec.jpeg" },
    { name: "Feston", logo: "/companies/feston.jpeg" },
    { name: "SuryaLogix", logo: "/companies/suryalogix.jpeg" },
    { name: "Nova SYS", logo: "/companies/novasys.jpeg" },
  ];

  const featuredAds = [
    {
      title: "Solar Careers Drive 2026",
      subtitle: "Top renewable companies are hiring across India",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Wind Energy Openings",
      subtitle: "Explore technician, analyst and operations roles",
      image:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "EV Jobs Boom",
      subtitle: "Apply for EV infrastructure and battery domain jobs",
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Green Startups Hiring",
      subtitle: "Find fast-growing climate tech opportunities",
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const scrollAds = (direction) => {
    if (adScrollRef.current) {
      adScrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .homepage-wrapper { min-height: 100vh; background: #f8fafc; }

        /* ═══════════════════════════════════
           HERO — clean mint bg + screen blend
           Image has pure black bg.
           mix-blend-mode:screen → black = invisible.
           Figure floats perfectly on any light bg.
        ═══════════════════════════════════ */
        .hero-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #d1fae5 100%);
          padding: 0;
          position: relative;
          overflow: hidden;
          min-height: 560px;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.11) 0%, transparent 65%);
          top: -220px; right: -120px;
          pointer-events: none; z-index: 0;
        }
        .hero-section::after {
          content: '';
          position: absolute;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
          bottom: -140px; left: -80px;
          pointer-events: none; z-index: 0;
        }

        .hero-container {
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 560px;
          padding: 0 72px;
          position: relative; z-index: 1;
        }

        /* ── Left text column ── */
        .hero-left {
          flex: 1;
          z-index: 2;
          padding: 72px 0;
          max-width: 580px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1.5px solid #bbf7d0;
          color: #15803d;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 50px;
          margin-bottom: 24px;
          letter-spacing: 0.3px;
          box-shadow: 0 2px 8px rgba(16,185,129,0.12);
          width: fit-content;
        }
        .hero-badge-dot {
          width: 7px; height: 7px;
          background: #16a34a; border-radius: 50%;
          animation: pulse 2s infinite; flex-shrink: 0;
        }

        .hero-title {
          font-size: 58px;
          line-height: 1.06;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 20px;
          letter-spacing: -2px;
          white-space: nowrap;
        }
        .hero-title .highlight { color: #10b981; }

        .hero-subtitle {
          font-size: 17px;
          color: #64748b;
          margin-bottom: 38px;
          max-width: 460px;
          line-height: 1.72;
          font-weight: 400;
        }

        /* ── Search bar ── */
        .search-container { width: 100%; max-width: 520px; }
        .search-box {
          display: flex; align-items: center;
          background: white; border-radius: 14px; padding: 5px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0; width: 100%;
        }
        .search-input-wrapper { position: relative; flex: 1; min-width: 0; }
        .search-divider { width: 1px; height: 22px; background: #e2e8f0; flex-shrink: 0; margin: 0 2px; }
        .search-input {
          width: 100%; height: 46px; border: none; background: transparent;
          padding: 0 12px 0 40px; font-size: 13.5px; color: #0f172a;
          outline: none; font-family: 'Inter', sans-serif;
        }
        .search-input::placeholder { color: #94a3b8; }
        .search-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%); color: #10b981; pointer-events: none;
        }
        .search-btn {
          height: 46px; min-width: 108px; padding: 0 20px; border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white; font-size: 14px; font-weight: 700; cursor: pointer;
          white-space: nowrap; flex-shrink: 0; font-family: 'Inter', sans-serif;
          transition: all 0.18s; box-shadow: 0 4px 14px rgba(16,185,129,0.40);
          letter-spacing: 0.2px;
        }
        .search-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 6px 20px rgba(16,185,129,0.50); transform: translateY(-1px);
        }

        /* ── Stats row ── */
        .hero-stats { display: flex; gap: 0; margin-top: 36px; }
        .hero-stat {
          display: flex; flex-direction: column; gap: 4px;
          padding-right: 32px; margin-right: 32px;
          border-right: 1px solid #d1fae5;
        }
        .hero-stat:last-child { border-right: none; padding-right: 0; margin-right: 0; }
        .hero-stat-num { font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1; letter-spacing: -0.5px; }
        .hero-stat-num span { color: #10b981; }
        .hero-stat-label { font-size: 11.5px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

        /* ── Hero right — image column ── */
        .hero-right {
          flex: 0 0 460px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          position: relative;
          align-self: stretch;
        }
        .hero-image-wrapper {
          width: 100%; height: 100%;
          display: flex; align-items: flex-end; justify-content: center;
          position: relative;
        }
        .hero-image-bg { display: none; }
        .hero-person {
          /*
           * Pure black bg image + screen blend mode:
           * black pixels become transparent, colored pixels show through.
           * Zero visible box, zero clip-path hacks needed.
           */
          mix-blend-mode: screen;
          width: 100%;
          max-width: 500px;
          height: auto;
          object-fit: contain;
          object-position: bottom center;
          display: block;
          position: relative;
          z-index: 2;
          /* darken slightly since screen mode on light bg can wash out */
          filter: brightness(0.88) contrast(1.08) saturate(1.05);
        }

        /* ── Categories ── */
        .categories-carousel {
          background: white;
          padding: 56px 40px;
          overflow: hidden;
          border-bottom: 1px solid #f1f5f9;
        }
        .categories-title { text-align: center; font-size: 30px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .categories-subtitle { text-align: center; font-size: 15px; color: #64748b; margin-bottom: 36px; }
        .categories-track-wrapper { position: relative; max-width: 1200px; margin: 0 auto; }
        .categories-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 6px 4px 10px;
          scrollbar-width: none;
        }
        .categories-scroll::-webkit-scrollbar { display: none; }
        .category-card {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 210px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .category-card:hover {
          border-color: #10b981;
          background: #f0fdf4;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.12);
          transform: translateY(-2px);
        }
        .category-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: white;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #10b981;
          transition: all 0.2s;
        }
        .category-card:hover .category-icon-box {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }
        .category-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .category-name { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .category-count { font-size: 12px; color: #64748b; font-weight: 500; }
        .cat-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-60%);
          width: 36px;
          height: 36px;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          font-size: 14px;
          color: #475569;
        }
        .cat-arrow:hover { background: #10b981; border-color: #10b981; color: white; box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
        .cat-arrow-left { left: -18px; }
        .cat-arrow-right { right: -18px; }

        /* ── Companies ── */
        .companies-section { background: #f8fafc; padding: 60px 40px; }
        .companies-title { text-align: center; font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 40px; }
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
        .company-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1); transform: translateY(-2px); }
        .company-logo { max-width: 100%; max-height: 70px; width: auto; height: auto; object-fit: contain; }

        /* ── Ads ── */
        .banner-ad-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 56px 40px;
          margin: 40px 0;
        }
        .ad-content { max-width: 1200px; margin: 0 auto; text-align: center; }
        .ad-title { font-size: 28px; font-weight: 700; color: #92400e; margin-bottom: 12px; }
        .ad-text { font-size: 16px; color: #78350f; margin-bottom: 34px; }
        .ad-slider-wrapper { position: relative; max-width: 1200px; margin: 0 auto; }
        .ad-slider { display: flex; gap: 24px; overflow-x: auto; scroll-behavior: smooth; padding: 8px 6px 18px; }
        .ad-slider::-webkit-scrollbar { height: 8px; }
        .ad-slider::-webkit-scrollbar-track { background: rgba(120, 53, 15, 0.12); border-radius: 10px; }
        .ad-slider::-webkit-scrollbar-thumb { background: rgba(146, 64, 14, 0.35); border-radius: 10px; }
        .ad-card {
          min-width: 320px;
          max-width: 320px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(146, 64, 14, 0.12);
          border: 1px solid rgba(146, 64, 14, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .ad-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(146, 64, 14, 0.18); }
        .ad-image { width: 100%; height: 190px; object-fit: cover; display: block; background: #f8fafc; }
        .ad-card-body { padding: 20px 18px 22px; text-align: left; }
        .ad-card-title { font-size: 20px; font-weight: 700; color: #92400e; margin-bottom: 8px; line-height: 1.3; }
        .ad-card-subtitle { font-size: 14px; color: #78350f; line-height: 1.5; }
        .scroll-arrows-container { display: flex; justify-content: center; gap: 14px; margin-top: 26px; }
        .ad-arrow-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: #10b981;
          color: white;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 18px rgba(16, 185, 129, 0.22);
        }
        .ad-arrow-btn:hover { background: #059669; transform: translateY(-2px); }

        /* ── Jobs Section ── */
        .jobs-section { padding: 60px 40px; background: white; }
        .jobs-header { text-align: center; margin-bottom: 48px; }
        .jobs-title { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .jobs-subtitle { font-size: 16px; color: #64748b; }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Job Card ── */
        .job-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.2s;
          cursor: pointer;
          animation: fadeUp 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .job-card:hover { border-color: #10b981; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1); transform: translateY(-2px); }

        .job-tags { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
        .job-tag {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .tag-type { background: #dbeafe; color: #1e40af; }
        .tag-live { background: #d1fae5; color: #065f46; display: flex; align-items: center; gap: 4px; }
        .live-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
        .tag-pay { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .tag-unpaid { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

        .job-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.4;
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .job-card:hover .job-title { color: #10b981; }

        .job-company-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .company-logo-box {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .company-name {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-type-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #dcfce7;
          color: #065f46;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .job-meta { display: flex; flex-direction: column; gap: 8px; margin: 12px 0; font-size: 14px; color: #64748b; }
        .job-meta-item { display: flex; align-items: center; gap: 8px; }

        .job-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .job-skill-pill {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .job-salary { font-size: 16px; font-weight: 700; color: #10b981; margin-top: 4px; }
        .job-salary-unpaid { font-size: 16px; font-weight: 600; color: #64748b; margin-top: 4px; }

        .job-posted {
          font-size: 12px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 10px;
        }

        .job-view-btn {
          margin-top: 16px;
          width: 100%;
          padding: 11px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .job-view-btn:hover { background: #10b981; }

        /* ── Loading / Error / Empty states ── */
        .jobs-state {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px;
        }
        .state-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .state-title { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
        .state-desc { font-size: 14px; color: #64748b; }
        .spinner { animation: spin 1s linear infinite; }

        .view-all-btn {
          display: block;
          width: fit-content;
          margin: 36px auto 0;
          padding: 14px 36px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .view-all-btn:hover { background: #10b981; }

        /* ── Footer ── */
        .footer { background: linear-gradient(to bottom, #1e293b, #0f172a); padding: 60px 40px 32px; color: white; }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto 40px;
        }
        .footer-brand { font-size: 24px; font-weight: 700; color: #10b981; margin-bottom: 12px; }
        .footer-desc { font-size: 14px; color: #94a3b8; line-height: 1.6; }
        .footer-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: white; }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-link { font-size: 14px; color: #94a3b8; cursor: pointer; transition: color 0.2s; }
        .footer-link:hover { color: #10b981; }
        .footer-bottom { text-align: center; padding-top: 32px; border-top: 1px solid #334155; color: #64748b; font-size: 14px; }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .hero-container { padding: 0 48px; }
          .hero-title { font-size: 46px; white-space: normal; letter-spacing: -1.5px; }
          .hero-right { flex: 0 0 400px; }
        }
        @media (max-width: 960px) {
          .hero-container { flex-direction: column; padding: 0 32px; min-height: auto; }
          .hero-left { padding: 52px 0 32px; width: 100%; max-width: 100%; text-align: center; align-items: center; display: flex; flex-direction: column; }
          .hero-title { font-size: 38px; white-space: normal; letter-spacing: -1px; }
          .hero-subtitle { max-width: 100%; }
          .search-container { max-width: 100%; }
          .hero-stats { justify-content: center; }
          .hero-right { flex: 0 0 auto; width: 100%; max-width: 400px; min-height: 300px; align-self: center; }
        }
        @media (max-width: 600px) {
          .hero-container { padding: 0 20px; }
          .hero-left { padding: 40px 0 24px; }
          .hero-title { font-size: 30px; letter-spacing: -0.5px; }
          .hero-subtitle { font-size: 15px; }
          .search-box { flex-wrap: wrap; padding: 6px; gap: 4px; }
          .search-input-wrapper { flex: 1 1 45%; }
          .search-divider { display: none; }
          .search-btn { width: 100%; margin-top: 2px; }
          .hero-stats { flex-wrap: wrap; gap: 16px; }
          .hero-stat { border-right: none; padding-right: 0; margin-right: 0; }
          .hero-stat-num { font-size: 22px; }
          .categories-carousel, .companies-section, .jobs-section, .banner-ad-section, .footer {
            padding-left: 20px; padding-right: 20px;
          }
          .jobs-grid { grid-template-columns: 1fr; }
          .ad-card { min-width: 260px; max-width: 260px; }
        }
      `}</style>

      <Navbar />

      <div className="homepage-wrapper">
        {/* ── Hero ── */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-left">

              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                India's #1 Jobs Right Platform
              </div>

              <h1 className="hero-title">
                Get the Right <span className="highlight">Green Jobs</span>
              </h1>
              <p className="hero-subtitle">
                Discover renewable energy opportunities across India and connect
                with purpose-driven companies building the future.
              </p>

              <div className="search-container">
                <div className="search-box">
                  <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Job title, skill or company..."
                      className="search-input"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <div className="search-divider"></div>
                  <div className="search-input-wrapper" style={{ flex: 0.7 }}>
                    <MapPin className="search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Location..."
                      className="search-input"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <button className="search-btn" onClick={handleSearch}>
                    Find Jobs
                  </button>
                </div>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-num">12,000<span>+</span></span>
                  <span className="hero-stat-label">Active Jobs</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-num">800<span>+</span></span>
                  <span className="hero-stat-label">Green Companies</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-num">50,000<span>+</span></span>
                  <span className="hero-stat-label">Job Seekers</span>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-image-wrapper">
                <div className="hero-image-bg"></div>
                <img
                  src="/home-right.png"
                  alt="Green energy professional"
                  className="hero-person"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="categories-carousel">
          <h2 className="categories-title">Browse Jobs by Category</h2>
          <p className="categories-subtitle">Explore roles across renewable energy and green tech sectors</p>
          <div className="categories-track-wrapper">
            <button
              className="cat-arrow cat-arrow-left"
              onClick={() => document.getElementById("categoriesScroll").scrollBy({ left: -240, behavior: "smooth" })}
            >
              ←
            </button>
            <div className="categories-scroll" id="categoriesScroll">
              {jobCategories.map((category, index) => (
                <div
                  key={index}
                  className="category-card"
                  onClick={() => navigate(`/jobs?category=${category.name}`)}
                >
                  <div className="category-icon-box">{category.icon}</div>
                  <div className="category-text">
                    <div className="category-name">{category.name}</div>
                    <div className="category-count">{category.count.toLocaleString()} Jobs</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="cat-arrow cat-arrow-right"
              onClick={() => document.getElementById("categoriesScroll").scrollBy({ left: 240, behavior: "smooth" })}
            >
              →
            </button>
          </div>
        </section>

        {/* ── Companies ── */}
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
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div style="font-size: 18px; font-weight: 600; color: #374151;">${company.name}</div>`;
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Ads ── */}
        <section className="banner-ad-section">
          <div className="ad-content">
            <h2 className="ad-title">🌟 Featured Green Energy Opportunities</h2>
            <p className="ad-text">
              Join India's leading renewable energy companies — post your jobs or apply today!
            </p>
          </div>

          <div className="ad-slider-wrapper">
            <div className="ad-slider" ref={adScrollRef}>
              {featuredAds.map((ad, index) => (
                <div key={index} className="ad-card" onClick={() => navigate("/jobs")}>
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="ad-image"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="ad-card-body">
                    <div className="ad-card-title">{ad.title}</div>
                    <div className="ad-card-subtitle">{ad.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="scroll-arrows-container">
              <button className="ad-arrow-btn" onClick={() => scrollAds("left")}>&#8592;</button>
              <button className="ad-arrow-btn" onClick={() => scrollAds("right")}>&#8594;</button>
            </div>
          </div>
        </section>

        {/* ── Live Jobs from Backend ── */}
        <section className="jobs-section">
          <div className="jobs-header">
            <h2 className="jobs-title">Jobs Listed Right Now</h2>
            <p className="jobs-subtitle">
              Explore the latest live opportunities in renewable energy
            </p>
          </div>

          {jobsLoading ? (
            <div className="jobs-state">
              <div className="state-icon">
                <Loader2 size={32} color="#10b981" className="spinner" />
              </div>
              <p className="state-title">Loading jobs...</p>
            </div>
          ) : jobsError ? (
            <div className="jobs-state">
              <div className="state-icon">
                <AlertCircle size={32} color="#f59e0b" />
              </div>
              <p className="state-title">Could not load jobs</p>
              <p className="state-desc">{jobsError}</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="jobs-state">
              <div className="state-icon">
                <Briefcase size={32} color="#cbd5e1" />
              </div>
              <p className="state-title">No approved jobs yet</p>
              <p className="state-desc">Check back soon — new roles are posted regularly.</p>
            </div>
          ) : (
            <>
              <div className="jobs-grid">
                {featuredJobs.map((job) => {
                  const salaryLabel = formatSalaryLabel(job);
                  const posted = daysSincePosted(job.createdAt);
                  const companyName =
                    job.company ||
                    job.business?.businessProfile?.businessName ||
                    job.business?.businessProfile?.companyName ||
                    "Direct Hire";
                  const skills = (job.skills || []).slice(0, 4);

                  return (
                    <div
                      key={job._id}
                      className="job-card"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      {/* Tags */}
                      <div className="job-tags">
                        {job.type && (
                          <span className="job-tag tag-type">{job.type}</span>
                        )}
                        <span className="job-tag tag-live">
                          <span className="live-dot" />
                          Live
                        </span>
                        <span className={`job-tag ${job.isPaid ? "tag-pay" : "tag-unpaid"}`}>
                          {job.isPaid ? "💰 Paid" : "🤝 Unpaid"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="job-title">{job.title}</h3>

                      {/* Company */}
                      <div className="job-company-row">
                        <div className="company-logo-box">
                          <Building2 size={18} color="white" />
                        </div>
                        <span className="company-name">{companyName}</span>
                      </div>

                      {/* Meta */}
                      <div className="job-meta">
                        {job.location && (
                          <div className="job-meta-item">
                            <MapPinIcon size={14} />
                            {job.location}
                          </div>
                        )}
                        {job.experience && (
                          <div className="job-meta-item">
                            <Briefcase size={14} />
                            {job.experience}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="job-skills">
                          {skills.map((s) => (
                            <span key={s} className="job-skill-pill">{s}</span>
                          ))}
                          {(job.skills || []).length > 4 && (
                            <span className="job-skill-pill" style={{ color: "#94a3b8", background: "transparent", border: "none" }}>
                              +{job.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Salary */}
                      <div className={job.isPaid ? "job-salary" : "job-salary-unpaid"}>
                        {salaryLabel}
                      </div>

                      {/* Posted */}
                      {posted && (
                        <div className="job-posted">
                          <Clock size={12} />
                          {posted}
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        className="job-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job._id}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>

              <button className="view-all-btn" onClick={() => navigate("/jobs")}>
                View All Jobs →
              </button>
            </>
          )}
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">GreenJobs</div>
            <p className="footer-desc">
              Your gateway to renewable energy careers. Connecting talent with
              purpose-driven opportunities.
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
        <div className="footer-bottom">© 2026 GreenJobs. All rights reserved.</div>
      </footer>
    </>
  );
}