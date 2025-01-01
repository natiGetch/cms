import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";
import * as formidable from "formidable"; // Use this import method
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  filePath?: string; // Changed from 'file' to 'filePath' for clarity
  error?: string;
};

// Disable Next.js's default body parsing to handle it manually with formidable
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    
    // Set up the upload directory
    form.uploadDir = path.join(process.cwd(), "public/uploads");
    form.keepExtensions = true; // Keep file extensions

    // Ensure the upload directory exists
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({ error: "File upload error", details: err });
      }

      // If no file is uploaded, return an error
      if (!files?.image) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = files.image[0]; // Assuming the file field is named 'image'
      const filePath = `/uploads/${path.basename(file.filepath)}`;

      // Return the file path as a string instead of an array
      try {
        res.status(200).json({ message: "File uploaded successfully!", filePath });
      } catch (error) {
        console.error("Error in file processing:", error);
        res.status(500).json({ error: "Failed to process file upload" });
      }
    });
  } else if (req.method === "GET") {
    const { filepath } = req.query;

    if (!filepath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const filePath = path.join(process.cwd(), "public/uploads", filepath as string);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Get file extension to determine content type
    const fileExtension = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream"; // Default content type

    // Set content type based on file extension (you can add more types as needed)
    if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
      contentType = "image/jpeg";
    } else if (fileExtension === ".png") {
      contentType = "image/png";
    } else if (fileExtension === ".gif") {
      contentType = "image/gif";
    } else if (fileExtension === ".pdf") {
      contentType = "application/pdf";
    }

    // Stream the file content directly to the response
    const fileStream = fs.createReadStream(filePath);
    res.setHeader("Content-Type", contentType);
    fileStream.pipe(res); // Pipe the file content to the response
  } else if (req.method === "PUT") {
    // Handle file replacement based on full file path
    const { filepath } = req.query; // Expect file path as query param for the file to replace

    if (!filepath) {
      return res.status(400).json({ error: "Filepath is required for replacement" });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), "public/uploads");
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({ error: "File upload error", details: err });
      }

      // If no file is uploaded, return an error
      if (!files?.image) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = files.image[0]; // Assuming the file field is named 'image'
      const newFilePath = `/uploads/${path.basename(file.filepath)}`;

      // Check if the file exists at the specified path and delete it if necessary
      const existingFilePath = path.join(process.cwd(), "public/uploads", filepath as string);
      if (fs.existsSync(existingFilePath)) {
        fs.unlinkSync(existingFilePath); // Delete the old file
      }

      try {
        res.status(200).json({ message: "File replaced successfully!", filePath: newFilePath });
      } catch (error) {
        console.error("Error during file replacement:", error);
        res.status(500).json({ error: "Failed to replace the file" });
      }
    });
  } else if (req.method === "DELETE") {
    // Handle file deletion based on file path
    const { filepath } = req.query; // Expect file path as query param

    if (!filepath) {
      return res.status(400).json({ error: "Filepath is required" });
    }

    const filePath = path.join(process.cwd(), "public/uploads", filepath as string);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "File deleted successfully", filePath: `/uploads/${filepath}` });
  } else {
    res.status(405).json({ error: "Method Not Allowed" }); // If not POST, PUT, GET, or DELETE, return 405
  }
}
