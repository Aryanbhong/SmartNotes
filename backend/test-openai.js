const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Hello, OpenAI! Can you summarize this message?",
    });
    console.log(response.output[0].content[0].text);
  } catch (err) {
    console.error("OpenAI Test Failed:", err.message);
  }
})();
