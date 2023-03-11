const { model, Schema, default: mongoose } = require("mongoose");

const forumSchema = Schema({
  name: {
    type: String,
    required: [true, "Input forum name"],
    unique: [true, "Forum with the name already exist"],
  },
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  enrolled: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  discussion: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Discussion",
    },
  ],
  topics: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
    },
  ],
});

const Forum = model("Forum", forumSchema);
module.exports = Forum;
