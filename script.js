// Global variables
let allArtworks = [];
let displayedArtworks = [];
let currentPage = 1;
const artworksPerPage = 12;
let currentCategory = 'all';
let currentArtworkIndex = 0;
let zoomLevel = 1;

// DOM Elements
const galleryContainer = document.getElementById('gallery-container');
const loadingElement = document.getElementById('loading');
const loadMoreBtn = document.getElementById('load-more');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('artwork-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalDate = document.getElementById('modal-date');
const modalMedium = document.getElementById('modal-medium');
const modalDimensions = document.getElementById('modal-dimensions');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const prevArtworkBtn = document.getElementById('prev-artwork');
const nextArtworkBtn = document.getElementById('next-artwork');

// Artwork categories to search for (departments in Met API)
const categories = {
    'European Paintings': 11,
    'Asian Art': 6,
    'Egyptian Art': 10,
    'Photography': 19
};

// Initialize the gallery
async function initGallery() {
    showLoading();
    await fetchArtworksForAllCategories();
    filterArtworks('all');
    hideLoading();
}

// Fetch artworks for all categories
async function fetchArtworksForAllCategories() {
    const fetchPromises = [];

    // Add a fetch for highlighted artworks
    fetchPromises.push(fetchHighlightedArtworks());

    // Add fetches for each category
    for (const category in categories) {
        fetchPromises.push(fetchArtworksByDepartment(categories[category], category));
    }

    // Wait for all fetches to complete
    await Promise.all(fetchPromises);

    // Shuffle the artworks for a more interesting initial display
    shuffleArray(allArtworks);
}

// Fetch highlighted/featured artworks
async function fetchHighlightedArtworks() {
    try {
        // Fetch some highlighted artworks (using a search for "masterpiece" as an example)
        const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?q=masterpiece&hasImages=true');
        const data = await response.json();

        if (data.objectIDs && data.objectIDs.length > 0) {
            // Get the first 10 objects
            const selectedIDs = data.objectIDs.slice(0, 10);

            // Fetch details for each artwork
            for (const id of selectedIDs) {
                await fetchArtworkDetails(id, 'Highlighted');
            }
        }
    } catch (error) {
        console.error('Error fetching highlighted artworks:', error);
    }
}

// Fetch artworks by department ID
async function fetchArtworksByDepartment(departmentId, categoryName) {
    try {
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}&hasImages=true`);
        const data = await response.json();

        if (data.objectIDs && data.objectIDs.length > 0) {
            // Get 15 random objects from this department
            const randomIDs = getRandomItems(data.objectIDs, 15);

            // Fetch details for each artwork
            for (const id of randomIDs) {
                await fetchArtworkDetails(id, categoryName);
            }
        }
    } catch (error) {
        console.error(`Error fetching artworks for department ${departmentId}:`, error);
    }
}

// Fetch details for a specific artwork
async function fetchArtworkDetails(objectId, category) {
    try {
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
        const artwork = await response.json();

        // Only add artworks that have images and basic information
        if (artwork.primaryImage && artwork.title) {
            allArtworks.push({
                id: artwork.objectID,
                title: artwork.title,
                artist: artwork.artistDisplayName || 'Unknown Artist',
                date: artwork.objectDate || 'Unknown Date',
                medium: artwork.medium || 'Unknown Medium',
                dimensions: artwork.dimensions || '',
                image: artwork.primaryImage,
                thumbnailImage: artwork.primaryImageSmall || artwork.primaryImage,
                category: category,
                description: artwork.objectDescription || artwork.additionalImages ?
                    'This artwork is part of the Metropolitan Museum collection.' :
                    'No description available for this artwork.'
            });
        }
    } catch (error) {
        console.error(`Error fetching details for artwork ${objectId}:`, error);
    }
}

// Filter artworks by category
function filterArtworks(category) {
    currentCategory = category;
    currentPage = 1;

    // Apply both category and search filters
    const searchTerm = searchInput.value.toLowerCase();

    if (category === 'all') {
        displayedArtworks = allArtworks.filter(artwork =>
            artwork.title.toLowerCase().includes(searchTerm) ||
            artwork.artist.toLowerCase().includes(searchTerm)
        );
    } else {
        displayedArtworks = allArtworks.filter(artwork =>
            artwork.category === category &&
            (artwork.title.toLowerCase().includes(searchTerm) ||
                artwork.artist.toLowerCase().includes(searchTerm))
        );
    }

    // Reset the gallery and display the first page
    galleryContainer.innerHTML = '';
    displayArtworks();

    // Update the active filter button
    filterBtns.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Display artworks in the gallery
function displayArtworks() {
    const startIndex = (currentPage - 1) * artworksPerPage;
    const endIndex = Math.min(startIndex + artworksPerPage, displayedArtworks.length);

    // Get the slice of artworks to display
    const artworksToDisplay = displayedArtworks.slice(startIndex, endIndex);

    // Create and append artwork elements
    for (const artwork of artworksToDisplay) {
        const artworkElement = createArtworkElement(artwork);
        galleryContainer.appendChild(artworkElement);
    }

    // Show or hide the load more button
    if (endIndex >= displayedArtworks.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }

    // Display a message if no artworks are found
    if (displayedArtworks.length === 0) {
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.textContent = 'No artworks found for your search criteria.';
        galleryContainer.appendChild(noResultsMsg);
        loadMoreBtn.style.display = 'none';
    }
}

// Create an artwork element
function createArtworkElement(artwork) {
    const artworkElement = document.createElement('div');
    artworkElement.className = 'artwork-item';
    artworkElement.dataset.index = displayedArtworks.indexOf(artwork);

    artworkElement.innerHTML = `
        <img class="artwork-image" src="${artwork.thumbnailImage}" alt="${artwork.title}" loading="lazy">
        <div class="artwork-info">
            <h3>${artwork.title}</h3>
            <p>${artwork.artist}</p>
            <p>${artwork.date}</p>
        </div>
    `;

    // Add click event to open the modal
    artworkElement.addEventListener('click', () => {
        openArtworkModal(parseInt(artworkElement.dataset.index));
    });

    return artworkElement;
}

// Open the artwork modal
function openArtworkModal(index) {
    currentArtworkIndex = index;
    const artwork = displayedArtworks[index];

    // Reset zoom level
    zoomLevel = 1;
    modalImage.style.transform = `scale(${zoomLevel})`;

    // Set modal content
    modalImage.src = artwork.image;
    modalTitle.textContent = artwork.title;
    modalArtist.textContent = `Artist: ${artwork.artist}`;
    modalDate.textContent = `Date: ${artwork.date}`;
    modalMedium.textContent = `Medium: ${artwork.medium}`;
    modalDimensions.textContent = artwork.dimensions;
    modalDescription.textContent = artwork.description;

    // Show the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling of the body
}

// Close the artwork modal
function closeArtworkModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Navigate to previous artwork
function navigateToPrevArtwork() {
    let newIndex = currentArtworkIndex - 1;
    if (newIndex < 0) {
        newIndex = displayedArtworks.length - 1;
    }
    openArtworkModal(newIndex);
}

// Navigate to next artwork
function navigateToNextArtwork() {
    let newIndex = currentArtworkIndex + 1;
    if (newIndex >= displayedArtworks.length) {
        newIndex = 0;
    }
    openArtworkModal(newIndex);
}

// Zoom in on the modal image
function zoomIn() {
    if (zoomLevel < 3) {
        zoomLevel += 0.25;
        modalImage.style.transform = `scale(${zoomLevel})`;
    }
}

// Zoom out on the modal image
function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.25;
        modalImage.style.transform = `scale(${zoomLevel})`;
    }
}

// Load more artworks
function loadMoreArtworks() {
    currentPage++;
    displayArtworks();
}

// Show loading indicator
function showLoading() {
    loadingElement.style.display = 'flex';
    galleryContainer.style.display = 'none';
    loadMoreBtn.style.display = 'none';
}

// Hide loading indicator
function hideLoading() {
    loadingElement.style.display = 'none';
    galleryContainer.style.display = 'grid';
}

// Utility function: Get random items from an array
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Utility function: Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Event Listeners
window.addEventListener('DOMContentLoaded', initGallery);

loadMoreBtn.addEventListener('click', loadMoreArtworks);

searchBtn.addEventListener('click', () => {
    filterArtworks(currentCategory);
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filterArtworks(currentCategory);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterArtworks(btn.dataset.category);
    });
});

closeModal.addEventListener('click', closeArtworkModal);

zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);

prevArtworkBtn.addEventListener('click', navigateToPrevArtwork);
nextArtworkBtn.addEventListener('click', navigateToNextArtwork);

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeArtworkModal();
    }
});