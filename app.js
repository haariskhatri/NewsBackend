const express = require("express");

const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const https = require("https");
const _ = require("lodash");
const { encode, decode } = require('url-encode-decode')
//const cookieparser = require('cookie-parser');
//const sessions = require('express-session');


const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const ethers = require("ethers");

const cors = require('cors');
const crypto = require('crypto');

const key = "56fae8129c16de3f46e82e0347cf6c157c2bf6de7454f1bf46ee7d8b1b50092f";

const NewsModel = require("./collections/globals");
const UserAddress = require('./collections/users');

const abi = require("./artifacts/contracts/Rating.sol/rating.json");
const provider = new ethers.providers.InfuraProvider("sepolia", "f6f192f81294461f873a6243cfccad29");
const signer = new ethers.Wallet(key, provider);
const Rating = new ethers.Contract(
  "0xf54EF64e3fbc0246570186519d95270Eb74AD8Bb",
  abi.abi,
  signer
);

mongoose
  .connect("mongodb+srv://root:Haaris8785@cluster0.walzl.mongodb.net/News")
  .then(() => {
    console.log("Success");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const adminRoutes = require("./routes/admin");
const { network } = require("hardhat");

const oneDay = 1000 * 60 * 60 * 24;

// app.use(sessions({
//   secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//   saveUninitialized: true,
//   cookie: { maxAge: oneDay },
//   resave: false
// }));

// app.use(cookieparser())

app.use(express.json());

app.use("/admin", adminRoutes.routes);

app.use(cors({
  origin: '*'
}));

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/approve", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "approve.html"));
});

app.post('/approved', async (req, res) => {
  const gasPrice = (await provider.getGasPrice()).toString()

  const tx = await Rating.Approve(1, { gasPrice: gasPrice, gasLimit: 3000000 });
  await tx.wait(1)
  res.send("Approved");
})


app.post("/check", (req, res) => {
  //const url = "https://www.indiatoday.in/cryptocurrency/story/ftx-founder-bankman-fried-charged-with-paying-forty-million-dollar-bribe-2352755-2023-03-29";

  console.log(req.body);
}
);

app.post("/article/:url", async (req, res) => {
  //const url = "https://www.indiatoday.in/cryptocurrency/story/ftx-founder-bankman-fried-charged-with-paying-forty-million-dollar-bribe-2352755-2023-03-29";
  const url = decode(req.params.url);
  console.log(url);
  const exists = await Rating.urls(url);

  if (exists == false) {
    const result = await axios.get(url).then(async (response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Uses cheerio to extract data from the HTML
      const body = $('*[class*="Story_description"]').text();

      const title = $("title").text();
      const final = await summarize(body);
      const div = $(`*[class*="Story_associate__image__bYOH_ topImage"]`);

      const imgSrc = div.find("img").attr("src");
      const sentiment = await check(final[0].summary_text);
      const loveIndex = sentiment[0].findIndex((label) => label.label == "love");
      const loveScore = sentiment[0][loveIndex].score;
      const joyIndex = sentiment[0].findIndex((label) => label.label == "joy");
      const joyScore = sentiment[0][joyIndex].score;
      const surpriseIndex = sentiment[0].findIndex(
        (label) => label.label == "surprise"
      );
      const surpriseScore = sentiment[0][surpriseIndex].score;
      var rating = parseFloat(
        (((loveScore + joyScore + surpriseScore) / 2) * 10).toFixed(1)
      );
      const category = await getCategory(body);

      if (rating == 0) {
        rating = 1;
      }
      const gasLimit = await Rating.estimateGas.addTransaction(url, rating * 10);
      //await Rating.addTransaction(url, rating * 10);

      const tx = await Rating.addTransaction(url, rating * 10, {
        gasLimit: gasLimit
      });
      await tx.wait(1);
      console.log("checking : ", Boolean(tx))

      NewsModel({
        url: url,
        title: title,
        text: final[0].summary_text,
        category: [category.labels[0], category.labels[1]],
        image: imgSrc,
      }).save();

      return res.json({
        text: final[0].summary_text,
        sentiment: sentiment,
        rating: rating,
      });
    });
  }
  else {
    res.send("Exists");
  }


});

const userexists = async (data) => {
  const exists = Boolean(UserAddress.find({ userAddress: data }));
  return exists;
}

// UserAddress({
//   userAddress: '0xC763131e6aF9c4220ef96AE3070a330f71D586cf'
// }).save();

var session;

app.post('/verify/:message/:signature/:userAddress', async (req, res) => {
  const userAddress = req.params.userAddress;
  const exists = await userexists(userAddress);
  session = req.session;
  if (exists) {

    console.log(userAddress);
    const message = req.params.message;
    console.log(message);
    const signature = req.params.signature;
    const verified = ethers.utils.verifyMessage(message, signature);
    console.log("Verified : ", verified);

    return res.json(verified);
  }
  else {
    res.send("User Does Not Exist")
  }
})

app.get('/random', (req, res) => {
  const number = crypto.randomInt(1000000);
  return res.json(number);
})

app.get('/news/:category', async (req, res) => {
  const category = req.params.category;

  const news = await NewsModel.find({ "category": { $in: [category] } })
  return res.json(news)
})

async function summarize(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

async function getCategory(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: data,
        parameters: { candidate_labels: ["India", "Global", "Sports", "Tech"] },
      }),
    }
  );
  const result = await response.json();
  return result;
}


async function check(data) {
  // const response = await fetch(
  //   "https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion",
  //   {
  //     headers: {
  //       Authorization: "Bearer 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",
  //     },
  //     method: "POST",
  //     body: {input : data , candidate_label : [""]},
  //   }
  // );
  // const result = await response.json();
  // console.log(result)
  // return result;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/app.ajrakhhouse.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/app.ajrakhhouse.com/fullchain.pem')
}

 https.createServer(options, app).listen(4000, console.log(`server runs on port 4000`))

//app.listen(5000);
