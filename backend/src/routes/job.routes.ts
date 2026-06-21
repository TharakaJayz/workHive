import { Router } from "express";
import { dataValidator } from "../middlewares/validate.middleware";
import { createJobSchema, updateJobSchema } from "../schemas/job.schema";
import { jobController } from "../controllers/job.controller";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { UserRole } from "../shared/enum";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.post(
  "",
  authenticate,
  authorizeRoles(UserRole.EMPLOYER),
  dataValidator(createJobSchema),
  jobController.create
);


// get all jobs belong to a employer
router.get(
  "/employer/:empId",
  authenticate,
  authorizeRoles(UserRole.EMPLOYER),
  jobController.getAllJobsByEmployerId
);

// get applicants of a job
router.get(
  "/:id/applicants",
  authenticate,
  authorizeRoles(UserRole.EMPLOYER),
  jobController.getApplicantsByJobId
);



// get single job
router.get("/:id", jobController.getById);

// update job
router.patch(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.EMPLOYER),
  dataValidator(updateJobSchema),
  jobController.update
);

router.get("", jobController.getAllJobs);

export { router as jobRouter };