import { Pin } from "../models/pin.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createPin = asyncHandler(async (req, res) => {
  const { pinTitle, pin } = req.body;

  if ([pinTitle, pin].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const pinImagePath = req.files?.pinImage[0]?.path;
  if (!pinImagePath) {
    throw new apiError(400, "Pin image is required");
  }
  // console.log(pinImagePath);
  const pinImage = await uploadOnCloudinary(pinImagePath);
  if (!pinImage) {
    throw new apiError(400, "error while saving pin image");
  }
  
  await Pin.create({
    pinTitle,
    pin,
    pinImage: pinImage.url,
    pinCreatedUser: req.user._id,
  });

  res.json({ message: "Pin Created!" });
});

const getAllPins = asyncHandler(async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 });
  res.json(pins);
});

const getSinglePin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.pinId).populate(
    "pinCreatedUser",
    "-password -refreshToken"
  );
  res.json(pin);
});

const commentOnPin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    throw new apiError(400, "No pin with given id");
  }

  pin.pinComments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await pin.save();

  res.json({
    message: "Comment Added",
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    throw new apiError(400, "No pin with given id");
  }

  if (!req.query.commentId) {
    throw new apiError(400, "comment is not provided");
  }

  const commentIndex = pin.pinComments.findIndex(
    (item) => JSON.stringify(item._id) === JSON.stringify(req.query.commentId)
  );

  if (commentIndex === -1) {
    throw new apiError(404, "comment not found");
  }

  const comment = pin.pinComments[commentIndex];

  if (JSON.stringify(comment.user) === JSON.stringify(req.user._id)) {
    pin.pinComments.splice(commentIndex, 1);

    await pin.save();
    return res.json({
      message: "Comment deleted",
    });
  } else {
    throw new apiError(403, "You are not the owner of this comment");
  }
});

const deletePin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    throw new apiError(400, "No pin with this user");
  }

  if (JSON.stringify(pin.pinCreatedUser) !== JSON.stringify(req.user._id))
    throw new apiError(403, "Unauthorized request");

  await deleteFromCloudinary(pin.pinImage.id);

  await pin.deleteOne();

  res.json({
    message: "Pin Deleted",
  });
});

const updatePin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    throw new apiError(400, "No pin with this user");
  }

  if (JSON.stringify(pin.pinCreatedUser) !== JSON.stringify(req.user._id))
    throw new apiError(403, "Unauthorized request");

  pin.pinTitle = req.body.pinTitle;
  pin.pin = req.body.pin;

  await pin.save();

  res.json({
    message: "Pin updated",
  });
});

export {
  createPin,
  getAllPins,
  getSinglePin,
  commentOnPin,
  deleteComment,
  deletePin,
  updatePin,
};
