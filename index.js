import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static file serving from the "public" directory
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Set the views directory

// Render the index.ejs file
app.get("/", (req, res) => {
  // Pass null as translatedData initially
  res.render("index.ejs", { translatedData: null });
});

// Handle the translation form submission
app.post("/translate", async (req, res) => {
  const sourceLanguage = req.body.source_language;
  const targetLanguage = req.body.target_language;
  const textToTranslate = req.body.text;

  // Check if the target language is allowed (French or Swahili)
  if (targetLanguage !== "fr" && targetLanguage !== "sw") {
    return res.render("index.ejs", {
      translatedData: null,
      error: "Invalid target language.",
    });
  }

  try {
    // Make a request to the translation API using Axios
    const response = await axios.post(
      "https://text-translator2.p.rapidapi.com/translate",
      {
        source_language: sourceLanguage,
        target_language: targetLanguage,
        text: textToTranslate,
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "e19c679dfcmsh2433c2e77fc8d4dp11db08jsn99838b468a59",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
      }
    );

    // Assuming the API returns the translated data in response.data
    const translatedData = response.data.data.translatedText;
    console.log(translatedData);

    // Render the index.ejs file with the translatedData
    res.render("index.ejs", { translatedData });
  } catch (error) {
    console.error(error);
    // Handle errors and render the index.ejs file with an error message if needed
    res.render("index.ejs", {
      translatedData: null,
      error: "Error translating text.",
    });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
