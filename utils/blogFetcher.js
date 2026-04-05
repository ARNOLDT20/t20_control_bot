// Blog Fetcher - Fetches posts from T20 Tech blogs
const axios = require('axios');
const cheerio = require('cheerio');

class BlogFetcher {
    constructor() {
        this.blogs = [];
        this.lastFetchTime = 0;
        this.CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

        this.sources = [
            {
                name: 'T20 Tech Blog',
                url: 'https://blog.t20tech.site',
                selector: 'article',
                titleSelector: 'h2, h3',
                excerptSelector: 'p',
            },
            {
                name: 'T20 Tech Main Blog',
                url: 'https://www.t20tech.site/blog%20page%20home.HTML#blogs',
                selector: '.blog-post, article',
                titleSelector: 'h2, h3, .post-title',
                excerptSelector: 'p, .post-excerpt',
            },
        ];
    }

    // Fetch blogs from all sources
    async fetchAllBlogs(forceRefresh = false) {
        const now = Date.now();

        // Return cached blogs if available and not expired
        if (this.blogs.length > 0 && !forceRefresh && now - this.lastFetchTime < this.CACHE_DURATION) {
            console.log(`📚 Using cached blog posts (${this.blogs.length} posts)`);
            return this.blogs;
        }

        console.log('📡 Fetching fresh blog posts...');
        this.blogs = [];

        for (const source of this.sources) {
            try {
                const posts = await this.fetchFromSource(source);
                this.blogs.push(...posts);
                console.log(`✅ Fetched ${posts.length} posts from ${source.name}`);
            } catch (err) {
                console.error(`❌ Failed to fetch from ${source.name}:`, err.message);
            }
        }

        this.lastFetchTime = now;
        console.log(`📚 Total blogs available: ${this.blogs.length}`);
        return this.blogs;
    }

    // Fetch from a single source
    async fetchFromSource(source) {
        const posts = [];

        try {
            const response = await axios.get(source.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000,
            });

            const $ = cheerio.load(response.data);
            const articles = $(source.selector).slice(0, 5); // Get first 5 posts

            articles.each((index, element) => {
                try {
                    const title = $(element).find(source.titleSelector).first().text().trim();
                    const excerpt = $(element).find(source.excerptSelector).first().text().trim();
                    const link = $(element).find('a').first().attr('href') || source.url;

                    if (title && excerpt) {
                        posts.push({
                            title: title.substring(0, 100),
                            excerpt: excerpt.substring(0, 200),
                            link: this.normalizeUrl(link, source.url),
                            source: source.name,
                            fetchedAt: new Date(),
                        });
                    }
                } catch (e) {
                    // Skip malformed posts
                }
            });
        } catch (err) {
            console.error(`Error fetching from ${source.url}:`, err.message);
        }

        return posts;
    }

    // Normalize URLs
    normalizeUrl(url, baseUrl) {
        if (!url) return baseUrl;
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return new URL(url, baseUrl).href;
        return new URL(url, baseUrl).href;
    }

    // Get all blog posts
    getBlogs() {
        return this.blogs;
    }

    // Get a random blog post
    getRandomBlog() {
        if (this.blogs.length === 0) {
            return null;
        }
        return this.blogs[Math.floor(Math.random() * this.blogs.length)];
    }

    // Get multiple random blog posts
    getRandomBlogs(count = 3) {
        if (this.blogs.length === 0) {
            return [];
        }

        const shuffled = [...this.blogs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // get a blog by index
    getBlogByIndex(index) {
        if (index < 0 || index >= this.blogs.length) {
            return null;
        }
        return this.blogs[index];
    }
}

module.exports = new BlogFetcher();
