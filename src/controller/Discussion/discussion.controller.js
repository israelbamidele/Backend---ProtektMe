const { findOneAndUpdate } = require("../../model/Discussion/discussion.model");
const Discussion = require("../../model/Discussion/discussion.model");
const Forum = require("../../model/Forum/forum.model");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.createADiscussion = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { content, forum_name, image, title } = req.body;

  const forum = await Forum.findOne({ name: forum_name });

  if (!forum) {
    return next(new AppError("Forum not found", 404));
  }

  const userInForum = forum.enrolled.filter((user) => {
    return user == req.user.id;
  });

  if (userInForum.length < 1) {
    return next(new AppError("You are not enrolled in this forum", 400));
  }

  const discussion = new Discussion({
    image,
    title,
    content,
    forum: forum_name,
    uploader: user._id,
  });

  const savedDiscussion = await discussion.save();

  forum.discussion.push(savedDiscussion.id);
  await forum.save();

  res.status(201).json({
    success: true,
    data: {
      image,
      title,
      content,
      user,
    },
  });
});

exports.getDiscussion = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let discussion;
  if (id) {
    discussion = await Discussion.findById(id)
      .populate({
        path: "uploader",
        // select: "firstName lastName middleName occupation photo",
      })
      .populate({
        path: "replies",
        populate: {
          path: "replied_by",
          // select: "firstName lastName occupation middleName photo",
          option: {
            sort: { createdAt: -1 },
          },
        },
      });
  }

  if (!discussion) {
    return next(new AppError("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    content: discussion,
  });
});

exports.getDiscussionOnForum = catchAsync(async (req, res, next) => {
  const { forum_name } = req.body;

  const forum = await Forum.findOne({ name: forum_name }).populate({
    path: "discussion",
    select: "content uploader uploaded_on replies retweet title image",
    populate: {
      path: "uploader",
      select: "firstName lastName occupation photo",
    },
    populate: {
      path: "replies",
      populate: "replied_by",
      select: "firstName lastName middleName occupation photo",
      options: {
        sort: { createdAt: 1 },
      },
    },
  });

  if (!forum) {
    return next(new AppError("Contents not found", 404));
  }

  const discussions = forum.discussion;

  res.status(200).json({
    success: true,
    length: discussions.length,
    discussions,
  });
});

exports.getDiscussionByRetweets = catchAsync(async (req, res, next) => {
  const discussioms = await Discussion.find()
    .populate({
      path: "uploader",
      select: "firstName lastName middleName occupation photo ",
    })
    .populate({
      path: "replies",
      populate: "replied_by",
      select: "firstName lastName middleName occupation photo",
      option: {
        sort: { createdAt: -1 },
      },
    });

  discussioms.sort((a, b) => {
    return b.retweet.length - a.retweet.length;
  });

  res.status(200).json({
    success: true,
    discussioms,
  });
});

exports.commentOnDiscussion = catchAsync(async (req, res, next) => {
  const { comment } = req.body;
  const user = req.user;
  const { discussion_id } = req.params;
  // GETTING THE DISCUSSION DOCUMENT
  const discussion = await Discussion.findById(discussion_id).populate({
    path: "replies",
    populate: {
      path: "replied_by",
      select: "firstName lastName middleName occupation photo",
    },
    option: {
      sort: { createdAt: -1 },
    },
  });

  if (!discussion) {
    return next(new AppError("Content not found", 404));
  }

  // ADDING THE COMMENT

  discussion.replies.unshift({
    content: comment,
    replied_by: user.id,
  });

  await discussion.save();

  res.status(201).json({
    success: true,
    data: {
      comment: discussion.replies,
    },
  });
});

exports.retweetADiscussion = catchAsync(async (req, res, next) => {
  const { discussion_id } = req.params;

  const discussion = await Discussion.findById(discussion_id);

  const alreadyRetweet = discussion.retweet.find((user) => {
    return (user = req.user.id);
  });

  console.log(alreadyRetweet);
  if (alreadyRetweet) {
    return next(new AppError("Already retweet this discussiom", 400));
  }
  discussion.retweet.push(req.user.id);

  await discussion.save();

  res.status(200).json({
    success: true,
  });
});
