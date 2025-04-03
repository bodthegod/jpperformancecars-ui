// src/components/SEO.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title = "Supercar Service & Repairs Specialist | JP Performance Cars",
  description = "Specialist supercar service and repairs in Burntwood, Staffordshire. Expert maintenance for Ferrari, Lamborghini, McLaren, Porsche and luxury vehicles. Factory-trained technicians with 20+ years experience.",
  keywords = "supercar service, Ferrari service Staffordshire, Lamborghini repairs, McLaren specialist, Porsche maintenance Burntwood, luxury car repairs, supercar specialist Midlands",
  ogImage = "https://www.jpperformancecars.co.uk/og-image.jpg",
  canonical = "https://www.jpperformancecars.co.uk",
  structuredData,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical link */}
      <link rel="canonical" href={canonical} />

      {/* Schema.org structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
