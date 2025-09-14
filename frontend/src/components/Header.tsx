import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
  imageUrl: string;
}

const Header: React.FC<HeaderProps> = ({ title, imageUrl }) => {
  return (
    <AppBar
      position="static"
      sx={{
        height: '700px',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Toolbar>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
