import dotenv from "dotenv";
dotenv.config();

export const config = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  frontendUri: process.env.FRONTEND_URI,
};