import React from "react";
import { MapContainer, useMapEvents } from "react-leaflet";
import axios from "axios";
import L from "leaflet";

const CustomMap = ({ addLocation }) => {
  // Use the useMapEvents hook to access the native Leaflet events
  const map = useMapEvents({
    dblclick: (event) => {
      // Handle the double click event on the map
      const { lat, lng } = event.latlng; // Get the latitude and longitude of the clicked point
      console.log("Click event:", event);
      const newLocation = { latitude: lat, longitude: lng }; // Create a new location object
      console.log("Latitude:", lat, "Longitude:", lng);

      // Add the new location to the state
      addLocation(newLocation);
      console.log("New Location:", newLocation);

      // Post the new location to the API
      try {
        axios
          .post(`${import.meta.env.VITE_API_URL}/api/locations`, newLocation)
          .then((response) => {
            console.log("successs", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error adding location:", error);
      }
    },
  });

  // Set the maximum bounds to restrict longitude values
  const maxBounds = L.latLngBounds(
    L.latLng(-90, -180), // Southwest corner
    L.latLng(90, 180) // Northeast corner
  );

  // Set the maximum bounds on the map
  map.setMaxBounds(maxBounds);

  // When the map is dragged, pan it back into bounds
  map.on("drag", () => {
    map.panInsideBounds(maxBounds, { animate: false });
  });

  return null; // Return null because we don't need to render anything
};

export default CustomMap;
