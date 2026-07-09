const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression for better page loading speeds (Core Web Vitals)
app.use(compression());

// Serve static assets from public/css, public/js, public/images
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static resources for 1 day
  index: false  // Disable automatic serving of index.html from static middleware
}));

// Route for dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: https://iptvus4k.store/sitemap.xml
`);
});

// Route for dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://iptvus4k.store/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://iptvus4k.store/subscription</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://iptvus4k.store/faq</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://iptvus4k.store/tutorial</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`);
});

// Clean URLs Routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/subscription', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'subscription.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/tutorial', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tutorial.html'));
});

// Handle 404 - Keep it premium and user-friendly
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running in production mode on port ${PORT}`);
});
