import {
  Client,
  PlacesNearbyResponse,
  PlaceDetailsResponse,
} from "@googlemaps/google-maps-services-js";
import { config } from "../config/config";
import { RestaurantQueryParams } from "../types";

export class RestaurantService {
  private client: Client;


  constructor() {
    this.client = new Client({});
  }

  async findAll(
    options: RestaurantQueryParams = {}
  ): Promise<PlacesNearbyResponse["data"]> {
    const { lat, lng, ...restOptions } = options;
    const location = lat && lng ? { lat, lng } : config.defaultLocation;

    try {
      const response = await this.client.placesNearby({
        params: {
          location,
          radius: options.rankby === "distance" ? undefined : 5000,
          ...restOptions,
          type: options.type || "restaurant",
          key: process.env.GOOGLE_MAPS_API_KEY as string,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string): Promise<PlaceDetailsResponse["data"]> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: id,
          fields: [
            "name",
            "formatted_address",
            "rating",
            "photos",
            "geometry",
            "formatted_phone_number",
            "website",
            "opening_hours",
          ],
          key: process.env.GOOGLE_MAPS_API_KEY as string,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch restaurant details");
    }
  }
}
