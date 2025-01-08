import mongoose from "mongoose";

// Slide Schema
const vacancySchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  deadLine :{
    type: Date,
    required: true,
  },
  applyLink : {
    type : String,
    required : true
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
vacancySchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastSlide = await mongoose.model("vacancySchema").findOne().sort({ order: -1 });
    this.order = lastSlide ? lastSlide.order + 1 : 1; // Increment the order based on the last entry
  }
  next();
});

// Slide Translation Schema
const vacancyTranslationSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'vacancySchema', 
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
  location: {
    type: [String], 
    required: true, 
  },
  jobDescription : {
    type: String,
    required: true,
  },
  responsibilities: {
    type: [String], 
    required: true, 
    },
  experience : {
    type: [String], 
    required: true, 
  },
  qualifications : {
    type: [String], 
    required: true,  
  }
}, { timestamps: true });

// Exports for both models
export const vacanciesSchema = mongoose.models.vacancySchema || mongoose.model("vacancySchema", vacancySchema);
export const VacancyTranslation = mongoose.models.vacancyTranslationSchema || mongoose.model("vacancyTranslationSchema", vacancyTranslationSchema);
