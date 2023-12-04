import React from "react";
import { useMapEvents } from "react-leaflet";
import axios from "axios";

const CustomMap = ({ addLocation }) => {
  const map = useMapEvents({
    dblclick: (event) => {
      // Handle the double click event on the map
      const { lat, lng } = event.latlng;
      console.log("Click event:", event);
      const newLocation = { latitude: lat, longitude: lng };
      console.log("Latitude:", lat, "Longitude:", lng);

      // Add the new location to the state
      addLocation(newLocation);
      console.log("New Location:", newLocation);

      // Post the new location to the API
      try {
        axios
          .post(`${import.meta.env.VITE_API_URL}/api/locations`, newLocation)
          .then((response) => {
            console.log("Success", response.data);
          })
          .catch((error) => {
            console.error("Error adding location:", error);
          });
      } catch (error) {
        console.error("Error adding location:", error);
      }
    },
  });

  return null; // Return null because we don't need to render anything
};

export default CustomMap;
