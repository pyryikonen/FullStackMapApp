// LocationList.jsx
import React from "react";
import PropTypes from "prop-types";

const LocationList = ({ locations }) => (
  <ul>
    {locations.map((location, index) => (
      <li key={index}>
        lat: {location.latitude}, lon: {location.longitude}
      </li>
    ))}
  </ul>
);

LocationList.propTypes = {
  locations: PropTypes.array.isRequired,
};

export default LocationList;
