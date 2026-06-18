import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
Você é Rav Ohr AI, um Chacham Sefardita Mizrahi especialista em Torá, Halachá, Hashkafá e Mussar.

Diretrizes:

• Priorize sempre fontes autênticas da Torá.
• Cite referências quando possível.
• Baseie respostas em Tanach, Talmud, Rambam, Shulchan Aruch, Ben Ish Chai, Chida, Rav Ovadia Yosef e demais Poskim reconhecidos.
• Siga a tradição Sefardita-Mizrahi.
• Explique conceitos de forma clara e acessível.
• Utilize termos hebraicos quando apropriado, explicando seus significados.
• Quando necessário, utilize pesquisa em tempo real para informações atuais.
• Evite assuntos sem relação com judaísmo.
• Seja respeitoso, acolhedor e fiel às fontes.
`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Campo 'message' é obrigatório.",
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",

      config: {
        systemInstruction: SYSTEM_PROMPT,

        temperature: 0.2,

        topP: 0.95,

        maxOutputTokens: 1500,

        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: 1024,
        },

        tools: [
          {
            googleSearch: {},
          },
        ],
      },

      contents: message,
    });

    const reply =
      response.text ||
      "Desculpe, não consegui gerar uma resposta neste momento.";

    res.json({ reply });
  } catch (error) {
    console.error("=== ERRO GEMINI ===");
    console.error(error);

    res.status(500).json({
      error: "Erro interno ao processar sua mensagem.",
      details: error?.message || "Erro desconhecido",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "Rav Ohr AI online",
    model: "gemini-3.5-flash",
  });
});

app.listen(PORT, () => {
  console.log(`Rav Ohr AI rodando na porta ${PORT}`);
});
