import { useEffect, useMemo } from "react";
import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useValue } from "../../context/ContextProvider";
import { useControl } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const Geocoder = ({ onResult }) => {
  const { dispatch } = useValue();

  // useMemo so we don't recreate this every render
  const ctrl = useMemo(
    () =>
      new MapBoxGeocoder({
        accessToken: process.env.REACT_APP_MAP_TOKEN,
        marker: false,
        collapsed: true,
      }),
    []
  );

  useControl(() => ctrl);

  useEffect(() => {
    const handleResult = (e) => {
      const coords = e.result.geometry.coordinates;
      dispatch({
        type: "UPDATE_LOCATION",
        payload: { lng: coords[0], lat: coords[1] },
      });
      if (onResult) {
        onResult(coords);
      }
    };

    ctrl.on("result", handleResult);
    return () => {
      ctrl.off("result", handleResult); // cleanup to prevent leaks
    };
  }, [ctrl, dispatch, onResult]);

  return null;
};

export default Geocoder;
