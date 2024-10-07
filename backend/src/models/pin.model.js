import mongoose, { Schema } from "mongoose";

const pinSchema = new Schema(
  {
    pinTitle: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    pinCreatedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pinImage: {
      type: String,
      required: true,
    },
    pinComments: [
      {
        user: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Pin = mongoose.model("Pin", pinSchema);
