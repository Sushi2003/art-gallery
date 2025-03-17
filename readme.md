# ArtVista - Virtual Art Gallery

ArtVista is a web-based virtual art gallery that showcases masterpieces from the Metropolitan Museum of Art. This project provides an interactive platform for art enthusiasts to explore artwork from various periods and cultures.

![ArtVista Screenshot](pfp/Screenshot 2025-03-17 at 10.56.44 PM.png)

## Demo: [art-vista.com](https://art-gallery-chi-three.vercel.app/)


## Features

- **Dynamic Content**: Fetches real artwork data from the Metropolitan Museum of Art API
- **Category-based Organization**: Browse artwork by European, Asian, Egyptian, and Photography collections
- **Search Functionality**: Find artwork by title or artist name
- **Interactive Gallery**: View artwork details with zoom capability
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Metropolitan Museum of Art API

## Project Structure

```
/artvista
│
├── index.html          # Main HTML file with page structure
├── styles.css          # CSS styling for all components
├── script.js           # JavaScript for API fetching and interactions
└── README.md           # Project documentation
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/artvista.git
   ```

2. Navigate to the project directory:
   ```bash
   cd artvista
   ```

3. Open `index.html` in your web browser to view the application.

## API Integration

This project uses the Metropolitan Museum of Art Collection API:
- Base URL: `https://collectionapi.metmuseum.org/public/collection/v1/`
- [API Documentation](https://metmuseum.github.io/)

The app fetches:
- Highlighted artworks using the search endpoint
- Department-specific artworks using the department endpoints
- Individual artwork details for rich information display

## Features in Detail

### Gallery Page
- Grid layout of artwork thumbnails
- Filtering system by category
- Search functionality by title or artist
- Load more pagination for browsing large collections

### Artwork Modal
- High-resolution image display
- Zoom controls for detailed viewing
- Artwork information (title, artist, date, medium)
- Navigation between artworks

### About Section
- Information about the project
- Development team profiles with contact links

## Development Team

- **Tamanna Singh** - Frontend Developer 
- **Tanishq Kashla** - UI/UX Designer 
- **Sushmayana Mishra** - Backend Developer

## Future Enhancements

- User accounts with favorite collections
- Virtual guided tours by era and style
- Art history information and educational content
- Social sharing capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- The Metropolitan Museum of Art for providing the open API
- All artwork images and data courtesy of The Metropolitan Museum of Art

---

This project was created as a college project to demonstrate skills in HTML, CSS, and JavaScript.