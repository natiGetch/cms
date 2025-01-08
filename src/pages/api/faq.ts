import { connectDB } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import {faqsSchema,FaqTranslation} from '../../models/faqs';

// Define the type for Translation
interface Translation {
  language: string;
   question: string;
  answer: string;
}

type ResponseData = {
  message?: string;
  faq?: any;
  faqs?: { faq: any; translations: Translation[] }[]; // Add translations as part of the faqs
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  translations?: Translation[];
  error?: string;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { visible, translations }: { visible: boolean, translations: Translation[] } = req.body;

      if (!translations || translations.length === 0) {
        return res.status(400).json({ error: "Translations are required" });
      }

      const lastSlide = await faqsSchema.findOne().sort({ order: -1 });
      const order = lastSlide ? lastSlide.order + 1 : 1;
      const faq = new faqsSchema({ order, visible });
      await faq.save();

      const faqTranslations = translations.map((translation) => ({
        entityId: faq._id,
        language: translation.language,
         question: translation. question,
        answer: translation.answer,
      }));

      await FaqTranslation.insertMany(faqTranslations);
      res.status(200).json({ message: "Faq added successfully!" });
    } catch (error) {
      console.error("Error in POST handler:", error);
      res.status(500).json({ error: "Failed to add faq" });
    }
  } else if (req.method === "GET") {
    try {
      const { id, page = 1, limit = 10, languageId } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  
      if (id) {
        // Fetch the faq by id
        const faq = await faqsSchema.findById(id);
        if (!faq) {
          return res.status(404).json({ error: "Faq not found" });
        }
  
        // Fetch translations for this faq (optional languageId filter)
        const translations = await FaqTranslation.find({
          entityId: faq._id,
          ...(languageId ? { language: languageId } : {}),
        });
  
        // Return the faq with associated translations
        return res.status(200).json({ faq, translations });
      }
  
      // If no specific faq is requested, fetch all faqs with pagination
      const faqs = await faqsSchema
         .find()
        .skip(skip)
        .limit(parseInt(limit as string))
        .sort({ order: 1 })
       
  
      // Fetch translations for each faq
      const slidesWithTranslations = await Promise.all(
        faqs.map(async (faq) => {
          const translations = await FaqTranslation.find({
            entityId: faq._id,
            ...(languageId ? { language: languageId } : {}),
          });
          return {
            faq,
            translations,
          };
        })
      );
  
      const total = await faqsSchema.countDocuments();
  
      // Return faqs with translations and pagination
      res.status(200).json({
        faqs: slidesWithTranslations,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Failed to fetch faqs" });
    }
  }
  
  
   else if (req.method === "PUT") {
    try {
      const { id, action } = req.query;
      const { order, visible,translations }: { order?: number, visible?: boolean, translations?: Translation[] } = req.body;

      if (action) {
        if (!id || !["up", "down"].includes(action as string)) {
          return res.status(400).json({ error: "Invalid action or missing ID" });
        }

        const currentSlide = await faqsSchema.findById(id);
        if (!currentSlide) {
          return res.status(404).json({ error: "Faq not found" });
        }

        const swapOrder = action === "up" ? currentSlide.order - 1 : currentSlide.order + 1;
        const swapSlide = await faqsSchema.findOne({ order: swapOrder });
        if (!swapSlide) {
          return res.status(400).json({ error: "Cannot move further" });
        }
        await faqsSchema.findByIdAndUpdate(id, { order: swapSlide.order });
        await faqsSchema.findByIdAndUpdate(swapSlide._id, { order: currentSlide.order });
        return res.status(200).json({ message: `Faq moved ${action} successfully!` });
      }

      if (!id) {
        return res.status(400).json({ error: "ID is required to update faq" });
      }

      const faq = await faqsSchema.findByIdAndUpdate(id, { order, visible}, { new: true });
      if (!faq) {
        return res.status(404).json({ error: "Faq not found" });
      }

      if (translations && translations.length > 0) {
        await FaqTranslation.deleteMany({ entityId: faq._id });
        const faqTranslations = translations.map((translation) => ({
          entityId: faq._id,
          language: translation.language,
           question: translation. question,
          answer: translation.answer,
        }));

        await FaqTranslation.insertMany(faqTranslations);
      }

      res.status(200).json({ message: "Faq updated successfully!", faq });
    } catch (error) {
      console.error("Error in PUT handler:", error);
      res.status(500).json({ error: "Failed to update faq" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ error: "ID is required to delete faq" });
      }
  
    
      const faq = await faqsSchema.findByIdAndDelete(id);
  
      if (!faq) {
        return res.status(404).json({ error: "Faq not found" });
      }
  
    
      await FaqTranslation.deleteMany({ entityId: faq._id });
      await faqsSchema.updateMany(
        { order: { $gt: faq.order } }, // Find all faqs with order greater than the deleted faq's order
        { $inc: { order: -1 } } // Decrement their order by 1
      );
  
      res.status(200).json({ message: "Faq deleted successfully and orders updated!" });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Failed to delete faq" });
    }
  }
}