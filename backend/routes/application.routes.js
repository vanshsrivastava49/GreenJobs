const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const {
  submitApplication,
  getMyApplications,
  withdrawApplication,
  getRecruiterApplications,
  getApplicationDetail,
  shortlistApplicant,
  proceedToNextRound,
  finalShortlist,
  updateRoundResult,
  rejectApplicant,
  updateApplicationNotes,
  getAllApplications,
  checkApplied,
} = require("../controllers/application.controller");

// ─────────────────────────────────────────────────────────────
// CRITICAL: All fixed-path routes MUST come before /:applicationId
// Express matches top-to-bottom — a wildcard param like /:applicationId
// will swallow any fixed segment (e.g. /recruiter, /admin/all, /check/*)
// that is registered after it.
// ─────────────────────────────────────────────────────────────

// ── Jobseeker ────────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorizeRoles("jobseeker"),
  submitApplication
);

router.get(
  "/my",
  protect,
  authorizeRoles("jobseeker"),
  getMyApplications
);

// /check/:jobId must be before /:applicationId
router.get(
  "/check/:jobId",
  protect,
  authorizeRoles("jobseeker"),
  checkApplied
);

router.patch(
  "/:applicationId/withdraw",
  protect,
  authorizeRoles("jobseeker"),
  withdrawApplication
);

// ── Recruiter — fixed paths first ───────────────────────────
router.get(
  "/recruiter",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterApplications
);

// ── Admin — fixed paths MUST come before /:applicationId ────
router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllApplications
);

// ── Wildcard param route — registered LAST among GETs ───────
// Anything hitting GET /:applicationId that isn't /my, /recruiter,
// /admin/all, or /check/:jobId will land here.
router.get(
  "/:applicationId",
  protect,
  authorizeRoles("recruiter", "admin"),
  getApplicationDetail
);

// ── Recruiter PATCH actions ──────────────────────────────────
router.patch(
  "/:applicationId/shortlist",
  protect,
  authorizeRoles("recruiter"),
  shortlistApplicant
);

router.patch(
  "/:applicationId/next-round",
  protect,
  authorizeRoles("recruiter"),
  proceedToNextRound
);

router.patch(
  "/:applicationId/final-shortlist",
  protect,
  authorizeRoles("recruiter"),
  finalShortlist
);

// kept for backwards compatibility with any existing frontend calls
router.patch(
  "/:applicationId/round-result",
  protect,
  authorizeRoles("recruiter"),
  updateRoundResult
);

router.patch(
  "/:applicationId/reject",
  protect,
  authorizeRoles("recruiter"),
  rejectApplicant
);

router.patch(
  "/:applicationId/notes",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationNotes
);

module.exports = router;