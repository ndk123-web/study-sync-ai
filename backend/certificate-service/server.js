import express from "express";
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add middleware
app.use(express.json());

app.get("/generate-certificate", async (req, res) => {
  try {
    const { name, course } = req.query;
    const date = new Date().toLocaleDateString();
    const logoPath = path.join(__dirname, "assets", "logo.png");
    
    // Convert logo to base64 for reliable embedding in PDF
    let logoBase64 = "";
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      console.warn("Could not load logo:", error.message);
    }

    // Render HTML
    const html = await ejs.renderFile(
      path.join(__dirname, "templates", "certificate.ejs"),
      {
        userName: name || "Student Name",
        courseName: course || "AI Fundamentals",
        date,
        logoBase64,
      }
    );    // Convert HTML to PDF
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    await browser.close();

    // Upload PDF to Cloudinary
    const uploadResult = await uploadPDFToCloudinary(pdf, name, course);
    
    // Return the Cloudinary URL and course info
    res.json({
      success: true,
      message: "Certificate generated and uploaded successfully",
      certificateUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      courseName: course || "AI Fundamentals",
      studentName: name || "Student Name",
      issueDate: date,
      fileName: `${name || "student"}_${course || "course"}_certificate.pdf`
    });
  } catch (err) {
    console.error("Error generating certificate:", err);
    res.status(500).json({
      success: false,
      message: "Error generating certificate",
      error: err.message
    });
  }
});

// Function to upload PDF to Cloudinary
async function uploadPDFToCloudinary(pdfBuffer, studentName, courseName) {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const cleanStudentName = (studentName || "student").replace(/[^a-zA-Z0-9]/g, '_');
    const cleanCourseName = (courseName || "course").replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${cleanStudentName}_${cleanCourseName}_${timestamp}`;
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // For PDFs
          public_id: `certificates/${fileName}`,
          folder: "study-sync-certificates",
          format: "pdf",
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ PDF uploaded to Cloudinary:", result.secure_url);
            resolve(result);
          }
        }
      ).end(pdfBuffer);
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

// New endpoint: Get certificate by public ID
app.get("/get-certificate/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Get the resource from Cloudinary
    const result = await cloudinary.api.resource(`study-sync-certificates/${publicId}`, {
      resource_type: "raw"
    });
    
    res.json({
      success: true,
      certificateUrl: result.secure_url,
      publicId: result.public_id,
      fileName: result.original_filename,
      uploadedAt: result.created_at,
      fileSize: result.bytes
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(404).json({
      success: false,
      message: "Certificate not found",
      error: error.message
    });
  }
});

// New endpoint: List all certificates
app.get("/list-certificates", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix: "study-sync-certificates/",
      max_results: 100
    });
    
    const certificates = result.resources.map(cert => ({
      publicId: cert.public_id,
      url: cert.secure_url,
      fileName: cert.original_filename || cert.public_id,
      uploadedAt: cert.created_at,
      fileSize: cert.bytes
    }));
    
    res.json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    console.error("Error listing certificates:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching certificates",
      error: error.message
    });
  }
});

// New endpoint: Delete certificate
app.delete("/delete-certificate/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(`study-sync-certificates/${publicId}`, {
      resource_type: "raw"
    });
    
    res.json({
      success: true,
      message: "Certificate deleted successfully",
      result
    });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting certificate",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Certificate Service running on http://localhost:${PORT}`);
  console.log(`📄 Generate Certificate: http://localhost:${PORT}/generate-certificate?name=John&course=React`);
  console.log(`📋 List Certificates: http://localhost:${PORT}/list-certificates`);
});
