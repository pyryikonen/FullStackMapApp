// App.jsx
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import LocationList from "./LocationList";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CustomMap from "./CustomMap"; // Import CustomMap

function App() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIt = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/locations`
      );
      const data = await response.json();

      // Filter out entries with null latitude or longitude
      const filteredLocations = data.filter(
        (location) => location.latitude !== null && location.longitude !== null
      );

      setLocations(filteredLocations);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = (newLocation) => {
    setLocations((prevLocations) => [...prevLocations, newLocation]);
  };

  return (
    <>
      <h1>Locations</h1>
      <LocationList locations={locations} />
      <button onClick={fetchIt}>Fetch</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {locations && (
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          doubleClickZoom={false} // Disable double-click zoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              draggable={true}
            >
              <Popup>
                Location: {location.latitude}, {location.longitude}
              </Popup>
            </Marker>
          ))}
          <CustomMap addLocation={addLocation} />
        </MapContainer>
      )}
    </>
  );
}

export default App;
