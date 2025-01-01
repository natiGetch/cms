import { connectDB } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import {slidesSchema,SlideTranslation} from '../../models/slide';

// Define the type for Translation
interface Translation {
  language: string;
  title: string;
  subtitle: string;
}

type ResponseData = {
  message?: string;
  slide?: any;
  slides?: { slide: any; translations: Translation[] }[]; // Add translations as part of the slides
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
      const { image, visible, translations }: { image: string, visible: boolean, translations: Translation[] } = req.body;

      if (!translations || translations.length === 0) {
        return res.status(400).json({ error: "Translations are required" });
      }

      const lastSlide = await slidesSchema.findOne().sort({ order: -1 });
      const order = lastSlide ? lastSlide.order + 1 : 1;
      const slide = new slidesSchema({ order, image, visible });
      await slide.save();

      const slideTranslations = translations.map((translation) => ({
        entityId: slide._id,
        language: translation.language,
        title: translation.title,
        subtitle: translation.subtitle,
      }));

      await SlideTranslation.insertMany(slideTranslations);
      res.status(200).json({ message: "Slide added successfully!" });
    } catch (error) {
      console.error("Error in POST handler:", error);
      res.status(500).json({ error: "Failed to add slide" });
    }
  } else if (req.method === "GET") {
    try {
      const { id, page = 1, limit = 10, languageId } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  
      if (id) {
        // Fetch the slide by id
        const slide = await slidesSchema.findById(id);
        if (!slide) {
          return res.status(404).json({ error: "Slide not found" });
        }
  
        // Fetch translations for this slide (optional languageId filter)
        const translations = await SlideTranslation.find({
          entityId: slide._id,
          ...(languageId ? { language: languageId } : {}),
        });
  
        // Return the slide with associated translations
        return res.status(200).json({ slide, translations });
      }
  
      // If no specific slide is requested, fetch all slides with pagination
      const slides = await slidesSchema
         .find({}, { image: 0 })
        .skip(skip)
        .limit(parseInt(limit as string))
        .sort({ order: 1 })
       
  
      // Fetch translations for each slide
      const slidesWithTranslations = await Promise.all(
        slides.map(async (slide) => {
          const translations = await SlideTranslation.find({
            entityId: slide._id,
            ...(languageId ? { language: languageId } : {}),
          });
          return {
            slide,
            translations,
          };
        })
      );
  
      const total = await slidesSchema.countDocuments();
  
      // Return slides with translations and pagination
      res.status(200).json({
        slides: slidesWithTranslations,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Failed to fetch slides" });
    }
  }
  
  
   else if (req.method === "PUT") {
    try {
      const { id, action } = req.query;
      const { order, visible,image,translations }: { order?: number, image? : string, visible?: boolean, translations?: Translation[] } = req.body;

      if (action) {
        if (!id || !["up", "down"].includes(action as string)) {
          return res.status(400).json({ error: "Invalid action or missing ID" });
        }

        const currentSlide = await slidesSchema.findById(id);
        if (!currentSlide) {
          return res.status(404).json({ error: "Slide not found" });
        }

        const swapOrder = action === "up" ? currentSlide.order - 1 : currentSlide.order + 1;
        const swapSlide = await slidesSchema.findOne({ order: swapOrder });
        if (!swapSlide) {
          return res.status(400).json({ error: "Cannot move further" });
        }
        await slidesSchema.findByIdAndUpdate(id, { order: swapSlide.order });
        await slidesSchema.findByIdAndUpdate(swapSlide._id, { order: currentSlide.order });
        return res.status(200).json({ message: `Slide moved ${action} successfully!` });
      }

      if (!id) {
        return res.status(400).json({ error: "ID is required to update slide" });
      }

      const slide = await slidesSchema.findByIdAndUpdate(id, { order, visible,image}, { new: true });
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }

      if (translations && translations.length > 0) {
        await SlideTranslation.deleteMany({ entityId: slide._id });
        const slideTranslations = translations.map((translation) => ({
          entityId: slide._id,
          language: translation.language,
          title: translation.title,
          subtitle: translation.subtitle,
        }));

        await SlideTranslation.insertMany(slideTranslations);
      }

      res.status(200).json({ message: "Slide updated successfully!", slide });
    } catch (error) {
      console.error("Error in PUT handler:", error);
      res.status(500).json({ error: "Failed to update slide" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ error: "ID is required to delete slide" });
      }
  
    
      const slide = await slidesSchema.findByIdAndDelete(id);
  
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
  
    
      await SlideTranslation.deleteMany({ entityId: slide._id });
      await slidesSchema.updateMany(
        { order: { $gt: slide.order } }, // Find all slides with order greater than the deleted slide's order
        { $inc: { order: -1 } } // Decrement their order by 1
      );
  
      res.status(200).json({ message: "Slide deleted successfully and orders updated!" });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Failed to delete slide" });
    }
  }
}