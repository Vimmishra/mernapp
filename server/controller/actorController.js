import { GoogleGenerativeAI } from "@google/generative-ai";
import Actor from "../models/Actor.js";

const genAI = new GoogleGenerativeAI("AIzaSyChWBJrjDkDQSmpTqW0QuMrMNAD54d3qfE");

export const bulkAddActorsUsingGemini = async (req, res) => {
  const { names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    console.warn("⚠️ Invalid or empty names array received");
    return res.status(400).json({ error: "Invalid names array" });
  }

  console.log("🚀 Starting bulk actor generation for names:", names);

 const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const actorIds = [];

  for (const name of names) {
    const prompt = `Give a VALID JSON object (no explanation or markdown) for the actor "${name}" with the following fields:
- name (full name)
- bio (short, max 4 lines)
- dob (YYYY-MM-DD format)
- image (royalty-free full size image URL, preferably from wikidata json not directly wikipedia, generate it like this: https://en.wikipedia.org/wiki/Brad_Pitt#/media/File:Brad_Pitt-69858.jpg )

Only return raw JSON. Do not include markdown, notes, or commentary.`;

    try {
      console.log(`\n➡️ Sending prompt to Gemini for actor: "${name}"`);
      const result = await model.generateContent(prompt);

      // Log the full Gemini result object to inspect all Gemini data
      console.log("🧠 Full Gemini result object:", result);

      let text = await result.response.text();

      console.log(`📥 Raw Gemini response for "${name}":\n${text}`);

      // Clean up Gemini's markdown formatting and extract JSON
      text = text
        .replace(/```json|```/gi, "")
        .replace(/^.*?\{/, "{")
        .replace(/\}[^}]*$/, "}")
        .trim();

      console.log(`🧹 Cleaned Gemini response text for "${name}":\n${text}`);

      // Try to extract valid JSON object if extra characters exist
      const match = text.match(/\{[\s\S]*?\}/);
      if (match) {
        text = match[0];
      }

      let data;
      try {
        data = JSON.parse(text);
        console.log(`✅ Parsed JSON for "${name}":`, data);
      } catch (parseErr) {
        console.warn(`❌ JSON parse error for "${name}":`, parseErr.message);
        console.warn(`Response text was:\n${text}`);
        continue; // Skip this actor and continue loop
      }

      // Ensure required fields exist
      if (data.name && data.bio && data.dob && data.image) {
        const existing = await Actor.findOne({ name: data.name });
        if (existing) {
          console.log(`ℹ️ Actor "${data.name}" already exists with ID ${existing._id}`);
          actorIds.push(existing._id);
        } else {
          const saved = await Actor.create(data);
          console.log(`✅ Created new actor "${data.name}" with ID ${saved._id}`);
          actorIds.push(saved._id);
        }
      } else {
        console.warn(`⚠️ Incomplete actor data for "${name}":`, data);
      }
    } catch (err) {
      console.error(`❌ Gemini request failed for "${name}":`, err);
    }
  }

  if (actorIds.length === 0) {
    console.warn("⚠️ No valid actor data was processed.");
    return res.status(500).json({ error: "Gemini failed to return valid actor data." });
  }

  console.log("🎉 Bulk actor generation complete. Actor IDs:", actorIds);
  res.status(201).json({ actorIds });
};



export const getBulkActorDetails = async (req, res) => {
  try {
    const { actorIds } = req.body;

    if (!actorIds || !Array.isArray(actorIds)) {
      return res.status(400).json({ success: false, message: "actorIds array is required" });
    }

    const actorDetails = await Actor.find({ _id: { $in: actorIds } });

    res.json({ success: true, actorDetails });
  } catch (error) {
    console.error("Error fetching actor details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};