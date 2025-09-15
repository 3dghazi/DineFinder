# DineFinder

DineFinder is a web application that helps users discover and explore restaurants based on location and preferences. It features an interactive map, filtering options, and detailed restaurant information to make finding the perfect dining spot easy and efficient.

## Running the Application with Docker Compose

1. **Ensure Docker and Docker Compose are installed.**
2. Open a terminal in the project root directory.
3. Build and start the frontend and backend services:

   ```bash
   docker-compose up --build
   ```

4. Access the frontend at [http://localhost:3001](http://localhost:3001)
5. The backend API will be available at [http://localhost:3000](http://localhost:3000)

**Note:**
- The containers will install dependencies, build, and start automatically.
- You can stop the services with:

   ```bash
   docker-compose down
   ```
