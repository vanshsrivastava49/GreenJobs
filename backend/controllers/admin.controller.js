const User = require("../models/User");
const Job  = require("../models/Job");
const RecruiterBusinessLink = require("../models/RecruiterBusinessLink");
const email = require("../services/emailService");

/* =========================================================
   ADMIN STATS
========================================================= */
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers, jobseekers, recruiters, businesses, admins,
      approvedBusinesses, pendingBusinesses, rejectedBusinesses,
      liveJobs, pendingJobs, rejectedJobs, profilesCompleted,
      pendingRecruiterVerifications,  // ← NEW
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "recruiter" }),
      User.countDocuments({ role: "business" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "business", "businessProfile.status": "approved" }),
      User.countDocuments({ role: "business", "businessProfile.status": "pending" }),
      User.countDocuments({ role: "business", "businessProfile.status": "rejected" }),
      Job.countDocuments({ status: "approved" }),
      Job.countDocuments({ status: "pending_business" }),
      Job.countDocuments({ status: "rejected_business" }),
      User.countDocuments({ profileCompleted: true }),
      // ← NEW: recruiters awaiting admin verification
      User.countDocuments({ role: "recruiter", "recruiterProfile.verificationStatus": "pending" }),
    ]);

    res.json({
      success: true,
      totalUsers, jobseekers, recruiters, businesses, admins,
      approvedBusinesses, pendingBusinesses, rejectedBusinesses,
      liveJobs, pendingJobs, rejectedJobs, profilesCompleted,
      pendingRecruiters: pendingRecruiterVerifications, // ← NEW
    });
  } catch (err) {
    console.error("GET STATS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

/* =========================================================
   GET ALL USERS
========================================================= */
exports.getUsers = async (req, res) => {
  try {
    const { role: roleFilter, search } = req.query;
    const query = {};

    if (roleFilter && ["jobseeker", "recruiter", "business", "admin"].includes(roleFilter)) {
      query.role = roleFilter;
    }

    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

/* =========================================================
   GET USER BY ID
========================================================= */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

/* =========================================================
   DELETE USER
========================================================= */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot delete admin accounts" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `User "${user.name}" deleted successfully` });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

/* =========================================================
   GET ALL JOBS
========================================================= */
exports.getJobs = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: "i" } },
        { company:  { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("recruiter", "name email")
      .populate("business",  "name businessProfile")
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({ success: true, jobs });
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

/* =========================================================
   UPDATE JOB STATUS
========================================================= */
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["approved", "rejected_business", "pending_business"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.status === "revoked" && status === "approved") {
      job.status = "pending_business";
      job.approvedAt = null;
    } else {
      job.status = status;
      if (status === "approved") job.approvedAt = new Date();
    }

    await job.save();
    res.json({ success: true, message: `Job status updated to "${job.status}"`, job });
  } catch (err) {
    console.error("UPDATE JOB STATUS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to update job status" });
  }
};

/* =========================================================
   DELETE JOB
========================================================= */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: `Job "${job.title}" deleted` });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};

/* =========================================================
   APPROVE BUSINESS
========================================================= */
exports.approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const businessBefore = await User.findOne({ _id: id, role: "business" });
    if (!businessBefore) return res.status(404).json({ success: false, message: "Business not found" });

    const wasRevoked = await RecruiterBusinessLink.exists({
      business: id,
      status: "removed_by_business",
    });

    const business = await User.findOneAndUpdate(
      { _id: id, role: "business" },
      { "businessProfile.status": "approved", "businessProfile.verified": true },
      { new: true }
    );

    const linkedRecruiters = await User.find({
      role: "recruiter",
      "recruiterProfile.linkedBusiness": id,
    }).select("_id name");

    const recruiterIds = linkedRecruiters.map(r => r._id);
    let jobsRestored = 0;

    if (recruiterIds.length > 0) {
      const jobResult = await Job.updateMany(
        { recruiter: { $in: recruiterIds }, status: "revoked" },
        { $set: { status: "pending_business" } }
      );
      jobsRestored = jobResult.modifiedCount;
    }

    const businessName = businessBefore.businessProfile?.businessName || businessBefore.name;

    if (wasRevoked) {
      await email.sendBusinessReApprovedEmail(
        businessBefore.email, businessBefore.name, businessName, jobsRestored
      ).catch(err => console.error("❌ Re-approval email failed:", err));
    } else {
      await email.sendBusinessApprovedEmail(
        businessBefore.email, businessBefore.name, businessName
      ).catch(err => console.error("❌ Approval email failed:", err));
    }

    res.json({
      success: true,
      message: `"${businessName}" approved. ${jobsRestored} revoked job(s) restored.`,
      business,
      jobsRestored,
    });
  } catch (err) {
    console.error("APPROVE BUSINESS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to approve business" });
  }
};

/* =========================================================
   GET ALL BUSINESSES
========================================================= */
exports.getBusinesses = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { role: "business" };

    if (status) query["businessProfile.status"] = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "businessProfile.businessName": { $regex: search, $options: "i" } },
      ];
    }

    const businesses = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({ success: true, businesses });
  } catch (err) {
    console.error("GET BUSINESSES ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch businesses" });
  }
};

