import { Router } from "express";
import { dataValidator } from "../middlewares/validate.middleware";
import { createJobSchema, updateJobSchema } from "../schemas/job.schema";
import { jobController } from "../controllers/job.controller";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { UserRole } from "../shared/enum";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router();

// create a job
router.post('', authenticate, dataValidator(createJobSchema),
    authorizeRoles(UserRole.EMPLOYER),
    jobController.create
)
// update a job
router.patch('/:id', authenticate, dataValidator(updateJobSchema), authorizeRoles(UserRole.EMPLOYER),
    jobController.update)

router.get('/:id/applicants',authenticate,authorizeRoles(UserRole.EMPLOYER),jobController.getApplicantsByJobId);

// get all jobs belong to a employer
router.get("/employer/:empId",authenticate,authorizeRoles(UserRole.EMPLOYER),jobController.getAllJobsByEmployerId);

//:id/applicants  -> GET to list applicants for a job
// get single job
router.get("/:id",jobController.getById);


// get all jobs
router.get('',jobController.getAllJobs);

export { router as jobRouter };