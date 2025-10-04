import express from "express";
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

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

    // Send PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${
        name || "student"
      }_certificate.pdf"`,
    });
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating certificate");
  }
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
