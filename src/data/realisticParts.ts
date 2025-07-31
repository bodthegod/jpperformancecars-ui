import { Part, PartCategory } from "../types/types";

// Ferrari supercar part categories with subcategories
export const PART_CATEGORIES: Record<PartCategory, string[]> = {
  "Engine & Performance": [
    "Engine Blocks & Components",
    "Turbochargers & Superchargers",
    "Intake Systems",
    "Fuel Systems",
    "Engine Management",
    "Performance Upgrades",
  ],
  "Transmission & Drivetrain": [
    "F1 Gearboxes",
    "Clutch Systems",
    "Driveshafts",
    "Differentials",
    "Transmission Mounts",
  ],
  "Braking System": [
    "Carbon Ceramic Brakes",
    "Brake Calipers",
    "Brake Discs",
    "Brake Pads",
    "Brake Lines",
    "ABS Components",
  ],
  "Suspension & Handling": [
    "Magnetorheological Dampers",
    "Springs & Anti-Roll Bars",
    "Control Arms",
    "Bushings",
    "Steering Components",
  ],
  "Exhaust System": [
    "Headers & Manifolds",
    "Catalytic Converters",
    "Mufflers & Resonators",
    "Exhaust Tips",
    "Heat Shields",
  ],
  "Aerodynamics & Body": [
    "Front Splitters",
    "Rear Wings & Spoilers",
    "Side Skirts",
    "Diffusers",
    "Body Panels",
    "Bumpers",
  ],
  "Interior & Trim": [
    "Racing Seats",
    "Steering Wheels",
    "Dashboard Components",
    "Door Panels",
    "Trim Pieces",
    "Upholstery",
  ],
  "Electrical & Electronics": [
    "ECU & Control Units",
    "Wiring Harnesses",
    "Sensors",
    "Displays & Gauges",
    "Lighting Systems",
  ],
  "Cooling System": [
    "Radiators",
    "Intercoolers",
    "Oil Coolers",
    "Water Pumps",
    "Cooling Fans",
    "Hoses & Fittings",
  ],
  "Wheels & Tires": [
    "Forged Wheels",
    "Carbon Fiber Wheels",
    "Performance Tires",
    "Wheel Hardware",
    "TPMS Sensors",
  ],
  "Carbon Fiber Parts": [
    "Body Panels",
    "Interior Trim",
    "Aerodynamic Components",
    "Engine Covers",
    "Structural Components",
  ],
  "OEM Replacement Parts": [
    "Filters",
    "Belts & Hoses",
    "Gaskets & Seals",
    "Maintenance Items",
    "Wear Parts",
  ],
};

// Common symptoms users search for
export const COMMON_SYMPTOMS = [
  "Engine misfiring",
  "Rough idle",
  "Poor acceleration",
  "High fuel consumption",
  "Engine overheating",
  "Oil leak",
  "Coolant leak",
  "Grinding noise when braking",
  "Squealing brakes",
  "Vibration when braking",
  "Hard steering",
  "Clunking noise over bumps",
  "Car pulls to one side",
  "Smoke from exhaust",
  "Loss of power",
  "Engine won't start",
  "Battery keeps dying",
  "Headlights dim",
  "Check engine light",
];

// Ferrari models for reference
export const FERRARI_MODELS = [
  // Modern V8 Models
  "458 Italia",
  "458 Spider",
  "458 Speciale",
  "458 Speciale A",
  "488 GTB",
  "488 Spider",
  "488 Pista",
  "488 Pista Spider",
  "F8 Tributo",
  "F8 Spider",

  // Modern V12 Models
  "599 GTB",
  "599 GTO",
  "599 SA Aperta",
  "F12 Berlinetta",
  "F12tdf",
  "812 Superfast",
  "812 GTS",

  // Hybrid/Special Models
  "LaFerrari",
  "LaFerrari Aperta",
  "SF90 Stradale",
  "SF90 Spider",
  "296 GTB",
  "296 GTS",

  // GT Models
  "California",
  "California T",
  "Portofino",
  "Portofino M",
  "Roma",

  // Track/Limited Models
  "FXX",
  "FXX-K",
  "FXX-K Evo",
  "599XX",
  "599XX Evo",
  "FXXK Evo",
];

// Example Ferrari parts for your inventory
export const EXAMPLE_PARTS: Partial<Part>[] = [
  {
    name: "Carbon Fiber Engine Cover - 458 Italia",
    description:
      "Genuine Ferrari carbon fiber engine cover. Showcases the 4.5L V8 engine with authentic Prancing Horse branding. Excellent condition with clear coat protection.",
    category: "Carbon Fiber Parts",
    subcategory: "Engine Covers",
    brand: "Ferrari",
    price: 2850.0,
    condition: "used_excellent",
    availability: "in_stock",
    ferrari_part_number: "70003999",
    ferrari_models: ["458 Italia", "458 Spider"],
    year_range: "2009-2015",
    rarity_level: "rare",
    provenance: "Removed from low-mileage 458 Italia during service",
    fitment_notes: "Direct OEM replacement. Includes all mounting hardware.",
  },
  {
    name: "F1 Paddle Shifters - 488 Series",
    description:
      "Genuine Ferrari F1 paddle shifters in carbon fiber with red stitching. Perfect for upgrading or replacing worn paddles.",
    category: "Interior & Trim",
    subcategory: "Steering Wheels",
    brand: "Ferrari",
    price: 1250.0,
    condition: "new",
    availability: "in_stock",
    ferrari_part_number: "87654321",
    ferrari_models: ["488 GTB", "488 Spider", "488 Pista"],
    year_range: "2015-2020",
    rarity_level: "common",
    fitment_notes: "Requires steering wheel removal for installation",
  },
  {
    name: "Carbon Ceramic Brake Discs - Front Pair",
    description:
      "Genuine Ferrari carbon ceramic brake discs. 398mm diameter with floating design. Exceptional stopping power and fade resistance.",
    category: "Braking System",
    subcategory: "Carbon Ceramic Brakes",
    brand: "Ferrari",
    price: 4500.0,
    condition: "used_good",
    availability: "rare_find",
    ferrari_part_number: "298765432",
    ferrari_models: ["F12 Berlinetta", "F12tdf"],
    year_range: "2012-2017",
    rarity_level: "extremely_rare",
    provenance: "Sourced from track-prepared F12tdf",
    fitment_notes: "Requires matching brake pads and proper bedding procedure",
  },
  {
    name: "Novitec Exhaust System - Complete",
    description:
      "Novitec high-performance exhaust system with inconel construction and titanium tips. Dramatic sound enhancement with weight reduction.",
    category: "Exhaust System",
    subcategory: "Mufflers & Resonators",
    brand: "Novitec",
    price: 8500.0,
    condition: "used_excellent",
    availability: "in_stock",
    part_number: "F1 488 05",
    ferrari_models: ["488 GTB", "488 Spider"],
    year_range: "2015-2019",
    rarity_level: "rare",
    provenance: "Removed during return to stock configuration",
    fitment_notes:
      "Professional installation recommended. Includes all mounting hardware and gaskets.",
  },
];
