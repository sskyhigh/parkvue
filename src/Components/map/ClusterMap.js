import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { useLocation } from "react-router-dom"; // For checking the current URL
import { useValue } from "../../context/ContextProvider";
import { db, collection, getDocs } from "../../firebase/config"; // Firebase configuration
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
  const [rooms, setRooms] = useState([]); // State to store rooms from Firebase
  const mapRef = useRef();
  const currentLocation = useLocation(); // Get current URL

  useEffect(() => {
    // Fetch rooms from Firebase if on "/space/rooms"
    const fetchRooms = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = roomsSnapshot.docs.map(doc => doc.data());
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (currentLocation.pathname === "/space/rooms") {
      fetchRooms();
    }
  }, [currentLocation]);

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
        {/* Draggable marker for selecting new room location */}
        {currentLocation.pathname === "/space/upload" && (
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
        )}
        
        {/* Display room markers only on "/space/rooms" */}
        {currentLocation.pathname === "/space/map" &&
          rooms.map((room, index) => (
            <Marker
              key={index}
              latitude={room.lat}
              longitude={room.lng}
              color="red" // Use a different color to distinguish room markers
              draggable={false}
            />
          ))}

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
