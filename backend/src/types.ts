import { PlacesNearbyRanking } from '@googlemaps/google-maps-services-js';

export interface RestaurantQueryParams {
  pagetoken?: string;  
  minprice?: number;
  maxprice?: number;
  keyword?: string;
  opennow?: boolean;
  type?: string;
  lat?: number;
  lng?: number;
  rankby?: PlacesNearbyRanking;
} 