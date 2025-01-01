import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
  },
  isMadatory : {
    type: Boolean, 
    require : false
  }
},{ timestamps: true});

// Pre-save hook to set the order
languageSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastLanguage = await mongoose.model("LanguageSchema").findOne().sort({ order: -1 });
    this.order = lastLanguage ? lastLanguage.order + 1 : 1; // Increment the order based on the last entry
  }
  next();
});

export default mongoose.models.LanguageSchema || mongoose.model("LanguageSchema", languageSchema);
