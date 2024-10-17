const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/api/verify", async (req, res) => {
  const { username } = req.body;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apiVersion = "v12.0"; // Use the latest version

  try {
    const response = await axios.get(
      `https://graph.instagram.com/${apiVersion}/ig_username_lookup`,
      {
        params: {
          q: username,
          access_token: accessToken,
        },
      }
    );

    if (response.data && response.data.id) {
      res.json({ verified: true, id: response.data.id });
    } else {
      res.json({ verified: false, message: "Account not found" });
    }
  } catch (error) {
    console.error(
      "Error verifying account:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "An error occurred while verifying the account" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
