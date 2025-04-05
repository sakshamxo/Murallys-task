import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export const getCityFromCoords = async (latitude, longitude) => {
  try {
    if (!latitude || !longitude) {
      throw new Error("Latitude and longitude are required.");
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`;

    const response = await axios.get(url);

    if (response.data && response.data.results && response.data.results.length > 0) {
      const components = response.data.results[0].components;
      const city = components.city || components.town || components.village || components.state_district || components.state;

      return city || "Unknown City";
    } else {
      console.warn("No valid location data found.");
      return "Unknown City";
    }
  } catch (error) {
    console.error("Geolocation error:", error?.response?.data || error.message);
    return "Unknown City";
  }
};