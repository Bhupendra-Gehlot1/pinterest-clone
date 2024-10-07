import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  commentOnPin,
  createPin,
  deleteComment,
  deletePin,
  getAllPins,
  getSinglePin,
  updatePin,
} from "../controllers/pin.controller.js";

const router = Router();

router
  .route("/new")
  .post(
    verifyJWT,
    upload.fields([{ name: "pinImage", maxCount: 1 }]),
    createPin
  );

router.route("/all").get(verifyJWT, getAllPins);

router.route("/:pinId").get(verifyJWT, getSinglePin);
router.route("/:pinId").delete(verifyJWT, deletePin);
router.route("/:pinId").put(verifyJWT, updatePin);

router.route("/comment/:pinId").delete(verifyJWT, deleteComment);
router.route("/comment/:pinId").post(verifyJWT, commentOnPin);

export default router;
