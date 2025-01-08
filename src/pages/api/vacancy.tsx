import { connectDB } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { vacanciesSchema, VacancyTranslation } from "../../models/vacancy";

// Define the type for Translation
interface Translation {
  language: string;
  title: string;
  location: string[];
  jobDescription: string;
  responsibilities: string[];
  experience: string[];
  qualifications: string[];
}

type ResponseData = {
  message?: string;
  vacancy?: any;
  vacancies?: { vacancy: any; translations: Translation[] }[]; // Add translations as part of the vacancies
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  translations?: Translation[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const {
        visible,
        deadLine,
        applyLink,
        translations,
      }: {
        visible: boolean;
        deadLine: string;
        applyLink: string;
        translations: Translation[];
      } = req.body;

      if (!translations || translations.length === 0) {
        return res.status(400).json({ error: "Translations are required" });
      }

      const lastSlide = await vacanciesSchema.findOne().sort({ order: -1 });
      const order = lastSlide ? lastSlide.order + 1 : 1;
      const vacancy = new vacanciesSchema({
        order,
        visible,
        deadLine,
        applyLink,
      });
      await vacancy.save();

      const vacancyTranslation = translations.map((translation) => ({
        entityId: vacancy._id,
        language: translation.language,
        title: translation.title,
        location: translation.location,
        jobDescription: translation.jobDescription,
        responsibilities: translation.responsibilities,
        experience: translation.experience,
        qualifications: translation.qualifications,
      }));

      await VacancyTranslation.insertMany(vacancyTranslation);
      res.status(200).json({ message: "vacancy added successfully!" });
    } catch (error) {
      console.error("Error in POST handler:", error);
      res.status(500).json({ error: "Failed to add vacancy" });
    }
  } else if (req.method === "GET") {
    try {
      const { id, page = 1, limit = 10, languageId } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      if (id) {
        // Fetch the vacancy by id
        const vacancy = await vacanciesSchema.findById(id);
        if (!vacancy) {
          return res.status(404).json({ error: "vacancy not found" });
        }

        // Fetch translations for this vacancy (optional languageId filter)
        const translations = await VacancyTranslation.find({
          entityId: vacancy._id,
          ...(languageId ? { language: languageId } : {}),
        });

        // Return the vacancy with associated translations
        return res.status(200).json({ vacancy, translations });
      }

      // If no specific vacancy is requested, fetch all vacancies with pagination
      const vacancies = await vacanciesSchema
        .find()
        .skip(skip)
        .limit(parseInt(limit as string))
        .sort({ order: 1 });

      // Fetch translations for each vacancy
      const slidesWithTranslations = await Promise.all(
        vacancies.map(async (vacancy) => {
          const translations = await VacancyTranslation.find({
            entityId: vacancy._id,
            ...(languageId ? { language: languageId } : {}),
          });
          return {
            vacancy,
            translations,
          };
        })
      );

      const total = await vacanciesSchema.countDocuments();

      // Return vacancies with translations and pagination
      res.status(200).json({
        vacancies: slidesWithTranslations,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res.status(500).json({ error: "Failed to fetch vacancies" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, action } = req.query;
      const {
        order,
        visible,
        deadLine,
        applyLink,
        translations,
      }: {
        order?: number;
        visible?: boolean;
        deadLine: string;
        applyLink: string;
        translations?: Translation[];
      } = req.body;

      if (action) {
        if (!id || !["up", "down"].includes(action as string)) {
          return res
            .status(400)
            .json({ error: "Invalid action or missing ID" });
        }

        const currentSlide = await vacanciesSchema.findById(id);
        if (!currentSlide) {
          return res.status(404).json({ error: "vacancy not found" });
        }

        const swapOrder =
          action === "up" ? currentSlide.order - 1 : currentSlide.order + 1;
        const swapSlide = await vacanciesSchema.findOne({ order: swapOrder });
        if (!swapSlide) {
          return res.status(400).json({ error: "Cannot move further" });
        }
        await vacanciesSchema.findByIdAndUpdate(id, { order: swapSlide.order });
        await vacanciesSchema.findByIdAndUpdate(swapSlide._id, {
          order: currentSlide.order,
        });
        return res
          .status(200)
          .json({ message: `vacancy moved ${action} successfully!` });
      }

      if (!id) {
        return res
          .status(400)
          .json({ error: "ID is required to update vacancy" });
      }

      const vacancy = await vacanciesSchema.findByIdAndUpdate(
        id,
        { order, visible, deadLine, applyLink },
        { new: true }
      );
      if (!vacancy) {
        return res.status(404).json({ error: "vacancy not found" });
      }

      if (translations && translations.length > 0) {
        await VacancyTranslation.deleteMany({ entityId: vacancy._id });
        const vacancyTranslation = translations.map((translation) => ({
          entityId: vacancy._id,
          language: translation.language,
          title: translation.title,
          location: translation.location,
          jobDescription: translation.jobDescription,
          responsibilities: translation.responsibilities,
          experience: translation.experience,
          qualifications: translation.qualifications,
        }));

        await VacancyTranslation.insertMany(vacancyTranslation);
      }

      res
        .status(200)
        .json({ message: "vacancy updated successfully!", vacancy });
    } catch (error) {
      console.error("Error in PUT handler:", error);
      res.status(500).json({ error: "Failed to update vacancy" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res
          .status(400)
          .json({ error: "ID is required to delete vacancy" });
      }

      const vacancy = await vacanciesSchema.findByIdAndDelete(id);

      if (!vacancy) {
        return res.status(404).json({ error: "vacancy not found" });
      }

      await VacancyTranslation.deleteMany({ entityId: vacancy._id });
      await vacanciesSchema.updateMany(
        { order: { $gt: vacancy.order } }, // Find all vacancies with order greater than the deleted vacancy's order
        { $inc: { order: -1 } } // Decrement their order by 1
      );

      res
        .status(200)
        .json({ message: "vacancy deleted successfully and orders updated!" });
    } catch (error) {
      console.error("Error in DELETE handler:", error);
      res.status(500).json({ error: "Failed to delete vacancy" });
    }
  }
}
