import React from "react";
import { Box, Typography, Rating } from "@mui/material";
import { Restaurant } from "../types/types";
import defaultRestaurantImage from "../assets/DefaultRestaurant.jpg";
import { useNavigate } from "react-router-dom";

interface Props {
  restaurant: Restaurant;
}

function RestaurantCard({ restaurant }: Props) {
  const getImageUrl = () => {
    if (restaurant.photos && restaurant.photos[0]) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    }
    return defaultRestaurantImage;
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/restaurant/${restaurant.place_id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        margin: "8px 0",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "white",
        transition: "all 0.2s ease",
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        height: "140px",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          width: "140px",
          height: "140px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={getImageUrl()}
          alt={restaurant.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          padding: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              mb: 1,
            }}
            data-testid="restaurant-card-title"
          >
            {restaurant.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
          }}
        >
          <Rating
            value={restaurant.rating}
            readOnly
            precision={0.1}
            size="small"
          />
          {restaurant.rating && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              ({restaurant.rating})
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default RestaurantCard;
