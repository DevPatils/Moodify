import express from "express";
import { config } from "../config.js";
import { getAccessToken, getUserProfile } from "../services/spotify.js";

const router = express.Router();

// Step 1: Redirect to Spotify
router.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email playlist-modify-public playlist-modify-private";
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
});

// Step 2: Callback
router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code || null;
    const tokenData = await getAccessToken(code);
    const userProfile = await getUserProfile(tokenData.access_token);

    console.log("Logged in as:", userProfile.display_name);

    res.redirect(`${config.frontendUri}/#access_token=${tokenData.access_token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during authentication");
  }
});

export default router;
