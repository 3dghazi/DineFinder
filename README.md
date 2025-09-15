# DineFinder

## Environment Setup

To run this project, you need to create two `.env` files:

- `backend/.env`
- `frontend/.env`

### API Keys Required

This project uses the Google Places API (backend) and Google Maps (frontend). You must obtain two separate API keys from Google Cloud Platform:

1. **Google Places API Key** (for backend)
2. **Google Maps JavaScript API Key** (for frontend)

Add your keys to the respective `.env` files:

#### Example: `backend/.env`
```
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

#### Example: `frontend/.env`
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Make sure to replace the example values with your actual API keys.

DineFinder is a web application that helps users discover and explore restaurants based on location and preferences. It features an interactive map, filtering options, and detailed restaurant information to make finding the perfect dining spot easy and efficient.


## Running the Application 

### Option 1: Using Docker Compose (Recommended)

1. Create the required `.env` files as described in the Environment Setup section above.

2. From the root directory of the project, run:
   ```bash
   docker-compose up --build
   ```

3. The application will be available at:
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend API: [http://localhost:3000](http://localhost:3000)

This will build the Docker images, install all dependencies, and start both services with proper networking between them.

### Option 2: Local Development

1. Open a terminal and move to the backend folder:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will listen on port 3000.

2. Open another terminal and move to the frontend folder:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will be available at [http://localhost:3001](http://localhost:3001), which is the home page.

3. Visit [http://localhost:3001](http://localhost:3001) in your browser to use the app.
