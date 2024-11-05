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
  const defaultLocation = { lng: -74.006, lat: 40.7128 }; // NYC default location
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
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location
          dispatch({
            type: "UPDATE_LOCATION",
            payload: defaultLocation,
          });
        },
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
          longitude: lng || defaultLocation.lng,
          latitude: lat || defaultLocation.lat,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker
          latitude={lat || defaultLocation.lat}
          longitude={lng || defaultLocation.lng}
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
