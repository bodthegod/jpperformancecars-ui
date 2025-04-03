// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");

// Define your routes and their metadata
const routes = [
  {
    path: "/",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/contact",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/about/story",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/about/team",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/services",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "0.9",
  },
];

// Base URL of your website
const baseUrl = "https://www.jpperformancecars.co.uk";

// Generate sitemap content
const generateSitemap = () => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach((route) => {
    sitemap += "  <url>\n";
    sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
    sitemap += `    <lastmod>${route.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += "  </url>\n";
  });

  sitemap += "</urlset>";
  return sitemap;
};

// Generate video sitemap content
const generateVideoSitemap = () => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  sitemap +=
    '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';
  sitemap += "  <url>\n";
  sitemap += `    <loc>${baseUrl}/</loc>\n`;
  sitemap += "    <video:video>\n";
  sitemap += `      <video:thumbnail_loc>${baseUrl}/video-thumbnail.jpg</video:thumbnail_loc>\n`;
  sitemap +=
    "      <video:title>JP Performance Cars Supercar Servicing</video:title>\n";
  sitemap +=
    "      <video:description>Showcase of luxury and supercar servicing at JP Performance Cars</video:description>\n";
  sitemap += `      <video:content_loc>${baseUrl}/static/media/HeroVideo.mp4</video:content_loc>\n`;
  sitemap += "      <video:duration>60</video:duration>\n";
  sitemap += `      <video:publication_date>${new Date().toISOString()}</video:publication_date>\n`;
  sitemap += "      <video:family_friendly>yes</video:family_friendly>\n";
  sitemap += "      <video:live>no</video:live>\n";
  sitemap += "    </video:video>\n";
  sitemap += "  </url>\n";
  sitemap += "</urlset>";
  return sitemap;
};

// Write sitemaps to files
const writeSitemaps = () => {
  // Create sitemap.xml
  fs.writeFileSync(
    path.resolve(__dirname, "../public/sitemap.xml"),
    generateSitemap()
  );
  console.log("Sitemap generated at: public/sitemap.xml");

  // Create video-sitemap.xml
  fs.writeFileSync(
    path.resolve(__dirname, "../public/video-sitemap.xml"),
    generateVideoSitemap()
  );
  console.log("Video sitemap generated at: public/video-sitemap.xml");
};

// Execute
writeSitemaps();
