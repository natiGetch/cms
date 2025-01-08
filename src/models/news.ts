import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  publishDate: {
    type: Date,
    default: null,
  },
  coverImage : {
    type : String,
    requireed : true
  },
  views: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
 
}, { timestamps: true });


newsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastArticle = await mongoose.model("newsSchema").findOne().sort({ order: -1 });
    this.order = lastArticle ? lastArticle.order + 1 : 1; // Increment the order based on the last entry
  }
  next();
});

const newsTranslationSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "newsSchema", 
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Language", 
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, 
    required: true,
  },
  summary: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

// Exports for both models
export const newsSchemas = mongoose.models.newsSchema || mongoose.model("newsSchema", newsSchema);
export const NewsTranslation = mongoose.models.newsTranslationSchema || mongoose.model("newsTranslationSchema", newsTranslationSchema);
