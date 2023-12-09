import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material'
import ReactMapGL, {GeolocateControl, Marker, NavigationControl} from 'react-map-gl'
import {useValue} from "../../../context/ContextProvider";
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocoder from "./Geocoder";

const AddLocation = () => {
    const {state: {location: {lng, lat}}, dispatch} = useValue();
    const mapRef = useRef();
    useEffect(() => {
        if (!lng && !lat) {
            fetch('https://ipapi.co/json').then(response => {
                return response.json()
            }).then(data => {
                mapRef.current.flyTo({
                    center: [data.longitude, data.latitude]
                })
                dispatch({type: 'UPDATE_LOCATION', payload: {lng: data.longitude, lat: data.latitude}})
            })
        }
    }, [])
    ;
    return (
        <Box
            sx={{
                height: 400,
                position: 'relative'
            }}
        >
            <ReactMapGL ref={mapRef}
                        mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
                        initialViewState={{
                            longitude: lng,
                            latitude: lat,
                            zoom: 8
                        }}
                        mapStyle='mapbox://styles/mapbox/streets-v11'
            >
                <Marker
                    // /*23, 232*/
                    latitude={lat}
                    longitude={lng}
                    draggable
                    onDragEnd={(e) => dispatch({
                        type: 'UPDATE_LOCATION',
                        payload: {lng: e.lngLat.lng, lat: e.lngLat.lat}
                    })}
                />
                <NavigationControl position="bottom-right"/>
                <GeolocateControl
                    position='top-left'
                    trackUserLocation
                    onGeolocate={(e) => dispatch({
                        type: 'UPDATE_LOCATION',
                        payload: {lng: e.coords.longitude, lat: e.coords.latitude}
                    })}
                />
                <Geocoder />
            </ReactMapGL>
        </Box>
    );
};

export default AddLocation;