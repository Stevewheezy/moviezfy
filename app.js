// Your API Key and Access Token
const API_KEY = 'a828c2cfa3a0f8d72a0e1cc7eb5f0a4c';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhODI4YzJjZmEzYTBmOGQ3MmEwZTFjYzdlYjVmMGE0YyIsIm5iZiI6MTczNjk4MTkzMy45MzUwMDAyLCJzdWIiOiI2Nzg4M2RhZDFkNGM5MWY2YWM5NzYxNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ev7Aa5tp9A7sYmw0TdfikL2BJjHiTvK7VyG4zlUp68Y';

// DOM Elements
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const movieGrid = document.getElementById('movie-grid');
const selectedGenreElement = document.getElementById('selected-genre');
const movieDetailContainer = document.getElementById('movie-detail-container'); // For the details page

// API Endpoints
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch Random Movies on Page Load
document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;

  if (pathname.includes('details.html')) {
    // If on the details page, fetch and display movie details
    const movieId = new URLSearchParams(window.location.search).get('id');
    if (movieId) fetchMovieDetails(movieId);
  } else {
    // On the home page, fetch and display popular movies
    fetchRandomMovies();
  }
});

// Fetch and Display Popular Movies
async function fetchRandomMovies() {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`);
    const data = await response.json();

    if (data.results.length === 0) {
      movieGrid.innerHTML = '<p>No movies found. Try a different search.</p>';
      return;
    }

    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching random movies:', error);
    movieGrid.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
  }
}

// Fetch and Display Movies by Search Query
async function searchMovies() {
  const query = searchBar.value.trim();
  if (!query) return;

  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();

    if (data.results.length === 0) {
      movieGrid.innerHTML = '<p>No movies found. Try a different search.</p>';
      return;
    }

    displayMovies(data.results);
  } catch (error) {
    console.error('Error searching movies:', error);
    movieGrid.innerHTML = '<p>Failed to load search results. Please try again later.</p>';
  }
}

// Fetch and Display Movie Details
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    const movie = await response.json();

    if (!movie) {
      movieDetailContainer.innerHTML = '<p>Movie not found.</p>';
      return;
    }

    displayMovieDetails(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    movieDetailContainer.innerHTML = '<p>Failed to load movie details. Please try again later.</p>';
  }
}

// Display Movies on Home Page
function displayMovies(movies) {
  movieGrid.innerHTML = ''; // Clear previous content

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card', 'bg-gray-700', 'p-4', 'rounded-md', 'shadow-lg');
    movieCard.addEventListener('click', () => redirectToDetails(movie.id));

    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

    movieCard.innerHTML = `
      <img src="${posterPath}" alt="${movie.title}" class="w-full h-auto rounded-md mb-4">
      <h3 class="text-xl font-semibold text-white">${movie.title}</h3>
      <p class="text-sm text-gray-400">${movie.release_date || 'Unknown Release Date'}</p>
    `;

    movieGrid.appendChild(movieCard);
  });
}

// Display Movie Details
function displayMovieDetails(movie) {
  const { title, overview, release_date, runtime, genres, poster_path, vote_average, videos, credits } = movie;

  const posterPath = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  const genreList = genres.map(genre => genre.name).join(', ');
  const castList = credits.cast.slice(0, 5).map(cast => cast.name).join(', ');

  const trailer = videos.results.find(video => video.type === 'Trailer');
  const trailerLink = trailer ? `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" class="text-blue-500 underline">Watch Trailer</a>` : 'Trailer not available';

  movieDetailContainer.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <img src="${posterPath}" alt="${title}" class="w-64 rounded-md">
      <div>
        <h2 class="text-3xl font-bold text-white mb-4">${title}</h2>
        <p class="text-gray-400 mb-2"><strong>Release Date:</strong> ${release_date || 'Unknown'}</p>
        <p class="text-gray-400 mb-2"><strong>Runtime:</strong> ${runtime || 'Unknown'} mins</p>
        <p class="text-gray-400 mb-2"><strong>Genres:</strong> ${genreList || 'Unknown'}</p>
        <p class="text-gray-400 mb-4"><strong>Rating:</strong> ${vote_average || 'N/A'}</p>
        <p class="text-gray-200 mb-6">${overview || 'No description available.'}</p>
        <p class="text-gray-400 mb-4"><strong>Cast:</strong> ${castList || 'Unknown'}</p>
        <div>${trailerLink}</div>
      </div>
    </div>
  `;
}

// Redirect to Movie Details Page
function redirectToDetails(movieId) {
  window.location.href = `movie-details.html?id=${movieId}`;
}

// Event Listeners
searchBtn.addEventListener('click', searchMovies);
searchBar.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchMovies();
  }
});

// Function to Display Movies in Grid Format
function displayMovies(movies) {
    movieGrid.innerHTML = ''; // Clear any existing content
  
    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card', 'bg-gray-700', 'p-4', 'rounded-md', 'shadow-lg', 'cursor-pointer');
  
      const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  
      movieCard.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="${posterPath}" alt="${movie.title}" class="w-full h-auto rounded-md mb-4">
          <h3 class="text-xl font-semibold text-white">${movie.title}</h3>
          <p class="text-sm text-gray-400">${movie.release_date || 'N/A'}</p>
        </a>
      `;
  
      movieGrid.appendChild(movieCard);
    });
  }
  
  // Genre buttons handling
const genreBtns = document.querySelectorAll('.genre-btn');

genreBtns.forEach(button => {
  button.addEventListener('click', (event) => {
    const selectedGenre = event.target.textContent.trim();
    selectedGenreElement.textContent = `Selected Genre: ${selectedGenre}`;
    filterMoviesByGenre(selectedGenre);
  });
});

// Filter Movies by Genre
async function filterMoviesByGenre(genre) {
  try {
    const genreMap = {
      'Action': 28,
      'Comedy': 35,
      'Drama': 18,
      'Thriller': 53,
      'Romance': 10749,
      'Horror': 27
    };

    const genreId = genreMap[genre];
    if (!genreId) return;

    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await response.json();

    if (data.results.length === 0) {
      movieGrid.innerHTML = '<p>No movies found for this genre.</p>';
      return;
    }

    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    movieGrid.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
  }
}