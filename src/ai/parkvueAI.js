import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = "gemini-2.5-flash";

let _client;

function getClient() {
  if (_client) return _client;

  const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing REACT_APP_GOOGLE_AI_API_KEY. Add it to your environment to use Parkvue AI."
    );
  }

  _client = new GoogleGenAI({ apiKey });
  return _client;
}

/**
 * Shared Gemini generate helper used by both chatbot and listing AI.
 *
 * @param {{contents: any, config?: object, model?: string}} params
 * @returns {Promise<string>}
 */
export async function generateParkvueAIText({ contents, config, model } = {}) {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: model || DEFAULT_MODEL,
    config,
    contents,
  });

  return response?.text || "";
}

/**
 * Parses a strict JSON object from an LLM response.
 * Allows extra whitespace and accidental ```json fences, but otherwise expects JSON.
 */
export function parseAIJSONObject(text) {
  const raw = String(text ?? "").trim();
  if (!raw) throw new Error("AI returned an empty response.");

  // Strip common markdown fences if the model accidentally adds them.
  let cleaned = raw;
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI did not return a JSON object.");
  }

  const jsonStr = cleaned.slice(start, end + 1);
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("AI returned invalid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI JSON must be an object.");
  }

  return parsed;
}
