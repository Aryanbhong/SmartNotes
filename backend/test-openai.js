// const OpenAI = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// (async () => {
//   try {
//     const response = await openai.responses.create({
//       model: "gpt-4.1-mini",
//       input: "Hello, OpenAI! Can you summarize this message?",
//     });
//     console.log(response.output[0].content[0].text);
//   } catch (err) {
//     console.error("OpenAI Test Failed:", err.message);
//   }
// })();

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-3.5-turbo" if needed
      messages: [{ role: "user", content: "Hello, OpenAI! Can you summarize this message?" }],
      max_tokens: 50,
    });

    console.log(chatResponse.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI Test Failed:", err.message);
  }
})();
