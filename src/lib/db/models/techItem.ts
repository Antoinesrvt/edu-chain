import mongoose from "mongoose";

const ScriptActionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["install", "addFile", "executeCommand"],
    required: true,
  },
  payload: {
    type: String,
    required: true,
  },
});

const ProjectFileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const TechItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["frameworkJS", "frameworkCSS", "headless", "componentLib", "plugin"],
    required: true,
  },
  actions: [ScriptActionSchema],
  files: [ProjectFileSchema],
});

export const TechItem =
  mongoose.models.TechItem || mongoose.model("TechItem", TechItemSchema);
