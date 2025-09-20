import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["course-progress", "enrollment", "quiz-completed"],
    required: true,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description : {
    type: String,
    required: true,
  },
  metadata : {
    type: Object,
    required: false 
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
