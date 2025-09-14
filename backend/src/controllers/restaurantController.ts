import { FastifyRequest, FastifyReply } from "fastify";
import { RestaurantService } from "../services/restaurantService";
import { RestaurantQueryParams } from "../types";

export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  async getRestaurants(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as RestaurantQueryParams;

      if (
        query.minprice &&
        (isNaN(Number(query.minprice)) ||
          Number(query.minprice) < 0 ||
          Number(query.minprice) > 4)
      ) {
        return reply.status(400).send({
          error: "Invalid minPrice. Must be a number between 0 and 4",
        });
      }

      if (
        query.maxprice &&
        (isNaN(Number(query.maxprice)) ||
          Number(query.maxprice) < 0 ||
          Number(query.maxprice) > 4)
      ) {
        return reply.status(400).send({
          error: "Invalid maxPrice. Must be a number between 0 and 4",
        });
      }

      if (
        query.minprice &&
        query.maxprice &&
        Number(query.minprice) > Number(query.maxprice)
      ) {
        return reply.status(400).send({
          error: "minPrice cannot be greater than maxPrice",
        });
      }

      if (
        query.type &&
        typeof query.type !== 'string'
      ) {
        return reply.status(400).send({
          error: "Invalid type. Must be a string",
        });
      }

      const params: RestaurantQueryParams = {
        pagetoken: query.pagetoken,
        minprice: query.minprice ? Number(query.minprice) : undefined,
        maxprice: query.maxprice ? Number(query.maxprice) : undefined,
        keyword: query.keyword,
        opennow: String(query.opennow) === "true",
        type: query.type,
        lat: query.lat ? Number(query.lat) : undefined,
        lng: query.lng ? Number(query.lng) : undefined,
        rankby: query.rankby,
      };

      if (params.pagetoken) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const data = await this.restaurantService.findAll(params);
      return reply.send(data);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to fetch restaurants",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getRestaurantById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    if (!id || typeof id !== "string") {
      return reply.status(400).send({
        error: "Invalid restaurant ID",
        details: "ID must be a valid string",
      });
    }

    try {
      const data = await this.restaurantService.findById(id);
      if (!data) {
        return reply.status(404).send({ error: "Restaurant not found" });
        
      }
      return reply.send(data);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to fetch restaurant details",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
