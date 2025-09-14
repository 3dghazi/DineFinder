import { FastifyRequest, FastifyReply } from 'fastify';
import { RestaurantController } from './restaurantController';
import { RestaurantService } from '../services/restaurantService';

jest.mock('../services/restaurantService');

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let mockRestaurantService: jest.Mocked<RestaurantService>;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRestaurantService = new RestaurantService() as jest.Mocked<RestaurantService>;
    controller = new RestaurantController(mockRestaurantService);
    
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getRestaurants', () => {
    it('should return 400 if minprice is invalid', async () => {
      mockRequest = {
        query: { minprice: '5' },
      };

      await controller.getRestaurants(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Invalid minPrice. Must be a number between 0 and 4'
      });
    });

    it('should return 400 if minprice > maxprice', async () => {
      mockRequest = {
        query: { minprice: '3', maxprice: '2' },
      };

      await controller.getRestaurants(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'minPrice cannot be greater than maxPrice'
      });
    });

    it('should return restaurants when valid parameters', async () => {
      const mockData = { results: [{ place_id: '123', name: 'Test Restaurant' }] };
      mockRestaurantService.findAll = jest.fn().mockResolvedValue(mockData);

      mockRequest = {
        query: { minprice: '1', maxprice: '3' },
      };

      await controller.getRestaurants(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.send).toHaveBeenCalledWith(mockData);
    });

  });

  describe('getRestaurantById', () => {
    it('should return 400 if id is missing', async () => {
      mockRequest = {
        params: {},
      };

      await controller.getRestaurantById(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Invalid restaurant ID',
        details: 'ID must be a valid string'
      });
    });

    it('should return restaurant details when id is valid', async () => {
      const mockData = { result: { place_id: '123', name: 'Test Restaurant' } };
      mockRestaurantService.findById = jest.fn().mockResolvedValue(mockData);

      mockRequest = {
        params: { id: 'ChIJ123' },
      };

      await controller.getRestaurantById(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.send).toHaveBeenCalledWith(mockData);
    });
  });
});