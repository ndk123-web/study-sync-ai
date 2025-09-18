import mongoose from "mongoose";

const quizzesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: [String],
        answer: { type: String, required: true },
        userAnswer: { type: String }, // Store user's answer
      },
    ],
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizzesSchema);
export default Quiz;
