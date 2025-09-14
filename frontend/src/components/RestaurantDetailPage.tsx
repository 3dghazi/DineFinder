import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import RestaurantDetails from './RestaurantDetails';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();


  if (!id) {
    return <div>Restaurant not found</div>;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      
      <RestaurantDetails
        restaurantId={id}
      />
    </Container>
  );
};

export default RestaurantDetailPage;