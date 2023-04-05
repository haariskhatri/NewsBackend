const { default: axios } = require("axios");
const { fillMask } = require("@huggingface/mask-filling");
const { pipeline } = require("@huggingface/nodejs-base");

const API_TOKEN = "YOUR_API_TOKEN";
const MODEL_ID = "my_custom_model";
const TEXT = " FTX founder Sam Bankman-Fried was charged with directing $40 million in bribes to one or more Chinese officials to unfreeze assets relating to his cryptocurrency business in a newly rewritten indictment unsealed Tuesday.The charge of conspiracy to violate the anti-bribery provisions of the Foreign Corrupt Practices Act raises to 13 the number of charges Bankman-Fried faces after he was arrested in the Bahamas in December and brought to the United States soon afterward. The indictment was returned on Monday.";

const getAuthToken = async () => {
  const response = await axios.post("https://api-inference.huggingface.co/auth", {
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json",
    },
  });
  return response.data.accessToken;
};

const classifyNewsCategory = async () => {
  const auth = await getAuthToken();
  const model = await pipeline(
    {
      modelId: MODEL_ID,
      token: auth,
      revision: "main",
    },
    "text-classification"
  );
  const category = await model(TEXT);
  console.log(category);
};

classifyNewsCategory();