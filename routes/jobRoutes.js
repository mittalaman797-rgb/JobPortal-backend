import express from "express";
const router=express.Router()

import isAuthenticated from "../middleware/auth.js"
import { postJob,getAllJobs,getJobById,getAdminJobs } from "../controllers/job.controller.js";
router.post("/post",isAuthenticated,postJob)
router.get("/get",getAllJobs)
router.get("/getadminjobs",isAuthenticated,getAdminJobs)
router.get("/get/:id",isAuthenticated,getJobById)

export default router