// Enhanced sitemap generator including OBD diagnostic codes for better SEO
const fs = require("fs");
const path = require("path");

// You'll need to import your actual OBD codes data from your database
// For now, this is a template showing the structure
const sampleOBDCodes = [
  "P0171",
  "P0172",
  "P0300",
  "P0301",
  "P0302",
  "P0303",
  "P0304",
  "P0305",
  "P0306",
  "P0307",
  "P0308",
  "P0420",
  "P0430",
  "P0442",
  "P0455",
  "P0456",
  "P0457",
  "P0458",
  "P0459",
  "P0460",
  "P0461",
  "P0462",
  "P0463",
  "P0464",
  "P0465",
  "P0466",
  "P0467",
  "P0468",
  "P0469",
  "P0470",
  "P0471",
  "P0472",
  "P0473",
  "P0101",
  "P0102",
  "P0103",
  "P0104",
  "P0105",
  "P0106",
  "P0107",
  "P0108",
  "P0109",
  "P0110",
  "P0111",
  "P0112",
  "P0113",
  "P0114",
  "P0115",
  "P0116",
  "P0117",
  "P0118",
  "P0119",
  "P0120",
  "P0121",
  "P0122",
  "P0123",
  "P0124",
  "P0125",
  "P0126",
  "P0127",
  "P0128",
  "P0129",
  "P0130",
  "P0131",
  "P0132",
  "P0133",
  "P0134",
  "P0135",
  "P0136",
  "P0137",
  "P0138",
  "P0139",
  "P0140",
  "P0141",
  "P0142",
  "P0143",
  "P0144",
  "P0145",
  "P0146",
  "P0147",
  "P0148",
  "P0149",
  "P0150",
  "P0151",
  "P0152",
  "P0153",
  "P0154",
  "P0155",
];

// Function to generate comprehensive sitemap XML content
function generateEnhancedSitemap() {
  const baseUrl = "https://www.jpperformancecars.co.uk";

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Main pages with optimized priorities for SEO
  const mainPages = [
    {
      url: "",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      url: "/services",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      url: "/diagnostic",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly", // High update frequency for diagnostic page
      priority: "0.95", // High priority for main diagnostic entry point
    },
    {
      url: "/contact",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      url: "/about/story",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      url: "/about/team",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      url: "/blog",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.8",
    },
  ];

  // Add main pages to sitemap
  mainPages.forEach((page) => {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  // Add OBD diagnostic code pages - these are CRITICAL for SEO traffic
  sampleOBDCodes.forEach((code) => {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/diagnostic/${code.toLowerCase()}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n"; // Monthly updates for OBD pages
    xml += "    <priority>0.85</priority>\n"; // High priority - these are money pages
    xml += "  </url>\n";
  });

  // Add blog posts (you can import from blogPostsData if needed)
  // This section would include your existing blog post logic

  xml += "</urlset>";
  return xml;
}

// Write the enhanced sitemap
function writeEnhancedSitemap() {
  const sitemap = generateEnhancedSitemap();
  const filePath = path.join(__dirname, "../public/sitemap.xml");

  fs.writeFileSync(filePath, sitemap, "utf8");
  console.log("✅ Enhanced sitemap generated with OBD diagnostic codes!");
  console.log(
    `📈 Added ${sampleOBDCodes.length} OBD code pages for better SEO`
  );
}

// Function to generate a specialized OBD codes sitemap (for large sites)
function generateOBDSitemap() {
  const baseUrl = "https://www.jpperformancecars.co.uk";

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sampleOBDCodes.forEach((code) => {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/diagnostic/${code.toLowerCase()}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.85</priority>\n";
    xml += "  </url>\n";
  });

  xml += "</urlset>";
  return xml;
}

// Write separate OBD sitemap (useful for large OBD databases)
function writeOBDSitemap() {
  const sitemap = generateOBDSitemap();
  const filePath = path.join(__dirname, "../public/obd-sitemap.xml");

  fs.writeFileSync(filePath, sitemap, "utf8");
  console.log("✅ OBD diagnostic codes sitemap generated!");
}

// Export functions for use in build scripts
module.exports = {
  generateEnhancedSitemap,
  writeEnhancedSitemap,
  generateOBDSitemap,
  writeOBDSitemap,
  sampleOBDCodes,
};

// Execute if run directly
if (require.main === module) {
  writeEnhancedSitemap();
  writeOBDSitemap();
}
