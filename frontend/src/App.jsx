// App.jsx
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import LocationList from "./LocationList";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CustomMap from "./CustomMap"; // Import CustomMap
import styles from "App.module.css"

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
    <div className={styles.mapContainer}>
      <div className={styles.locationList}>
        <LocationList locations={locations} />
      </div>
      <div className={styles.map}>
        <button onClick={fetchIt}>Fetch</button>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {locations && (
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            className={styles.mapContainer}  // Apply the class for the map container
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
      </div>
    </div>
  </>
);



export default App;
