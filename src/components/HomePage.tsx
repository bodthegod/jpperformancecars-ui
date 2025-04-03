import React from "react";
import HeroSection from "./HeroSection";
import ServiceForm from "./ServiceForm";
import SEO from "./SEO";

export const HomePage: React.FC = () => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "JP Performance Cars",
    image: "https://www.jpperformancecars.co.uk/og-image.jpg",
    description:
      "Specialist supercar service and repairs in Burntwood, Staffordshire. Expert maintenance for Ferrari, Lamborghini, McLaren, Porsche and luxury vehicles.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 10, Metal Products Business Park, Prospect Road",
      addressLocality: "Burntwood",
      addressRegion: "Staffordshire",
      postalCode: "WS7 0AE",
      addressCountry: "UK",
    },
    priceRange: "££",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "16:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "00:00",
        closes: "00:00",
      },
    ],
  };

  return (
    <>
      <SEO
        title="Supercar Service & Repairs Specialist | JP Performance Cars"
        description="Specialist supercar service and repairs in Burntwood, Staffordshire. Expert maintenance for Ferrari, Lamborghini, McLaren, Porsche and luxury vehicles."
        canonical="https://www.jpperformancecars.co.uk/"
        structuredData={businessSchema}
      />
      <HeroSection />
      <ServiceForm />
    </>
  );
};
