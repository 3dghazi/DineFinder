import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { RestaurantService } from "./services/restaurantService";
import { config } from "./config/config";   
import { RestaurantController } from "./controllers/restaurantController";

dotenv.config();

const server = fastify({
  logger: true,
});

server.register(cors, {
  origin: true,
});

const restaurantService = new RestaurantService();
const restaurantController = new RestaurantController(restaurantService);

server.get('/restaurants', (req, reply) => restaurantController.getRestaurants(req, reply))
server.get('/restaurants/:id', (req, reply) => restaurantController.getRestaurantById(req, reply))

const start = async () => {
  try {
    await server.listen({ port: config.port, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
