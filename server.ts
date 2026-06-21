import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

const POLICY_DOCUMENT = `
FoodFix Customer Support Policy

1. Refund Policy
Customers may be eligible for a refund if:
- The order is cancelled by the restaurant.
- The order is not delivered.
- The delivered food is spoiled, unsafe, or not edible.
- A major item is missing from the order.
- The wrong item is delivered.

Refunds are not guaranteed automatically. Final refund approval may require review by the FoodFix support team.

2. Refund Timeline
Once approved, refunds usually take 3 to 7 business days to reflect in the customer's original payment method.
Wallet refunds may reflect faster.

3. Delay Compensation Policy
If an order is delayed, the customer may be eligible for an apology coupon depending on the delay duration and order value.
A delayed order does not always mean automatic refund.
If the customer wants exact live order status, the issue should be escalated to a human agent.

4. Cancellation Policy
Customers can cancel an order before the restaurant starts preparing it.
Once preparation has started, cancellation may not be allowed.
If the order is extremely delayed, FoodFix support may review the case.

5. Coupon Policy
Only one coupon can be applied per order unless clearly mentioned in the offer.
Coupons may fail if the order does not meet minimum order value, restaurant eligibility, location eligibility, or payment method conditions.

6. Missing or Wrong Item Policy
If an item is missing or the wrong item is delivered, the customer should report it through support.
FoodFix may ask for order details or an image.
Refund or replacement depends on verification.

7. Food Quality Policy
If food is spoiled, unsafe, spilled, leaked, or packaging is damaged, the customer should upload a clear image.
FoodFix support will review the complaint.
The customer may be eligible for refund, coupon, or replacement depending on the case.

8. Human Escalation Policy
Escalate to a human agent if:
- The customer asks for a human.
- The issue needs payment verification.
- The issue needs live order tracking.
- The issue is unclear.
- The customer is very angry.
- The AI is not sure about the answer.
`;

async function startServer() {
  const app = express();

  // Middleware for parsing JSON with a larger limit to handle base64 images
  app.use(express.json({ limit: "15mb" }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Support chat endpoint
  app.post("/api/support", async (req: any, res: any) => {
    try {
      const { query, history, image } = req.body;

      const historyText = (history || [])
        .map((msg: any) => `${msg.isBot ? "Bot" : "User"}: ${msg.text}`)
        .join("\n");

      let prompt = "";
      let imagePart: any = null;

      if (image && image.data && image.mimeType) {
        imagePart = {
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          },
        };

        prompt = `You're a helpful assistant of a food service company called food fix, please respond to user's query, be courteous.
        Use the following policy document -
        ${POLICY_DOCUMENT}.
        Check the food quality from the attached image. If the food quality is bad (for example, the food is burnt or there is mold/mould) then tell them that the refund is being processed and also apologize.
        If the food in the image is NOT burnt, mouldy, or corrupt, or if it is unclear, then tell the user you must escalate to a human agent for manual verification.
        
        Here is the query - ${query}.
        Use the following historical conversation -
        ${historyText}`;
      } else {
        prompt = `You're a helpful assistant of a food service company called food fix, please respond to the user's query, be courteous.
        Use the following policy document -
        ${POLICY_DOCUMENT}.

        YOUR RULES of execution:
        1. You must ONLY answer policy related questions and food quality related questions. If the topic is entirely irrelevant, decline politely.
        2. If the user's question is about a food quality issue (e.g., they complain that food is burnt, mouldy, spoiled, has hair, is bad, etc.), you MUST ask the user to click the upload button to upload an image of the food for us to verify, saying that an image is required to initiate a refund. Do NOT process or promise a refund until they upload an image.
        3. If it is a standard policy question, answer it directly and courteously using the policy document.
        4. If the user complains about missing details, live tracking, or says they want a human, escalate to a human agent.

        Here is the query - ${query}.
        Use the following historical conversation -
        ${historyText}`;
      }

      const contentParts: any[] = [];
      if (imagePart) {
        contentParts.push(imagePart);
      }
      contentParts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentParts,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Something went wrong processing your request." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
