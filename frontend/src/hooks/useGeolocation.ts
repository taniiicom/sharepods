import { useState, useEffect } from "react";

type GeolocationState = {
  coordinates: [number, number] | null;
  error: string | null;
  loading: boolean;
};

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      const coordinates: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      setState({
        coordinates,
        error: null,
        loading: false,
      });
    };

    const error = (error: GeolocationPositionError) => {
      setState({
        coordinates: null,
        error: error.message,
        loading: false,
      });
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      success,
      error,
      options
    );

    // Clean up
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};

export default useGeolocation;
