import React from "react";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  RadioGroup,
  Radio,
  Box,
  Slider,
  Button,
  Collapse,
  IconButton,
  Switch,
} from "@mui/material";
import {
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { FilterOptions } from "../types/types";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  showNearby: boolean;
  setShowNearby: (value: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  showNearby,
  setShowNearby,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [priceFilterEnabled, setPriceFilterEnabled] = React.useState(false);
  const priceLabels = ["$", "$$", "$$$", "$$$$"];

  const formatPriceLabel = (value: number) => {
    return priceLabels[value] || "";
  };

  const priceRange = [
    parseInt(filters.minprice || "1"),
    parseInt(filters.maxprice || "4"),
  ];

  const handlePriceFilterToggle = (enabled: boolean) => {
    setPriceFilterEnabled(enabled);
    if (enabled) {
      onFilterChange("minprice", "1");
      onFilterChange("maxprice", "4");
    } else {
      onFilterChange("minprice", "");
      onFilterChange("maxprice", "");
    }
  };
  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const range = newValue as number[];
    onFilterChange("minprice", range[0].toString());
    onFilterChange("maxprice", range[1].toString());
  };

  const handleResetFilters = () => {
    onFilterChange("keyword", "");
    onFilterChange("minprice", "");
    onFilterChange("maxprice", "");
    onFilterChange("opennow", false);
    onFilterChange("rankby", "prominence");
    onFilterChange("type", "restaurant");
    onFilterChange("lat", undefined);
    onFilterChange("lng", undefined);
    setShowNearby(false);
    setPriceFilterEnabled(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "absolute",
          top: 10,
          left: isOpen ? 270 : 10,
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          transition: "left 0.3s ease",
        }}
      >
        {isOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
      </IconButton>

      <Collapse in={isOpen} orientation="horizontal">
        <Paper
          elevation={2}
          sx={{
            width: 300,
            padding: 3,
            backgroundColor: "#f8f9fa",
            height: "700px",
            overflowY: "auto",
            transition: "width 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Filters</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TextField
            fullWidth
            label="Search restaurants"
            placeholder="Enter keyword..."
            value={filters.keyword || ""}
            onChange={(e) => onFilterChange("keyword", e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.rankby || "prominence"}
              label="Sort By"
              onChange={(e) => onFilterChange("rankby", e.target.value)}
              disabled={showNearby}
            >
              <MenuItem value="prominence">Prominence</MenuItem>
              <MenuItem value="distance">Distance</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={priceFilterEnabled}
                  onChange={(e) => handlePriceFilterToggle(e.target.checked)}
                  color="primary"
                />
              }
              label="Filter by Price"
              sx={{ mb: 2, display: "block" }}
            />
            <Box sx={{ px: 2, opacity: priceFilterEnabled ? 1 : 0.5 }}>
              <Typography variant="subtitle2" gutterBottom>
                Price Range: {formatPriceLabel(priceRange[0])} -{" "}
                {formatPriceLabel(priceRange[1])}
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                disabled={!priceFilterEnabled}
                valueLabelFormat={(value) => formatPriceLabel(value)}
                min={1}
                max={4}
                step={1}
                marks={[
                  { value: 1, label: "$" },
                  { value: 2, label: "$$" },
                  { value: 3, label: "$$$" },
                  { value: 4, label: "$$$$" },
                ]}
                sx={{
                  "& .MuiSlider-thumb": {
                    backgroundColor: priceFilterEnabled ? "#1976d2" : "#ccc",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: priceFilterEnabled ? "#1976d2" : "#ccc",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              />
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={showNearby}
                onChange={(e) => setShowNearby(e.target.checked)}
              />
            }
            label="Show nearby only"
            sx={{ mb: 2, display: "block" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.opennow || false}
                onChange={(e) => onFilterChange("opennow", e.target.checked)}
              />
            }
            label="Open Now"
            sx={{ mb: 2, display: "block" }}
          />

          <FormControl>
            <Typography variant="subtitle2" color="text.secondary">
              Type
            </Typography>
            <RadioGroup
              row
              aria-labelledby="type-radio-buttons-group"
              name="type-radio-buttons-group"
              value={filters.type || "restaurant"}
              onChange={(e) => onFilterChange("type", e.target.value)}
            >
              <FormControlLabel
                value="restaurant"
                control={<Radio />}
                label="Restaurant"
              />
              <FormControlLabel value="cafe" control={<Radio />} label="Cafe" />
              <FormControlLabel value="bar" control={<Radio />} label="Bar" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleResetFilters}
              sx={{
                color: "#666",
                borderColor: "#ccc",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#999",
                },
              }}
            >
              Reset All Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default FilterSidebar;
