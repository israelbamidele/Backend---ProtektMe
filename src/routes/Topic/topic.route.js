const { Router } = require("express");
const Topic = require("../../controller/Topic/topic.controller");
const { protected } = require("../../controller/Authentication/auth");
const router = Router();

router.get("/topics-on-forum", Topic.getAllTopicOnForum);
router.get("/get-topics-by-pins", Topic.getTopicByHighPin);
router.get("/", Topic.getAllTopics);
router.get("/:topic_id", Topic.getATopic);

router.use(protected);

router.post("/create", Topic.createATopic);
router.patch("/pin-a-topic/:topic_id", Topic.pinATopic);
router.patch("/answer-a-topic/:topic_id", Topic.answerATopic);
router.patch("/reply-a-topic/:topic_id", Topic.replyATopic);

module.exports = router;
