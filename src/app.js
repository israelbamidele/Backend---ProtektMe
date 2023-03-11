const express = require("express");
require("dotenv").config();
const cors = require("cors");
const globalError = require("./controller/Error/errorController");
const authRouter = require("./routes/authentication/auth.route");
const forumRouter = require("./routes/Forum/forum.route");
const discussionroute = require("./routes/Discussion/discussion.route");
const TopicRoute = require("./routes/Topic/topic.route");
const userRoute = require("./routes/User/user.route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/discussion", discussionroute);
app.use("/api/v1/forum", forumRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/topic", TopicRoute);
app.use("/api/v1/user", userRoute);
app.use(globalError);

module.exports = app;
