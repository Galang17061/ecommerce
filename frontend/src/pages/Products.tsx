import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaShoppingCart, FaStar, FaHeart, FaSun, FaMoon, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardMedia, CardContent, IconButton, Snackbar, CircularProgress, Autocomplete, TextField, Breadcrumbs, Link, Fab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Tooltip from '@mui/material/Tooltip';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  soldCount: number;
  discount?: number;
}

// Update the theme with refined colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#283593', // Darker blue for better contrast
    },
    secondary: {
      main: '#f06292', // Softer pink for accents
    },
    background: {
      default: '#f5f5f5', // Light gray for background
    },
    text: {
      primary: '#212121', // Dark gray for text
      secondary: '#757575', // Medium gray for secondary text
    },
  },
});

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 2500000,
    image: "https://via.placeholder.com/300x300",
    rating: 4.5,
    soldCount: 1200,
    discount: 15
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    price: 2800000,
    image: "https://via.placeholder.com/300x300",
    rating: 4.8,
    soldCount: 950
  }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const productNames = sampleProducts.map(product => product.name);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Shoes', 'Clothing', 'Accessories', 'Electronics'];

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } })}>
      <CssBaseline />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {/* Breadcrumbs */}
          <Container sx={{ py: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="#">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Products
              </Link>
              <Typography color="text.primary">All Products</Typography>
            </Breadcrumbs>
          </Container>

          {/* Header */}
          <AppBar position="sticky" sx={{ backgroundColor: 'primary.main' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                E-Commerce
              </Typography>
              <Button color="inherit">Home</Button>
              <Button color="inherit">Shop</Button>
              <Button color="inherit">Contact</Button>
              <Tooltip title="Toggle Dark Mode">
                <IconButton color="inherit" onClick={handleDarkModeToggle}>
                  {darkMode ? <FaSun /> : <FaMoon />}
                </IconButton>
              </Tooltip>
              <Autocomplete
                freeSolo
                options={productNames}
                renderInput={(params) => <TextField {...params} label="Search products..." variant="outlined" />}
                sx={{ width: 300, marginLeft: 2 }}
              />
            </Toolbar>
          </AppBar>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ background: 'linear-gradient(to right, #283593, #5c6bc0)', color: 'white', padding: '50px 0', textAlign: 'center' }}
          >
            <Container>
              <Typography variant="h3" gutterBottom>Discover Amazing Products</Typography>
              <Typography variant="h5" gutterBottom>Shop the latest trends with unbeatable prices and exclusive deals</Typography>
              <Button variant="contained" color="secondary">Shop Now</Button>
            </Container>
          </motion.div>

          {/* Categories */}
          <Container sx={{ py: 3 }}>
            <Grid container spacing={2} justifyContent="center">
              {categories.map((category) => (
                <Grid item key={category}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Tooltip title={`View ${category} products`}>
                      <Button variant={selectedCategory === category ? "contained" : "outlined"} onClick={() => setSelectedCategory(category)}>
                        {category}
                      </Button>
                    </Tooltip>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* Products Grid */}
          <Container sx={{ py: 5 }}>
            <Grid container spacing={4}>
              {sampleProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={product.image}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.rating} <FaStar /> | {product.soldCount} sold
                        </Typography>
                        <Typography variant="h6" color="primary">
                          Rp {(product.price * (1 - (product.discount || 0) / 100)).toLocaleString()}
                        </Typography>
                        {product.discount && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            Rp {product.price.toLocaleString()}
                          </Typography>
                        )}
                      </CardContent>
                      <Tooltip title="Add to Wishlist">
                        <IconButton color="primary">
                          <FaHeart />
                        </IconButton>
                      </Tooltip>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* Enhanced Footer */}
          <footer style={{ backgroundColor: '#283593', color: '#fff', padding: '40px 0', textAlign: 'center' }}>
            <Container>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">About Us</Typography>
                  <Typography variant="body2">Learn more about our company and values.</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Customer Service</Typography>
                  <Typography variant="body2">Contact us for support and inquiries.</Typography>
                  <Typography variant="body2">Shipping & Returns</Typography>
                  <Typography variant="body2">FAQs</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Follow Us</Typography>
                  <div>
                    <Button color="inherit">Facebook</Button>
                    <Button color="inherit">Twitter</Button>
                    <Button color="inherit">Instagram</Button>
                  </div>
                  <Typography variant="body2">Subscribe to our newsletter</Typography>
                </Grid>
              </Grid>
            </Container>
          </footer>

          {/* Back to Top Button */}
          <Fab color="secondary" aria-label="back to top" onClick={handleBackToTop} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            <FaArrowUp />
          </Fab>
        </div>
      )}
    </ThemeProvider>
  );
};

export default Products; 