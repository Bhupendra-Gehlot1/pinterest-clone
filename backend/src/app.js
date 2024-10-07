import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import path from "path"

import userRouter from "./routes/user.route.js";
import pinRouter from "./routes/pin.route.js"

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));


app.use(cookieParser());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/pins",pinRouter)

export { app };
