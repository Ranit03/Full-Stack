// Change from hardcoded port
// const port = 5000;

// To environment variable with fallback
const port = process.env.PORT || 5000;

// Then use this port variable when starting your server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});