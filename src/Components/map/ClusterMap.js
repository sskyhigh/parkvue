import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { useValue } from "../../context/ContextProvider";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./Geocoder";

const ClusterMap = () => {
  const {
    state: {
      location: { lng, lat },
    },
    dispatch,
  } = useValue();
  const mapRef = useRef();

  useEffect(() => {
    if (!lng && !lat) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 10,
              essential: true,
            });
          }
          dispatch({
            type: "UPDATE_LOCATION",
            payload: { lng: longitude, lat: latitude },
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, [dispatch, lng, lat]);

  return (
    <Box sx={{ height: 800, position: "relative" }}>
      <ReactMapGL
        ref={mapRef}
        mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
        initialViewState={{
          longitude: -74.006, // NYC longitude
          latitude: 40.7128, // NYC latitude
          zoom: 12, // Adjust this for initial zoom level
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker
          latitude={lat || 0}
          longitude={lng || 0}
          draggable
          onDragEnd={(e) =>
            dispatch({
              type: "UPDATE_LOCATION",
              payload: { lng: e.lngLat.lng, lat: e.lngLat.lat },
            })
          }
        />
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="top-left"
          trackUserLocation
          onGeolocate={(e) =>
            dispatch({
              type: "UPDATE_LOCATION",
              payload: { lng: e.coords.longitude, lat: e.coords.latitude },
            })
          }
        />
        <Geocoder />
      </ReactMapGL>
    </Box>
  );
};

export default ClusterMap;
