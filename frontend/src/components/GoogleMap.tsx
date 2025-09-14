import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  markerTitle?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  lat, 
  lng, 
  zoom = 15, 
  height = '300px',
  markerTitle = 'Location'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found');
        return;
      }

      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['maps', 'marker']
      });

      const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
      await loader.importLibrary('marker');

      const map = new Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        mapId: 'DEMO_MAP_ID'
      });

      new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map,
        title: markerTitle,
      });
    };

    initializeMap();
  }, [lat, lng, zoom, markerTitle]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height, 
        width: '100%', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }} 
    />
  );
};

export default GoogleMap;