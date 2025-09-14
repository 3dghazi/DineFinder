export interface Restaurant {
  place_id: string;
  name: string;
  rating?: number;
  photos?: Array<{
    photo_reference: string;
  }>;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface RestaurantDetail extends Restaurant {
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  user_ratings_total?: number;
}

export interface FilterOptions {
  pagetoken?: string;
  minprice?: string;
  maxprice?: string;
  keyword?: string;
  opennow?: boolean;
  type?: string;
  rankby?: "distance" | "prominence";
  lat?: string;
  lng?: string;
}
