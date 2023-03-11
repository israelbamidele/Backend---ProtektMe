const { Router } = require("express");
const Forum = require("../../controller/Forum/forumController");
const Auth = require("../../controller/Authentication/auth");

const router = Router();

router.get("/get-forum/:forum_id?", Forum.getAForum);
router.get("/get-all-forums", Forum.getAllForums);
router.get("/get-forum-by-engagement", Forum.getForumsByHighEngagements);

router.use(Auth.protected);

router.post("/create", Forum.createForum);
router.patch("/enroll-a-forum", Forum.followAForum);
router.delete("/unfollow-forum", Forum.unfollowAForum);
module.exports = router;
