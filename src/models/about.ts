import mongoose from "mongoose";

// Slide Schema
const faqSchema = new mongoose.Schema({
  order: {
    type: Number,
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
faqSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastSlide = await mongoose.model("faqSchema").findOne().sort({ order: -1 });
    this.order = lastSlide ? lastSlide.order + 1 : 1; // Increment the order based on the last entry
  }
  next();
});

// Slide Translation Schema
const aboutUsTranslationSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'faqSchema', 
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Language', 
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Exports for both models
export const aboutUsSchema = mongoose.models.faqSchema || mongoose.model("faqSchema", faqSchema);
export const AboutUsTranslation = mongoose.models.aboutUsTranslationSchema || mongoose.model("aboutUsTranslationSchema", aboutUsTranslationSchema);
