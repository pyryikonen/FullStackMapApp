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
              zoom={18}
              minZoom={0}
              maxZoom={20} // Adjust the maxZoom value according to your needs
              style={{ height: "100%", width: "100%" }}
              doubleClickZoom={false} // Disable double-click zoom
              maxBounds={[
                // Define the maximum bounds for latitude and longitude
                [90, 180], // Northeast corner
                [-90, -180], // Southwest corner
              ]}
              maxBoundsViscosity={1.0} // Enforce bounds strictly
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
