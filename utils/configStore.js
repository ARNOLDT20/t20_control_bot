// Config Store — Persistent JSON configuration
// Survives restarts via file system (works on Heroku w/ ephemeral filesystem for dev)
// For true persistence on Heroku, use env vars or a DB — file storage works for Replit

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'bot_config.json');
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default config
const DEFAULTS = {
    autopost: {
        mode: null,         // null = not configured yet | 'tech' | 'movies' | 'both'
        interval: 5,        // hours between posts
        enabled: true,
        techIndex: 0,       // rotating index for tech content
        movieIndex: 0,      // rotating index for movie content
        pollIndex: 0,       // rotating index for polls
        matterIndex: 0,     // rotating index for tech matters
        lastPosted: 0,      // timestamp of last post
        contentCycle: 0,    // for 'both' mode: 0=tech, 1=movie, 2=poll, 3=matter
        setupDone: false,
        setupChannel: null, // channel where setup was prompted
    },
    setupMessageId: null,   // message_id of the setup prompt (to delete after)
    version: 2,
};

let _config = null;

// Load config from file
const load = () => {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
            const parsed = JSON.parse(raw);
            // Merge with defaults to handle new keys
            _config = deepMerge(DEFAULTS, parsed);
        } else {
            _config = JSON.parse(JSON.stringify(DEFAULTS));
        }
    } catch (err) {
        console.warn('⚠️ Config load error, using defaults:', err.message);
        _config = JSON.parse(JSON.stringify(DEFAULTS));
    }
    return _config;
};

// Save config to file
const save = () => {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(_config, null, 2), 'utf8');
    } catch (err) {
        console.warn('⚠️ Config save error:', err.message);
    }
};

// Get a value (dot notation: 'autopost.mode')
const get = (key) => {
    if (!_config) load();
    const parts = key.split('.');
    let val = _config;
    for (const part of parts) {
        if (val === undefined || val === null) return undefined;
        val = val[part];
    }
    return val;
};

// Set a value (dot notation) and save
const set = (key, value) => {
    if (!_config) load();
    const parts = key.split('.');
    let obj = _config;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    save();
};

// Get entire config object
const getAll = () => {
    if (!_config) load();
    return _config;
};

// Reset to defaults
const reset = () => {
    _config = JSON.parse(JSON.stringify(DEFAULTS));
    save();
};

// Deep merge helper
const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

// Initialize on import
load();

module.exports = { get, set, getAll, load, save, reset };
