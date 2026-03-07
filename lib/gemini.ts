function extractJSON(raw: string): string {
  const trimmed = raw?.trim() ?? "";

  if (!trimmed) {
    return "{}";
  }

  // Strip markdown code fences like ```json ... ``` or ``` ... ``` if present
  let text = trimmed.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();

  // Try to extract an object {...}
  const objStart = text.indexOf("{");
  const objEnd = text.lastIndexOf("}");

  if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
    const candidate = text.slice(objStart, objEnd + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // fall through
    }
  }

  // Try to extract an array [...]
  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");

  if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
    const candidate = text.slice(arrStart, arrEnd + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // fall through
    }
  }

  // If slicing failed, try using the whole text as JSON
  try {
    JSON.parse(text);
    return text;
  } catch {
    // As a last resort, return an empty JSON object string
    return "{}";
  }
}

async function callGeminiModel(prompt: string, model: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();

  // ── Check for API-level errors (e.g. invalid key, quota exceeded) ──
  if (data?.error) {
    const msg = data.error.message ?? "Unknown Gemini API error";
    const code = data.error.code ?? "UNKNOWN";
    console.error(`[generateGemini/${model}] API error ${code}: ${msg}`);
    throw new Error(`GEMINI_API_ERROR_${code}: ${msg}`);
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    console.warn(`[generateGemini/${model}] Empty response. Full response:`, JSON.stringify(data));
    return "";
  }

  console.log(`[generateGemini/${model}] Raw response:`, rawText.slice(0, 200));

  // Return the raw text, extraction will happen higher up
  return rawText;
}

// Models prioritized for lightweight operation (Free-Tier Friendly)
const GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-1.5-flash-8b",
  "gemini-flash-latest",
  "gemini-1.5-flash",
];

export async function generateGemini(prompt: string, expectJson: boolean = true): Promise<string> {
  let lastError: Error | null = null;
  const attemptedModels: string[] = [];

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[generateGemini] Attempting with model: ${model}`);
      attemptedModels.push(model);
      const result = await callGeminiModel(prompt, model);
      console.log(`[generateGemini] SUCCESS with model: ${model}`);
      return expectJson ? extractJSON(result) : result;
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message;

      // Log the specific failure for this model
      console.warn(`[generateGemini] Model ${model} failed: ${msg.split(':').pop()?.trim()}`);

      // Check for quota/rate-limit errors or model not found (in case of aliasing issues)
      if (
        msg.includes("429") || 
        msg.includes("RESOURCE_EXHAUSTED") || 
        msg.includes("quota") ||
        msg.includes("404") ||
        msg.includes("not found") ||
        msg.includes("limit") ||
        msg.includes("not supported")
      ) {
        console.warn(`[generateGemini] Attempting fallback...`);
        continue;
      }

      // For other critical errors (bad key, invalid request format), throw immediately
      console.error(`[generateGemini] Critical error on ${model}:`, msg);
      throw lastError;
    }
  }

  // All models exhausted
  const finalErrorMsg = `All Gemini models exhausted. Attempted: ${attemptedModels.join(", ")}. Last Error: ${lastError?.message}`;
  console.error(`[generateGemini] ${finalErrorMsg}`);
  throw new Error(finalErrorMsg);
}

export async function generateGeminiChat(prompt: string): Promise<string> {
  return generateGemini(prompt, false);
}
