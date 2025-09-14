import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Chip,
  Card,
  CardMedia,
  Paper,
  Link,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import {
  Phone,
  Language,
  LocationOn,
  Schedule,
  Close,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { fetchRestaurantDetails } from "../services/api";
import { RestaurantDetail } from "../types/types";
import defaultRestaurantImage from "../assets/DefaultRestaurant.jpg";
import GoogleMap from "./GoogleMap";
import { toast } from "react-hot-toast";

interface Props {
  restaurantId: string;
}

function RestaurantDetails({ restaurantId }: Props) {
  const [details, setDetails] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchRestaurantDetails(restaurantId);
        setDetails(data);
      } catch (err) {
        toast.error("Failed to load restaurant details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [restaurantId]);

  const getImageUrl = (photoReference: string, maxWidth = 400) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    if (details?.photos) {
      setCurrentImageIndex((prev) => (prev + 1) % details.photos!.length);
    }
  };

  const prevImage = () => {
    if (details?.photos) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + details.photos!.length) % details.photos!.length
      );
    }
  };

  const formatDay = (dayString: string) => {
    const [day, hours] = dayString.split(": ");
    return { day: day.trim(), hours: hours?.trim() || "Closed" };
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box p={3}>
        <Alert severity="warning">No details available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {details.name}
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Rating value={details.rating || 0} readOnly precision={0.1} />
          {details.rating && (
            <Typography variant="body1">{details.rating} out of 5</Typography>
          )}
          {details.opening_hours?.open_now !== undefined && (
            <Chip
              label={details.opening_hours.open_now ? "Open Now" : "Closed"}
              color={details.opening_hours.open_now ? "success" : "error"}
              size="small"
            />
          )}
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ backgroundColor: "#000", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ flex: 2 }}>
              <CardMedia
                component="img"
                image={
                  details.photos && details.photos[0]
                    ? getImageUrl(details.photos[0].photo_reference, 600)
                    : defaultRestaurantImage
                }
                alt={details.name}
                sx={{
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={() => openGallery(0)}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
              >
                {details.photos?.slice(1, 5).map((photo, index) => (
                  <CardMedia
                    key={index}
                    component="img"
                    image={getImageUrl(photo.photo_reference, 200)}
                    alt={`${details.name} ${index + 2}`}
                    sx={{
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => openGallery(index + 1)}
                  />
                ))}
                {details.photos && details.photos.length > 5 && (
                  <Box
                    sx={{
                      height: 70,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "white",
                    }}
                    onClick={() => openGallery(5)}
                  >
                    <Typography>+{details.photos.length - 5}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, height: "fit-content" }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>

            <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
              <LocationOn sx={{ color: "text.secondary", mt: 0.5 }} />
              <Typography>{details.formatted_address}</Typography>
            </Box>

            {details.formatted_phone_number && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Phone sx={{ color: "text.secondary" }} />
                <Link href={`tel:${details.formatted_phone_number}`}>
                  {details.formatted_phone_number}
                </Link>
              </Box>
            )}

            {details.website && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Language sx={{ color: "text.secondary" }} />
                <Link
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Link>
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          {details.opening_hours?.weekday_text && (
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Schedule sx={{ color: "text.secondary" }} />
                <Typography variant="h6">Opening Hours</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {details.opening_hours.weekday_text.map(
                      (dayString, index) => {
                        const { day, hours } = formatDay(dayString);
                        return (
                          <TableRow key={index}>
                            <TableCell
                              sx={{
                                borderBottom: "none",
                                py: 0.5,
                                fontWeight: "medium",
                              }}
                            >
                              {day}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", py: 0.5 }}>
                              {hours}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Location
          </Typography>
          {details.geometry?.location ? (
            <GoogleMap
              lat={details.geometry.location.lat}
              lng={details.geometry.location.lng}
              markerTitle={details.name}
              height="300px"
            />
          ) : (
            <Box
              sx={{
                height: 300,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                Location not available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, backgroundColor: "#000" }}>
          <Box position="relative">
            <IconButton
              onClick={() => setGalleryOpen(false)}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>

            {details.photos && details.photos[currentImageIndex] && (
              <img
                src={getImageUrl(
                  details.photos[currentImageIndex].photo_reference,
                  800
                )}
                alt={`${details.name} ${currentImageIndex + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}

            {details.photos && details.photos.length > 1 && (
              <>
                <IconButton
                  onClick={prevImage}
                  sx={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={nextImage}
                  sx={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default RestaurantDetails;
