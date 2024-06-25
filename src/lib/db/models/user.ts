import mongoose from "mongoose";

const UserProjectSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  techStack: {
    frameworkJS: String,
    frameworkCSS: String,
    headless: String,
    componentLib: String,
  },
  plugins: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserProject =
  mongoose.models.UserProject ||
  mongoose.model("UserProject", UserProjectSchema);
