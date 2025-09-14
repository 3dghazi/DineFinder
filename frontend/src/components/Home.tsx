import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import FilterSidebar from "./FilterSidebar";
import RestaurantList from "./RestaurantList";
import RestaurantsMap from "./RestaurantsMap";
import { fetchRestaurants } from "../services/api";
import { Restaurant, FilterOptions } from "../types/types";
import toast from "react-hot-toast";

function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const [showNearby, setShowNearby] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    keyword: "",
    minprice: "",
    maxprice: "",
    opennow: false,
    rankby: "prominence",
    type: "restaurant",
    lat: undefined,
    lng: undefined,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleFetchRestaurants = useCallback(
    async (isLoadMore = false) => {
      setLoading(true);

      const currentFilters: FilterOptions = {
        ...filters,
        pagetoken: isLoadMore ? nextPageToken : undefined,
      };

      if (showNearby && filters.lat && filters.lng) {
        currentFilters.rankby = "distance";
      }
      try {
        const data = await fetchRestaurants(currentFilters);

        setRestaurants((prev) => {
          const newRestaurants = isLoadMore
            ? [...prev, ...data.results]
            : data.results;
          return newRestaurants;
        });

        setNextPageToken(data.next_page_token);
      } catch (err) {
        toast.error("Failed to fetch restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [filters, nextPageToken, showNearby]
  );

  useEffect(() => {
    handleFetchRestaurants(false);
  }, [filters, showNearby]);

  useEffect(() => {
    if (showNearby) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleFilterChange("lat", position.coords.latitude.toString());
          handleFilterChange("lng", position.coords.longitude.toString());
        },
        () => {
          toast.error("Unable to retrieve your location.");
          setShowNearby(false);
        }
      );
    } else {
      handleFilterChange("lat", undefined);
      handleFilterChange("lng", undefined);
    }
  }, [showNearby]);

  const loadMore = () => {
    if (nextPageToken) {
      handleFetchRestaurants(true);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        showNearby={showNearby}
        setShowNearby={setShowNearby}
      />

      <RestaurantList
        restaurants={restaurants}
        nextPageToken={nextPageToken}
        onLoadMore={loadMore}
        loading={loading}
        onRestaurantHover={setHoveredId}
      />

      <Box sx={{ width: "40%", minHeight: "100vh" }}>
        <RestaurantsMap
          restaurants={restaurants}
          hoveredId={hoveredId}
          height="100%"
        />
      </Box>
    </Box>
  );
}

export default Home;
