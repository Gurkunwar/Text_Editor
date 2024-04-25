const axios = require("axios");
const express = require("express");
const { URLSearchParams } = require("url");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { translation: null, error: null });
});

app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  const encodedParams = new URLSearchParams();
  encodedParams.set("source_language", "en");
  encodedParams.set("target_language", targetLang);
  encodedParams.set("text", text);

  const options = {
    method: "POST",
    url: "https://text-translator2.p.rapidapi.com/translate",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "30121d7493mshaf03cb4cb48ee01p1451ebjsnbbd9c74d7ad2",
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    res.render("index", {
      translation: response.data.data.translatedText,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.render("index", {
      translation: null,
      error: "Error fetching data. Please try again",
    });
  }
});

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
