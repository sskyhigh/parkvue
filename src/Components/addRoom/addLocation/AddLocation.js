import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { useValue } from "../../../context/ContextProvider";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "../../map/Geocoder"

const AddLocation = () => {
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
    <Box sx={{ height: 400, position: "relative" }}>
      <ReactMapGL
        ref={mapRef}
        mapboxAccessToken={pk.eyJ1Ijoic3NreWhpZ2giLCJhIjoiY2xweDRxYmN3MDd1aDJrcGFkMGNrZ2NnayJ9.zBViNdV3rkn4QDeNfNjUtw} // change this with env variable
        initialViewState={{
          longitude: lng || -74.006, // Default to NYC if lng not set
          latitude: lat || 40.7128, // Default to NYC if lat not set
          zoom: 8,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker
          latitude={lat || 40.7128} // Ensure marker appears even with defaults
          longitude={lng || -74.006}
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

export default AddLocation;
