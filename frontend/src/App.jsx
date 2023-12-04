// App.jsx
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import LocationList from "./LocationList";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CustomMap from "./CustomMap"; // Import CustomMap
import styles from "./App.module.css";

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
      <div className={styles.container}>
        <div className={styles.map}>
          <button onClick={fetchIt}>Fetch</button>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error.message}</p>}
          {locations && (
            <MapContainer
              center={[61.49874970332889, 23.77141965304882]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              minZoom={25} // Set minZoom to control the minimum zoom level
              maxZoom={8} // Set maxZoom to control the maximum zoom level
              doubleClickZoom={false} // Disable double-click zoom
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                  draggable={false}
                >
                  <Popup>
                    <p>ID: {location.id}</p>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                  </Popup>
                </Marker>
              ))}
              <CustomMap addLocation={addLocation} />
            </MapContainer>
          )}
        </div>
        <div className={styles.locationList}>
          {locations.map((location, index) => (
            <div key={index} className={styles.locationBox}>
              {/* Customize the content of each location box as needed */}
              <p>
                Location: {location.latitude}, {location.longitude}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
