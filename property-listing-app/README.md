# Property Listing Application

A modern web application for browsing and posting property listings with an interactive UI.

## Features

- Browse property listings with details like price, location, bedrooms, and bathrooms
- Interactive star-field background with moving, connecting stars
- Post new property listings through a user-friendly form
- Responsive design for desktop and mobile devices
- Animated UI elements for better user experience

## Project Structure

```
property-listing-app/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   └── src/            # React source code
├── dataset/            # JSON data for properties
│   └── properties.json # Sample property data
└── README.md           # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/property-listing-app.git
   cd property-listing-app
   ```

2. Install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Browsing Properties

- The main page displays all available property listings
- Each property card shows an image, name, price, location, and room details

### Posting a New Property

1. Click the "Post Property" button
2. Fill in the required details:
   - Property name
   - Price
   - Location
   - Number of bedrooms
   - Number of bathrooms
   - Image URL
3. Click "Submit" to add your property to the listings

## Technologies Used

- React.js - Frontend framework
- CSS3 - Styling with animations
- Canvas API - Interactive background
- Axios - API requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.