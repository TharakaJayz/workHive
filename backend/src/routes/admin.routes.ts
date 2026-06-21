import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { dataValidator } from "../middlewares/validate.middleware";
import { updateJobSchema } from "../schemas/job.schema";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { UserRole } from "../shared/enum";

const router = Router();


router.patch("/jobs/:id/flag",authenticate,authorizeRoles(UserRole.ADMIN),dataValidator(updateJobSchema),adminController.updateJobStatus)

router.delete("/jobs/:id",authenticate,authorizeRoles(UserRole.ADMIN),adminController.deleteJobById)


export {router as adminRouter}