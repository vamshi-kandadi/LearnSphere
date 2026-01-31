import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function saveGeneration(type, topic, content, metadata = {}) {
  try {
    const { data, error } = await supabase
      .from("generations")
      .insert({
        type,
        topic,
        content,
        metadata,
        created_at: new Date().toISOString(),
      });

    if (error) console.error("Supabase error:", error);
    return data;
  } catch (err) {
    console.error("Error saving generation:", err);
  }
}

app.post("/api/generate-text", async (req, res) => {
  try {
    const { topic, depth } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `Provide a ${depth || "detailed"} explanation of the ML concept: "${topic}".
    Format the response with clear sections, examples, and practical applications.`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    await saveGeneration("text", topic, content, { depth });

    res.json({ content });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

app.post("/api/generate-code", async (req, res) => {
  try {
    const { topic, complexity } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `Write a Python code example for: "${topic}".
    Include:
    1. Clear, commented code
    2. Imports and dependencies
    3. Step-by-step explanation
    4. Sample output
    The code should be ${complexity || "intermediate"} level.`;

    const result = await model.generateContent(prompt);
    const code = result.response.text();

    await saveGeneration("code", topic, code, { complexity });

    res.json({ code });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

app.post("/api/generate-audio", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `Create an engaging audio lesson script about: "${topic}".
    The script should be:
    1. 3-4 minutes of spoken content
    2. Conversational and clear
    3. Include key points and examples
    4. End with a summary

    Format: Start each sentence on a new line for clarity.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text();

    const textToSpeechUrl = `https://tts.api.google.com/api/tts?text=${encodeURIComponent(
      script.substring(0, 100)
    )}&lang=en`;

    await saveGeneration("audio", topic, script, {
      textToSpeechUrl,
      scriptLength: script.length,
    });

    res.json({
      script,
      audioUrl: textToSpeechUrl,
      duration: "3-4 minutes",
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

app.post("/api/generate-images", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `Create detailed ASCII diagrams and descriptions for visualizing: "${topic}".
    Include:
    1. ASCII diagram(s) showing the concept
    2. Clear labels and annotations
    3. Step-by-step visual explanation
    4. Description of each component
    Make it educational and easy to understand.`;

    const result = await model.generateContent(prompt);
    const visualization = result.response.text();

    await saveGeneration("image", topic, visualization);

    res.json({
      visualization,
      description: "ASCII diagram and visual explanation generated",
    });
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).json({ error: "Failed to generate visualization" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`LearnSphere server running on http://localhost:${PORT}`);
});
