import { Router } from "express";
import { createProfile, getProfile, updateProfile, deleteProfile } from "../controllers/profileController";

const router = Router();

router.route("/").post(createProfile).get(getProfile);
router.route("/:id").put(updateProfile).delete(deleteProfile);

export default router;
