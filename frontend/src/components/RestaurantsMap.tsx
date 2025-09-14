import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Restaurant } from "../types/types";

interface RestaurantsMapProps {
  restaurants: Restaurant[];
  hoveredId?: string | null;
  height?: string;
}

const RestaurantsMap: React.FC<RestaurantsMapProps> = ({
  restaurants,
  hoveredId,
  height = "400px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ marker: google.maps.marker.AdvancedMarkerElement; restaurant: Restaurant }[]>([]);
  const prevHoveredId = useRef<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return;

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key not found");
        return;
      }

      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["maps", "marker"],
      });

      try {
        const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
        await loader.importLibrary('marker'); 
        
        mapInstance.current = new Map(mapRef.current, {
          zoom: 12,
          center: { lat: 40.7128, lng: -74.0060 },
          mapId: 'DEMO_MAP_ID',
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach(({ marker }) => {
      marker.map = null;
    });
    markersRef.current = [];

    if (!restaurants.length) return;

    const bounds = new google.maps.LatLngBounds();

    restaurants.forEach((restaurant) => {
      if (restaurant.geometry?.location) {
        const pinElement = new google.maps.marker.PinElement({
          background: "#4285F4", 
          borderColor: "#3367D6",
          glyphColor: "white",
          scale: 1, 
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: {
            lat: restaurant.geometry.location.lat,
            lng: restaurant.geometry.location.lng,
          },
          map: mapInstance.current,
          title: restaurant.name,
          content: pinElement.element,
        });

        markersRef.current.push({ marker, restaurant });
        bounds.extend({
          lat: restaurant.geometry.location.lat,
          lng: restaurant.geometry.location.lng,
        });
      }
    });

    if (restaurants.length > 1) {
      mapInstance.current.fitBounds(bounds);
    } else if (restaurants.length === 1) {
      mapInstance.current.setCenter(bounds.getCenter());
      mapInstance.current.setZoom(15);
    }
  }, [restaurants]); 

  useEffect(() => {
    markersRef.current.forEach(({ marker, restaurant }) => {
      const isHovered = restaurant.place_id === hoveredId;
      const wasHovered = restaurant.place_id === prevHoveredId.current;
      
      if (isHovered !== wasHovered) {
        const pinElement = new google.maps.marker.PinElement({
          background: isHovered ? "#EA4335" : "#4285F4",
          borderColor: isHovered ? "#C5221F" : "#3367D6",
          glyphColor: "white",
          scale: isHovered ? 1.3 : 1,
        });
        
        marker.content = pinElement.element;
      }
    });
    
    prevHoveredId.current = hoveredId ?? null;
  }, [hoveredId]); 

  return (
    <div
      ref={mapRef}
      style={{
        height,
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    />
  );
};

export default RestaurantsMap;