/* =========================================================
   REJECT BUSINESS
========================================================= */
exports.rejectBusiness = async (req, res) => {
  try {
    const { reason } = req.body;

    const business = await User.findOneAndUpdate(
      { _id: req.params.id, role: "business" },
      { "businessProfile.status": "rejected", "businessProfile.verified": false },
      { new: true }
    ).select("-password");

    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    const businessName = business.businessProfile?.businessName || business.name;

    email.sendBusinessRejectedEmail(business.email, business.name, businessName, reason).catch(console.error);

    res.json({ success: true, message: `"${businessName}" rejected.`, business });
  } catch (err) {
    console.error("REJECT BUSINESS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to reject business" });
  }
};

/* =========================================================
   REVOKE BUSINESS
========================================================= */
exports.revokeBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await User.findOneAndUpdate(
      { _id: id, role: "business" },
      { "businessProfile.status": "pending", "businessProfile.verified": false },
      { new: true }
    ).select("-password");

    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    const businessName = business.businessProfile?.businessName || business.name;

    const linkedRecruiters = await User.find({
      role: "recruiter",
      "recruiterProfile.linkedBusiness": id,
    }).select("_id name email");

    const recruiterIds = linkedRecruiters.map(r => r._id);
    let jobsRevoked = 0;

    if (recruiterIds.length > 0) {
      const jobResult = await Job.updateMany(
        { recruiter: { $in: recruiterIds }, status: { $in: ["approved", "pending_business"] } },
        { $set: { status: "revoked" } }
      );
      jobsRevoked = jobResult.modifiedCount;

      await User.updateMany(
        { _id: { $in: recruiterIds } },
        { $unset: { "recruiterProfile.linkedBusiness": "" } }
      );

      await RecruiterBusinessLink.updateMany(
        { recruiter: { $in: recruiterIds }, business: id, status: "approved" },
        { $set: { status: "removed_by_business", removedAt: new Date() } }
      );

      linkedRecruiters.forEach(recruiter => {
        email.sendRecruiterJobsRevokedEmail(
          recruiter.email, recruiter.name, businessName, jobsRevoked
        ).catch(console.error);
      });
    }

    email.sendBusinessRevokedEmail(business.email, business.name, businessName).catch(console.error);

    res.json({
      success: true,
      message: `"${businessName}" revoked. ${recruiterIds.length} recruiter(s) unlinked, ${jobsRevoked} job(s) revoked.`,
      business,
      jobsRevoked,
      recruitersUnlinked: recruiterIds.length,
    });
  } catch (err) {
    console.error("REVOKE BUSINESS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to revoke business" });
  }
};

/* =========================================================
   GET PENDING RECRUITER VERIFICATIONS  ← NEW
   Returns all recruiters with verificationStatus = "pending"
========================================================= */
exports.getPendingVerificationRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
      "recruiterProfile.verificationStatus": "pending",
    })
      .select("-password")
      .sort({ "recruiterProfile.verificationRequestedAt": 1 }); // oldest first

    res.json(recruiters);
  } catch (err) {
    console.error("GET PENDING VERIFICATIONS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch pending verifications" });
  }
};

/* =========================================================
   VERIFY RECRUITER  ← NEW
   PATCH /api/admin/recruiters/:id/verify
   Body: { status: "approved" | "rejected", reason?: string }
========================================================= */
exports.verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be "approved" or "rejected"' });
    }

    const recruiter = await User.findOne({ _id: id, role: "recruiter" });
    if (!recruiter) {
      return res.status(404).json({ success: false, message: "Recruiter not found" });
    }

    // Build update payload
    const updateFields = {
      "recruiterProfile.verificationStatus": status,
      "recruiterProfile.verificationReviewedAt": new Date(),
    };

    if (status === "rejected") {
      updateFields["recruiterProfile.rejectionReason"] = reason || "No reason provided";
    } else {
      // Clear any old rejection reason on approval
      updateFields["recruiterProfile.rejectionReason"] = "";
    }

    await User.findByIdAndUpdate(id, { $set: updateFields });

    const companyName = recruiter.recruiterProfile?.companyName;

    if (status === "approved") {
      // ✅ Email recruiter — verified, can now post jobs
      email.sendRecruiterVerifiedEmail(
        recruiter.email,
        recruiter.name,
        companyName
      ).catch(console.error);

      console.log(`✅ Recruiter ${recruiter.name} (${recruiter.email}) verified by admin`);
    } else {
      // ✅ Email recruiter — rejected with reason
      email.sendRecruiterVerificationRejectedEmail(
        recruiter.email,
        recruiter.name,
        companyName,
        reason
      ).catch(console.error);

      console.log(`❌ Recruiter ${recruiter.name} verification rejected by admin`);
    }

    res.json({
      success: true,
      message: status === "approved"
        ? `${recruiter.name} verified — they can now post jobs.`
        : `${recruiter.name}'s verification rejected.`,
      recruiterId: id,
      status,
    });
  } catch (err) {
    console.error("VERIFY RECRUITER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to update verification status" });
  }
};