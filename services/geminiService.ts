import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are a world-class "Micro-App" generator. Your goal is to create fully functional, single-file HTML applications based on user prompts.

**DESIGN & AESTHETICS (CRITICAL):**
1.  **Modern Clean (Default)**:
    *   **Light Mode**: Background MUST be \`bg-white\`. Text \`text-zinc-950\`.
    *   **Dark Mode**: Background MUST be \`bg-black\` (pure black #000000). Text \`text-white\`.
    *   **Buttons**: ALWAYS use **pill-shaped** buttons (\`rounded-full\`).
        *   Light: \`bg-zinc-100 hover:bg-zinc-200 text-black px-6 py-2 transition-colors font-medium\`.
        *   Dark: Glossy/Frosted look. \`bg-zinc-900/50 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white px-6 py-2 transition-all font-medium\`.
    *   **Cards/Containers**: Use **frosted glass** effects.
        *   Light: \`bg-white/80 backdrop-blur-xl border border-zinc-100 shadow-sm rounded-3xl\`.
        *   Dark: \`bg-zinc-900/70 backdrop-blur-xl border border-white/5 rounded-3xl\`.
    *   **Inputs**: Pill-shaped (\`rounded-full\`) with subtle borders.
2.  **Neo-Brutalism**: ONLY If explicitly asked.
    *   Use hard borders (\`border-2 border-black\`).
    *   Hard shadows (\`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\`).
    *   Bold, high-contrast colors (Neon Green, Hot Pink, Cyan).
    *   Sharp corners or slight rounding.

**TECHNICAL RULES:**
1.  **Output Format**: Return ONLY the raw HTML string. Do not wrap it in markdown code blocks.
2.  **Tech Stack**:
    *   Tailwind CSS (CDN).
    *   React & ReactDOM (CDN).
    *   Babel Standalone (CDN).
    *   Lucide React (CDN - via unpkg or similar if needed, or SVG icons). Ideally use inline SVGs or standard text for simplicity unless specified.
3.  **Structure**:
    *   Standard HTML5 boilerplate.
    *   Root div with id="root".
    *   Script tag type="text/babel".
4.  **Functionality**:
    *   Self-contained. No external assets unless standard CDNs.
    *   Make it interactive and polished.

**Example of specific requested style**:
If the user asks for "Make a calculator", provide a sleek, Apple-style calculator with frosted glass background and pill/circle buttons.
`;

export const generateAppCode = async (prompt: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Create a micro-app for this request: "${prompt}"` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    let code = response.text || "";
    code = code.replace(/```html/g, "").replace(/```/g, "").trim();
    return code;
  } catch (error) {
    console.error("Error generating app:", error);
    throw error;
  }
};

export const editAppCode = async (currentCode: string, history: ChatMessage[], userPrompt: string): Promise<string> => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");
  
      const ai = new GoogleGenAI({ apiKey });

      // Construct a history context string
      const historyContext = history.map(msg => 
        `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`
      ).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [{ text: `Here is the current HTML code of a web app:
                
                ${currentCode}
                
                ***
                Conversation History:
                ${historyContext}
                ***
                
                The user wants to make this NEW change: "${userPrompt}".
                
                Return the FULLY UPDATED HTML code. Apply the requested changes while maintaining the existing functionality and the design guidelines (Pill shaped buttons, frosted glass, pure black/white backgrounds). Return ONLY raw HTML.` }]
            }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
  
      let code = response.text || "";
      code = code.replace(/```html/g, "").replace(/```/g, "").trim();
      return code;
    } catch (error) {
      console.error("Error editing app:", error);
      throw error;
    }
  };