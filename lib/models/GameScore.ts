import mongoose, { models, Schema } from "mongoose";

const gameScoreSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  score: { type: Number, default: 0 },
  questionsAnswered: { type: Number, default: 0 },
  correctAnswersInRow: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  status: { type: String, enum: ["active", "finished"], default: "active" },
  currentQuestion: { question: String, solution: Number },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

export default models.GameScore || mongoose.model("GameScore", gameScoreSchema);