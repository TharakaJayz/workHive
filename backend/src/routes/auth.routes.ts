import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { dataValidator } from "../middlewares/validate.middleware";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";

const router = Router();


router.post(
    '/register',
    dataValidator(registerUserSchema),
    authController.register
)

router.post(
    '/login',
    dataValidator(loginUserSchema),
    authController.login
)


export { router as authRouter }