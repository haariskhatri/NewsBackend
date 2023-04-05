const fetch = require("node-fetch");

const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

async function summarizeArticle(articleUrl) {
  const articleContent = await fetch(articleUrl).then((res) => res.text());
  const body = JSON.stringify({
    inputs: articleContent,
    parameters: {
      "model": API_URL,
      "num_beams": 4,
      "length_penalty": 2.0,
      "max_length": 512,
      "min_length": 64,
      "do_sample": false,
    },
  });
  const summary = await fetch(API_URL, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_TOKEN", // replace with your Hugging Face API token
    },
  }).then((res) => res.json());
  console.log(summary[0].summary_text);
}

const articleUrl = process.argv[2];
summarizeArticle(articleUrl);
