import React from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import RestaurantCard from "./RestaurantCard";
import { Restaurant } from "../types/types";

interface RestaurantListProps {
  restaurants: Restaurant[];
  nextPageToken?: string;
  onLoadMore: () => void;
  loading: boolean;
  onRestaurantHover?: (placeId: string | null) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  nextPageToken,
  onLoadMore,
  loading,
  onRestaurantHover,
}) => {
  return (
    <Paper
      elevation={2}
      component="main"
      sx={{
        flexGrow: 1,
        padding: 3,
        backgroundColor: "#ffffff",
        height: "700px",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {loading && restaurants.length > 0 && (
        <Backdrop
          open={true}
          sx={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Updating results...
            </Typography>
          </Box>
        </Backdrop>
      )}

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="text.primary">
          Restaurants ({restaurants.length})
        </Typography>
      </Box>

      {restaurants.map((restaurant) => {
        return (
          <Box
            key={restaurant.place_id}
            sx={{
              mb: 2,
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2 ease",
            }}
            onMouseEnter={() => onRestaurantHover?.(restaurant.place_id)}
            onMouseLeave={() => onRestaurantHover?.(null)}
          >
            <RestaurantCard restaurant={restaurant} />
          </Box>
        );
      })}

      {nextPageToken && !loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={onLoadMore}
            variant="contained"
            sx={{ width: "100%" }}
          >
            Load More Restaurants
          </Button>
        </Box>
      )}

      {!loading && restaurants.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "200px" }}
        >
          <Typography data-testid="no-results" variant="body1" color="text.secondary">
            No restaurants found. Try adjusting your filters.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RestaurantList;
