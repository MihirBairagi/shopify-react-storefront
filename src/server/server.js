import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Page from "./models/Page.js";

dotenv.config();

const app = express();

const PORT = 5000;


// =========================
// Middleware
// =========================

app.use(cors());

app.use(express.json());


// =========================
// MongoDB Connection
// =========================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {

    console.log("MongoDB connected successfully");

  })
  .catch((error) => {

    console.error("MongoDB connection failed:");
    console.error(error.message);

  });


// =========================
// Test API
// =========================

app.get("/api/test", (req, res) => {

  res.json({
    message: "Node.js backend is working!"
  });

});


// =========================
// GET Homepage
// =========================

app.get("/api/page", async (req, res) => {

  try {

    const page = await Page.findOne();

    if (!page) {

      return res.status(404).json({
        message: "Page not found"
      });

    }

    res.json(page);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// =========================
// POST Homepage
// =========================

app.post("/api/page", async (req, res) => {

  try {

    const {
      heading,
      description,
      slides
    } = req.body;


    let page = await Page.findOne();


    // If page already exists → update it

    if (page) {

      page.heading = heading;

      page.description = description;

      page.slides = slides;

      await page.save();

    }

    // If page doesn't exist → create it

    else {

      page = await Page.create({

        heading,

        description,

        slides

      });

    }


    res.status(200).json({

      message: "Page saved successfully",

      page

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: "Server error",

      error: error.message

    });

  }

});


// =========================
// Start Server
// =========================

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});