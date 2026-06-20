import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { applicationController } from "../controllers/application.controller";


const router = Router();

router.get("/mine",authenticate,applicationController.findAllApplicationByUserId)


export { router as applicationRouter };