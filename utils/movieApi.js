// Movie API Utility — BlazeMovieHub (GiftedTech API)
const axios = require('axios');

const BASE_URL = 'https://blazemoviehub.t20tech.site/api';
const API_KEY = 'gifted_movieapi_789fbud2389889dg8962e098g23d6';
const SITE_URL = 'https://blazemoviehub.t20tech.site';

const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'T20-Wolf-Bot/1.0'
};

const request = async (path) => {
    const res = await axios.get(`${BASE_URL}${path}`, { headers, timeout: 12000 });
    // If response is HTML instead of JSON, API is down/changed
    if (typeof res.data === 'string' && res.data.includes('<!doctype')) {
        throw new Error('API returned HTML — endpoint unavailable');
    }
    if (res.data && res.data.success) return res.data.results;
    throw new Error(res.data?.message || 'API error');
};

// Search movies by query
const searchMovies = async (query, page = 1) => {
    const results = await request(`/search/${encodeURIComponent(query)}?page=${page}`);
    return results || {};
};

// Get trending movies
const getTrending = async () => {
    const results = await request('/trending');
    return results?.subjectList || [];
};

// Get movie info by subjectId
const getMovieInfo = async (subjectId) => {
    const results = await request(`/info/${subjectId}`);
    return results || {};
};

// Get watch URL for a movie on the site
const getWatchUrl = (detailPath) => `${SITE_URL}/movie/${detailPath}`;

// Get direct download page URL with quality filter
const getDownloadUrl = (detailPath, resolution) => {
    return `${SITE_URL}/movie/${detailPath}?quality=${resolution}`;
};

// Get available resolutions from movie info
const getResolutions = (movieInfo) => {
    try {
        const seasons = movieInfo?.resource?.seasons || [];
        const resSet = new Set();
        seasons.forEach(s => {
            (s.resolutions || []).forEach(r => resSet.add(r.resolution));
        });
        return Array.from(resSet).sort((a, b) => b - a);
    } catch (_) {
        return [];
    }
};

// Format resolution label
const resolutionLabel = (res) => {
    const map = {
        2160: '📀 4K Ultra HD',
        1080: '🎬 Full HD 1080p',
        720: '📺 HD 720p',
        480: '📱 SD 480p',
        360: '💾 Low 360p',
    };
    return map[res] || `📦 ${res}p`;
};

// Format movie type
const subjectTypeLabel = (type) => {
    const map = { 1: '🎬 Movie', 2: '📺 TV Series', 3: '🎞️ Anime' };
    return map[type] || '🎬 Movie';
};

module.exports = {
    searchMovies,
    getTrending,
    getMovieInfo,
    getWatchUrl,
    getDownloadUrl,
    getResolutions,
    resolutionLabel,
    subjectTypeLabel,
    SITE_URL,
};
