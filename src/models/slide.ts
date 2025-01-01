import mongoose from "mongoose";

// Slide Schema
const slideSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (if needed)
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (if needed)
  },
}, { timestamps: true });

// Pre-save hook to set the order
slideSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastSlide = await mongoose.model("SlideSchema").findOne().sort({ order: -1 });
    this.order = lastSlide ? lastSlide.order + 1 : 1; // Increment the order based on the last entry
  }
  next();
});

// Slide Translation Schema
const slideTranslationSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'SlideSchema', 
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Language', 
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Exports for both models
export const slidesSchema = mongoose.models.SlideSchema || mongoose.model("SlideSchema", slideSchema);
export const SlideTranslation = mongoose.models.SlideTranslationSchema || mongoose.model("SlideTranslationSchema", slideTranslationSchema);
