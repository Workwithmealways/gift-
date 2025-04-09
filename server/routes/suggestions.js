const OpenAI = require('openai');
const express = require('express');
const router = express.Router();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173/',
    'X-Title': 'gift-recommendation-platform',
  },
});

router.post('/api/suggestions', async (req, res) => {
  const { name, interests, personality, occasion } = req.body;

  const prompt = `Suggest 5 unique gift ideas for someone named ${name}.
Their interests include: ${interests}.
Personality traits: ${personality}.
The gift is for: ${occasion}.
Format each suggestion as:
Gift: [Name of the gift]
Image: [Short image description for search]
Available at: [Website like Amazon, Etsy, Flipkart]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0].message.content;

    const suggestions = content
      .split(/\n(?=Gift:)/)
      .map(entry => {
        const name = entry.match(/Gift:\s*(.*)/)?.[1]?.trim();
        const imagePrompt = entry.match(/Image:\s*(.*)/)?.[1]?.trim();
        const site = entry.match(/Available at:\s*(.*)/)?.[1]?.trim();

        return {
          name,
          imagePrompt,
          site,
          imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(imagePrompt)}`,
        };
      })
      .filter(g => g.name && g.imagePrompt && g.site); // remove incomplete entries

    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).send("Failed to fetch suggestions");
  }
});

module.exports = router;
