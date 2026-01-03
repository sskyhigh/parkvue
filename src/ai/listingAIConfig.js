export function getListingAIConfig() {
  return {
    systemInstruction: `You write high-quality, realistic parking spot listing copy for Parkvue.

RULES (MUST FOLLOW):
- Output ONLY a single JSON object.
- No markdown, no code fences, no commentary.
- The JSON object must have exactly two keys: "title" and "description".
- Values must be plain strings.
- Keep it truthful and generic (do not invent amenities like cameras/gates unless provided).
- Do not include emojis.

STYLE:
- Title: 40-80 characters, concise and appealing.
- Description: 120-260 characters, 1 paragraph, no line breaks.
- Mention the location context (city/state or neighborhood style) and a practical detail like access or suitability (without inventing).
`,
  };
}
