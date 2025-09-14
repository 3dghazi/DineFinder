import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RestaurantDetailPage from './components/RestaurantDetailPage';
import Header from './components/Header';
import HomePageImage from './assets/HomePage.png';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Header title="Welcome to DineFinder" imageUrl={HomePageImage} />
                <Home />
              </>
            } 
          />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;