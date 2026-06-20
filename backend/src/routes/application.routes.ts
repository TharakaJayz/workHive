import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { applicationController } from "../controllers/application.controller";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { UserRole } from "../shared/enum";
import { dataValidator } from "../middlewares/validate.middleware";
import { updateApplicationSchema } from "../schemas/application.schema";


const router = Router();

router.get("/mine",authenticate,applicationController.findAllApplicationByUserId)

router.patch("/:id/status",authenticate,dataValidator(updateApplicationSchema),authorizeRoles(UserRole.ADMIN),applicationController.updateApplicationStatus);


export { router as applicationRouter };