import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";

import { fileUploder } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllFromDB);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile
);

router.post(
  "/create-patient",
  fileUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPatient(req, res, next);
  }
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.ADMIN),
  fileUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(JSON.parse(req.body.data));
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createDoctor(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  UserController.changeProfileStatus
);

router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfie(req, res, next);
  }
);

export const userRoutes = router;
