import { Router } from "express";
import { authRouter } from "./auth.routes";
import { jobRouter } from "./job.routes";
import { applicationRouter } from "./application.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/jobs",jobRouter)
router.use("/applications",applicationRouter)

export { router as apiRouter };
