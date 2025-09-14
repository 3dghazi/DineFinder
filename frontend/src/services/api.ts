import axios from 'axios';
import { FilterOptions, Restaurant, RestaurantDetail } from '../types/types';

const API_BASE_URL = 'http://localhost:3000';

interface RestaurantsResponse {
  results: Restaurant[];
  next_page_token?: string;
}


interface RestaurantDetailResponse {
  result: RestaurantDetail;
}

export const fetchRestaurants = async (filters: FilterOptions): Promise<RestaurantsResponse> => {
 try {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.append(key, value.toString());
      }
    }

    const response = await axios.get<RestaurantsResponse>(`${API_BASE_URL}/restaurants`, { params });
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};


export const fetchRestaurantDetails = async (restaurantId: string): Promise<RestaurantDetail> => {
  try {
    const response = await axios.get<RestaurantDetailResponse>(`${API_BASE_URL}/restaurants/${restaurantId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching details for restaurant ${restaurantId}:`, error);
    throw error;
  }
};