import { GoogleGenerativeAI } from "@google/genai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Você é o Gadol AI, um Talmid Chacham Sefardita... (mantenha seu prompt completo aqui)`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Instancia o modelo exato do seu código
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    // 2. Tradução exata das configurações do seu Get Code
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      tools: [
        {
          googleSearch: {} // Ativa o Google Search que está no seu código
        }
      ],
      generationConfig: {
        maxOutputTokens: 1988, // O limite exato que apareceu no seu código
        // O Thinking Level HIGH é ativado via parâmetro de modelo ou temperatura
        temperature: 0.7, 
      }
    });

    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro no servidor do Rav" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rav Ohr Online na porta ${PORT}`);
});
