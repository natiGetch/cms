import { connectDB } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import {newsSchemas,NewsTranslation} from '../../models/news';

// Define the type for Translation
interface Translation {
  language: string;
  title: string;
  content : string;
  summary : string;
}

type ResponseData = {
  message?: string;
  news?: any;
  newss?: { news: any; translations: Translation[] }[]; // Add translations as part of the newss
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
      const { visible ,publishDate,coverImage,translations }: { visible: boolean,publishDate: string ,coverImage : string,
        translations: Translation[] } = req.body;

      if (!translations || translations.length === 0) {
        return res.status(400).json({ error: "Translations are required" });
      }

      const lastSlide = await newsSchemas.findOne().sort({ order: -1 });
      const order = lastSlide ? lastSlide.order + 1 : 1;
      const news = new newsSchemas({ order, visible, publishDate,coverImage});
      await news.save();

      const newsTranslation = translations.map((translation) => ({
        entityId: news._id,
        language: translation.language,
        title: translation.title,
        content  : translation.content,
        summary  : translation.summary 
      }));

      await NewsTranslation.insertMany(newsTranslation);
      res.status(200).json({ message: "news added successfully!" });
    } catch (error) {
      console.error("Error in POST handler:", error);
      res.status(500).json({ error: "Failed to add news" });
    }
  } else if (req.method === "GET") {
    try {
      const { id, page = 1, limit = 10, languageId } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  
      if (id) {
        // Fetch the news by id
        const news = await newsSchemas.findById(id);
        if (!news) {
          return res.status(404).json({ error: "news not found" });
        }
  
        // Fetch translations for this news (optional languageId filter)
        const translations = await NewsTranslation.find({
          entityId: news._id,
          ...(languageId ? { language: languageId } : {}),
        });
  
        // Return the news with associated translations
        return res.status(200).json({ news, translations });
      }
  
      // If no specific news is requested, fetch all newss with pagination
      const newss = await newsSchemas
         .find()
        .skip(skip)
        .limit(parseInt(limit as string))
        .sort({ order: 1 })
       
  
      // Fetch translations for each news
      const slidesWithTranslations = await Promise.all(
        newss.map(async (news) => {
          const translations = await NewsTranslation.find({
            entityId: news._id,
            ...(languageId ? { language: languageId } : {}),
          });
          return {
            news,
            translations,
          };
        })
      );
  
      const total = await newsSchemas.countDocuments();
      res.status(200).json({
        newss: slidesWithTranslations,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Failed to fetch newss" });
    }
  }
  
  
   else if (req.method === "PUT") {
    try {
      const { id, action } = req.query;
      const { order, visible, publishDate,coverImage ,translations }: { order?: number, visible?: boolean,
        publishDate : string ,coverImage : string,translations?: Translation[] } = req.body;

      if (action) {
        if (!id || !["up", "down"].includes(action as string)) {
          return res.status(400).json({ error: "Invalid action or missing ID" });
        }

        const currentSlide = await newsSchemas.findById(id);
        if (!currentSlide) {
          return res.status(404).json({ error: "news not found" });
        }

        const swapOrder = action === "up" ? currentSlide.order - 1 : currentSlide.order + 1;
        const swapSlide = await newsSchemas.findOne({ order: swapOrder });
        if (!swapSlide) {
          return res.status(400).json({ error: "Cannot move further" });
        }
        await newsSchemas.findByIdAndUpdate(id, { order: swapSlide.order });
        await newsSchemas.findByIdAndUpdate(swapSlide._id, { order: currentSlide.order });
        return res.status(200).json({ message: `news moved ${action} successfully!` });
      }

      if (!id) {
        return res.status(400).json({ error: "ID is required to update news" });
      }

      const news = await newsSchemas.findByIdAndUpdate(id, { order, visible, publishDate,coverImage}, { new: true });
      if (!news) {
        return res.status(404).json({ error: "news not found" });
      }

      if (translations && translations.length > 0) {
        await NewsTranslation.deleteMany({ entityId: news._id });
        const newsTranslation = translations.map((translation) => ({
          entityId: news._id,
          language: translation.language,
          title: translation.title,
          content  : translation.content,
          summary  : translation.summary 
        }));

        await NewsTranslation.insertMany(newsTranslation);
      }

      res.status(200).json({ message: "news updated successfully!", news });
    } catch (error) {
      console.error("Error in PUT handler:", error);
      res.status(500).json({ error: "Failed to update news" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ error: "ID is required to delete news" });
      }
  
    
      const news = await newsSchemas.findByIdAndDelete(id);
  
      if (!news) {
        return res.status(404).json({ error: "news not found" });
      }
  
    
      await NewsTranslation.deleteMany({ entityId: news._id });
      await newsSchemas.updateMany(
        { order: { $gt: news.order } },
        { $inc: { order: -1 } }
      );
  
      res.status(200).json({ message: "news deleted successfully and orders updated!" });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Failed to delete news" });
    }
  }
}