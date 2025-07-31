// This script will update the sitemap.xml file with blog post URLs
const fs = require("fs");
const path = require("path");
const { blogPostsData } = require("./blogPostsData");

// Function to generate sitemap XML content
function generateSitemap() {
  // Base URL of your website
  const baseUrl = "https://www.jpperformancecars.co.uk";

  // Start the XML content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add the main pages
  const mainPages = [
    {
      url: "",
      lastmod: new Date().toISOString().split("T")[0],
      priority: "1.0",
    },
    {
      url: "/services",
      lastmod: new Date().toISOString().split("T")[0],
      priority: "0.9",
    },
    {
      url: "/about/story",
      lastmod: new Date().toISOString().split("T")[0],
      priority: "0.8",
    },
    {
      url: "/about/team",
      lastmod: new Date().toISOString().split("T")[0],
      priority: "0.8",
    },
    {
      url: "/contact",
      lastmod: new Date().toISOString().split("T")[0],
      priority: "0.9",
    },
    {
      url: "/blog",
      lastmod: new Date().toISOString().split("T")[0],
      priority: "0.8",
    },
  ];

  // Add each main page to the sitemap
  mainPages.forEach((page) => {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  // Add blog posts to the sitemap
  blogPostsData.forEach((post) => {
    const postDate = new Date(post.datePublished);
    const formattedDate = postDate.toISOString().split("T")[0];

    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/blog/${post.id}</loc>\n`;
    xml += `    <lastmod>${formattedDate}</lastmod>\n`;
    xml += "    <priority>0.7</priority>\n";
    xml += "  </url>\n";
  });

  // Close the XML
  xml += "</urlset>";

  return xml;
}

// Write the sitemap to the public directory
function writeSitemap() {
  const sitemap = generateSitemap();
  const filePath = path.join(__dirname, "../../../public/sitemap.xml");

  fs.writeFileSync(filePath, sitemap, "utf8");
  console.log("Sitemap has been updated with blog posts!");
}

// Execute the function
writeSitemap();
