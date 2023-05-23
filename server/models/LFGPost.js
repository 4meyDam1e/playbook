import mongoose from "mongoose";


const LFGPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, required: false, minlength: 1, maxlength: 1000 },
});

const LFGPost = mongoose.model("LFGPost", LFGPostSchema);
export default LFGPost;
