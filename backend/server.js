const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Hugging Face API setup
const HF_API_KEY = "xyz";
const HF_API_URL = "https://api-inference.huggingface.co/models/mrm8488/t5-base-finetuned-common_gen";

// Career prediction endpoint
app.post('/predict', async (req, res) => {
  const { skills, interests } = req.body;

  if (!skills || !interests) {
    return res.status(400).send({ error: 'Missing skills or interests' });
  }

  try {
    const prompt = `Given the following skills and interests, suggest a specific career: Skills: ${skills}, Interests: ${interests}.`;

    // Call Hugging Face API to get career recommendations
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the full response for debugging
    console.log("Response from Hugging Face API:", response.data);

    // Assuming the response contains the recommendation in the first choice
    const recommendation = response.data[0]?.generated_text.trim();
    console.log('Career Recommendation:', recommendation); // Log the extracted recommendation
    res.send({ career: recommendation });
  } catch (error) {
    console.error("Error during Hugging Face API request:", error);
    res.status(500).send({ error: 'Failed to generate career recommendation' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Node.js API Running on Port ${port}`);
});
