import { connectDB } from "@/lib/db";
import languageSchema from "../../models/language";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  language?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { label, key, visible,isMandatory } = req.body;

      const existingLanguage = await languageSchema.findOne({
        $or: [{ label }, { key }],
      });

      if (existingLanguage) {
        return res.status(400).json({
          message: `The ${existingLanguage.label === label ? "label" : "key"} already exists in the database.`,
        });
      }

      const lastLanguage = await languageSchema.findOne().sort({ order: -1 });
      const order = lastLanguage ? lastLanguage.order + 1 : 1;

      const newLanguage = new languageSchema({ label, key, visible, order,isMandatory  });
      await newLanguage.save();

      res.status(200).json({ message: "Language added successfully!" });
    } catch (error) {
      console.error("Error in POST handler:", error);
      res.status(500).json({ error: "Failed to add language" });
    }
  } else if (req.method === "GET") {
    try {
      const { id, page, limit } = req.query;

      if (id) {
        const language = await languageSchema.findById(id);

        if (!language) {
          return res.status(404).json({ error: "Language not found" });
        }

        return res.status(200).json({ language: [language] });
      }

      const pageNum = parseInt((page as string) || "1", 10);
      const limitNum = parseInt((limit as string) || "10", 10);
      const skip = (pageNum - 1) * limitNum;

      const languages = await languageSchema
        .find()
        .sort({ order: 1 })
        .skip(skip)
        .limit(limitNum);

      const total = await languageSchema.countDocuments();

      res.status(200).json({
        language: languages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Failed to fetch languages" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, action } = req.query; // `action` can be "up" or "down"
      const { label, key, visible } = req.body;
      if (action) {
        if (!id || !["up", "down"].includes(action as string)) {
          return res.status(400).json({ error: "Invalid action or missing ID" });
        }

        const currentLanguage = await languageSchema.findById(id);
        if (!currentLanguage) {
          return res.status(404).json({ error: "Language not found" });
        }

        const swapOrder =
          action === "up" ? currentLanguage.order - 1 : currentLanguage.order + 1;

        const swapLanguage = await languageSchema.findOne({ order: swapOrder });
        if (!swapLanguage) {
          return res.status(400).json({ error: "Cannot move further" });
        }
        await languageSchema.findByIdAndUpdate(id, { order: swapLanguage.order });
        await languageSchema.findByIdAndUpdate(swapLanguage._id, { order: currentLanguage.order });

        return res.status(200).json({ message: `Language moved ${action} successfully!` });
      }

      if (!id) {
        return res.status(400).json({ error: "ID is required to update language" });
      }

      const updatedLanguage = await languageSchema.findByIdAndUpdate(
        id,
        { label, key, visible },
        { new: true }
      );

      if (!updatedLanguage) {
        return res.status(404).json({ error: "Language not found" });
      }

      res.status(200).json({
        message: "Language updated successfully!",
        language: [updatedLanguage],
      });
    } catch (error) {
      console.error("Error in PUT handler:", error);
      res.status(500).json({ error: "Failed to update language" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ error: "ID is required to delete language" });
      }
  
      const deletedLanguage = await languageSchema.findByIdAndDelete(id);
  
      if (!deletedLanguage) {
        return res.status(404).json({ error: "Language not found" });
      }
  
      // After deleting the language, update the order of the remaining languages
      await languageSchema.updateMany(
        { order: { $gt: deletedLanguage.order } }, // Find all languages with order greater than the deleted language's order
        { $inc: { order: -1 } } // Decrement their order by 1
      );
  
      res.status(200).json({ message: "Language deleted successfully and orders updated!" });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Failed to delete language" });
    }
  }
}
