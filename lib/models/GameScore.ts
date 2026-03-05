import mongoose from "mongoose"

const gameScoreSchema = new mongoose.Schema({

 userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index:true
 },

 score:{
  type:Number,
  default:0
 },

 questionsAnswered:{
  type:Number,
  default:0
 },

 level:{
  type:Number,
  default:1
 },

 createdAt:{
  type:Date,
  default:Date.now
 }

})

export default mongoose.models.GameScore ||
mongoose.model("GameScore",gameScoreSchema)