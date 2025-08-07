import { Part, PartCategory } from "../types/types";

// General automotive part categories
export const GENERAL_PART_CATEGORIES: Record<PartCategory, string[]> = {
  "Engine & Performance": [
    "Engine Components",
    "Turbochargers & Superchargers",
    "Air Intake Systems",
    "Fuel Systems",
    "Engine Management",
    "Performance Upgrades",
  ],
  "Transmission & Drivetrain": [
    "Manual Transmissions",
    "Automatic Transmissions",
    "Clutch Components",
    "Driveshafts & CV Joints",
    "Differentials",
    "Transfer Cases",
  ],
  "Braking System": [
    "Brake Pads",
    "Brake Discs & Rotors",
    "Brake Calipers",
    "Brake Lines & Hoses",
    "Master Cylinders",
    "ABS Components",
  ],
  "Suspension & Handling": [
    "Shock Absorbers",
    "Springs & Coilovers",
    "Control Arms",
    "Bushings & Mounts",
    "Sway Bars",
    "Steering Components",
  ],
  "Exhaust System": [
    "Exhaust Manifolds",
    "Catalytic Converters",
    "Mufflers & Silencers",
    "Exhaust Pipes",
    "Headers",
    "Performance Exhausts",
  ],
  "Aerodynamics & Body": [
    "Front Bumpers",
    "Rear Bumpers",
    "Side Skirts",
    "Spoilers & Wings",
    "Body Panels",
    "Aerodynamic Kits",
  ],
  "Interior & Trim": [
    "Seat Components",
    "Dashboard Parts",
    "Door Panels",
    "Trim Pieces",
    "Floor Mats",
    "Interior Accessories",
  ],
  "Electrical & Electronics": [
    "ECU & Engine Management",
    "Wiring Harnesses",
    "Sensors",
    "Lighting",
    "Audio Systems",
    "Navigation & Electronics",
  ],
  "Cooling System": [
    "Radiators",
    "Water Pumps",
    "Thermostats",
    "Cooling Fans",
    "Hoses & Clamps",
    "Intercoolers",
  ],
  "Wheels & Tires": [
    "Alloy Wheels",
    "Steel Wheels",
    "Tires",
    "Wheel Accessories",
    "TPMS Sensors",
    "Wheel Bolts & Nuts",
  ],
  "Carbon Fiber Parts": [
    "Carbon Fiber Body Parts",
    "Carbon Fiber Interior",
    "Carbon Fiber Engine Components",
    "Carbon Fiber Aerodynamics",
  ],
  "OEM Replacement Parts": [
    "OEM Engine Parts",
    "OEM Body Parts",
    "OEM Interior Parts",
    "OEM Electrical Parts",
    "OEM Suspension Parts",
    "OEM Brake Parts",
  ],
};

// Example general automotive parts
export const EXAMPLE_GENERAL_PARTS: Partial<Part>[] = [
  {
    name: "High Performance Brake Pads - Front",
    description:
      "Premium ceramic brake pads offering superior stopping power and reduced brake dust. Designed for high-performance applications with excellent heat dissipation.",
    category: "Braking System",
    subcategory: "Brake Pads",
    brand: "Brembo",
    price: 189.99,
    availability: "in_stock",
    part_number: "P50084",
    fitment_notes:
      "Direct OEM replacement. Professional installation recommended.",
  },
  {
    name: "Cold Air Intake System",
    description:
      "Complete cold air intake system with high-flow air filter. Increases horsepower and improves throttle response. Easy bolt-on installation.",
    category: "Engine & Performance",
    subcategory: "Air Intake Systems",
    brand: "K&N",
    price: 299.99,
    availability: "in_stock",
    part_number: "57-3510",
    fitment_notes: "No modifications required. Includes all mounting hardware.",
  },
  {
    name: "Performance Exhaust System",
    description:
      "Cat-back exhaust system with dual stainless steel tips. Improves sound and performance while maintaining emissions compliance.",
    category: "Exhaust System",
    subcategory: "Performance Exhausts",
    brand: "Borla",
    price: 899.99,
    availability: "in_stock",
    part_number: "140659",
    fitment_notes:
      "Professional installation recommended. Includes gaskets and hardware.",
  },
  {
    name: "Carbon Fiber Front Splitter",
    description:
      "Lightweight carbon fiber front splitter for improved aerodynamics and aggressive styling. Pre-preg carbon fiber construction with clear coat finish.",
    category: "Carbon Fiber Parts",
    subcategory: "Carbon Fiber Aerodynamics",
    brand: "Seibon",
    price: 1299.99,
    availability: "rare_find",
    part_number: "FL17SUBIWRX-FS",
    fitment_notes: "Drilling required for installation. Hardware not included.",
  },
  {
    name: "Coilover Suspension Kit",
    description:
      "Adjustable coilover suspension system with 32-way damping adjustment. Lowering range 1.2-2.8 inches. Perfect for street and track use.",
    category: "Suspension & Handling",
    subcategory: "Springs & Coilovers",
    brand: "KW",
    price: 2199.99,
    availability: "in_stock",
    part_number: "15220020",
    fitment_notes: "Professional installation and alignment required.",
  },
];
