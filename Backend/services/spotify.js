import axios from "axios";
import { config } from "../config.js";

export const getAccessToken = async (code) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const res = await axios.post("https://accounts.spotify.com/api/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
};

export const getUserProfile = async (accessToken) => {
  const res = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};
