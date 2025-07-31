# Parts System Setup Guide

## Overview

This document outlines the setup process for the OBD Diagnostic & Parts System built with React, TypeScript, MUI, Supabase, and Stripe.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration (for future use)
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# EmailJS Configuration (existing)
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_CONTACT_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 2. Supabase Database Setup

#### Create Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Vehicle Makes Table
CREATE TABLE vehicle_makes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Models Table
CREATE TABLE vehicle_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make_id UUID REFERENCES vehicle_makes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  years INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  engine VARCHAR(100),
  transmission VARCHAR(100),
  body_style VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(make, model, year)
);

-- OBD Codes Table
CREATE TABLE obd_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  severity VARCHAR(10) CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium',
  common_causes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solutions Table
CREATE TABLE solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obd_code_id UUID REFERENCES obd_codes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  steps TEXT[] NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  estimated_time VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parts Table (Enhanced for realistic automotive parts)
CREATE TABLE parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- Engine Management, Braking System, etc.
  subcategory VARCHAR(100), -- Catalytic Converters, Brake Pads, etc.
  brand VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  availability VARCHAR(20) CHECK (availability IN ('in_stock', 'out_of_stock', 'backorder')) DEFAULT 'in_stock',
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  part_number VARCHAR(100),
  oem_number VARCHAR(100),
  alternative_numbers TEXT[] DEFAULT '{}', -- Cross-reference part numbers
  symptoms TEXT[] DEFAULT '{}', -- What problems this part solves
  obd_codes TEXT[] DEFAULT '{}', -- Related OBD diagnostic codes
  fitment_notes TEXT, -- Special installation requirements
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part Vehicles Junction Table (Enhanced for precise fitment)
CREATE TABLE part_vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  is_compatible BOOLEAN DEFAULT true,
  engine_codes TEXT[] DEFAULT '{}', -- Specific engine variants (e.g. N54, N55)
  chassis_codes TEXT[] DEFAULT '{}', -- Chassis/body codes (e.g. E90, F30)
  production_start VARCHAR(7), -- YYYY-MM format
  production_end VARCHAR(7), -- YYYY-MM format
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(part_id, vehicle_id)
);

-- Solution Parts Junction Table
CREATE TABLE solution_parts (
  solution_id UUID REFERENCES solutions(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  PRIMARY KEY (solution_id, part_id)
);

-- Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')) DEFAULT 'pending',
  shipping_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Admins Table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_obd_codes_code ON obd_codes(code);
CREATE INDEX idx_parts_category ON parts(category);
CREATE INDEX idx_parts_brand ON parts(brand);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_part_vehicles_compatibility ON part_vehicles(part_id, vehicle_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
```

#### Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE obd_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to vehicle data
CREATE POLICY "Allow public read access to vehicle_makes" ON vehicle_makes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to vehicle_models" ON vehicle_models
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to vehicles" ON vehicles
  FOR SELECT USING (true);

-- Allow public read access to diagnostic data
CREATE POLICY "Allow public read access to obd_codes" ON obd_codes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to solutions" ON solutions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to parts" ON parts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to part_vehicles" ON part_vehicles
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to solution_parts" ON solution_parts
  FOR SELECT USING (true);

-- Allow public insert access to orders
CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access to order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow public insert access to vehicles
CREATE POLICY "Allow public insert access to vehicles" ON vehicles
  FOR INSERT WITH CHECK (true);
```

### 3. Sample Data

#### Insert Sample Vehicle Makes and Models

```sql
-- Insert vehicle makes
INSERT INTO vehicle_makes (name) VALUES
('Ferrari'),
('Lamborghini'),
('McLaren'),
('Porsche'),
('Aston Martin'),
('Bentley'),
('Rolls-Royce'),
('Bugatti');

-- Insert vehicle models for Ferrari
INSERT INTO vehicle_models (make_id, name, years) VALUES
((SELECT id FROM vehicle_makes WHERE name = 'Ferrari'), 'F430', ARRAY[2004, 2005, 2006, 2007, 2008, 2009]),
((SELECT id FROM vehicle_makes WHERE name = 'Ferrari'), '458 Italia', ARRAY[2009, 2010, 2011, 2012, 2013, 2014, 2015]),
((SELECT id FROM vehicle_makes WHERE name = 'Ferrari'), '488 GTB', ARRAY[2015, 2016, 2017, 2018, 2019]),
((SELECT id FROM vehicle_makes WHERE name = 'Ferrari'), 'F8 Tributo', ARRAY[2019, 2020, 2021, 2022, 2023]);

-- Insert vehicle models for Lamborghini
INSERT INTO vehicle_models (make_id, name, years) VALUES
((SELECT id FROM vehicle_makes WHERE name = 'Lamborghini'), 'Gallardo', ARRAY[2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013]),
((SELECT id FROM vehicle_makes WHERE name = 'Lamborghini'), 'Huracán', ARRAY[2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]),
((SELECT id FROM vehicle_makes WHERE name = 'Lamborghini'), 'Aventador', ARRAY[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]);

-- Insert vehicle models for Porsche
INSERT INTO vehicle_models (make_id, name, years) VALUES
((SELECT id FROM vehicle_makes WHERE name = 'Porsche'), '911', ARRAY[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]),
((SELECT id FROM vehicle_makes WHERE name = 'Porsche'), 'Cayman', ARRAY[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]),
((SELECT id FROM vehicle_makes WHERE name = 'Porsche'), 'Boxster', ARRAY[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]);
```

#### Insert Sample OBD Codes

```sql
INSERT INTO obd_codes (code, description, severity, common_causes) VALUES
('P0123', 'Throttle/Pedal Position Sensor/Switch A Circuit High Input', 'medium',
  ARRAY['Faulty throttle position sensor', 'Wiring issues', 'ECU malfunction']),
('P0300', 'Random/Multiple Cylinder Misfire Detected', 'high',
  ARRAY['Faulty spark plugs', 'Bad ignition coils', 'Fuel injector problems', 'Low fuel pressure']),
('P0171', 'System Too Lean (Bank 1)', 'medium',
  ARRAY['Vacuum leak', 'Faulty MAF sensor', 'Dirty fuel injectors', 'Weak fuel pump']);
```

#### Insert Sample Parts

```sql
INSERT INTO parts (name, description, category, brand, price, availability) VALUES
('Throttle Position Sensor', 'High-quality replacement TPS for various vehicle models', 'Sensors', 'Bosch', 45.99, 'in_stock'),
('Spark Plug Set', 'Iridium spark plugs for optimal performance', 'Ignition', 'NGK', 29.99, 'in_stock'),
('Mass Air Flow Sensor', 'Precision MAF sensor for accurate air flow measurement', 'Sensors', 'Denso', 89.99, 'in_stock'),
('Fuel Injector', 'Direct fit fuel injector for improved fuel delivery', 'Fuel System', 'Siemens', 125.00, 'in_stock');
```

#### Insert Sample Solutions

```sql
INSERT INTO solutions (obd_code_id, description, steps, difficulty, estimated_time) VALUES
((SELECT id FROM obd_codes WHERE code = 'P0123'),
 'Replace Throttle Position Sensor',
 ARRAY['Disconnect battery', 'Locate TPS on throttle body', 'Remove old sensor', 'Install new sensor', 'Reconnect battery', 'Test operation'],
 'easy', '30 minutes'),
((SELECT id FROM obd_codes WHERE code = 'P0300'),
 'Replace Spark Plugs and Ignition Coils',
 ARRAY['Remove ignition coils', 'Remove old spark plugs', 'Install new spark plugs', 'Install new ignition coils', 'Test engine'],
 'medium', '1 hour');
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Admin Setup

Create an admin user in your Supabase database:

```sql
-- Insert admin user (replace with your email)
INSERT INTO admins (email, name, role) VALUES
('your-email@example.com', 'Admin User', 'super_admin');
```

**Note**: The admin dashboard is accessible at `/admin`. For production, implement proper authentication and authorization.

### 6. Start Development Server

```bash
npm start
```

## 📁 Project Structure

```
src/
├── components/
│   ├── DiagnosticPage/
│   │   ├── DiagnosticLookup.tsx    # Main diagnostic search page
│   │   └── OBDCodePage.tsx         # Individual OBD code page
│   ├── Cart/
│   │   └── CartDrawer.tsx          # Shopping cart drawer
│   └── CheckoutPage/
│       └── CheckoutPage.tsx        # Checkout process
├── contexts/
│   └── CartContext.tsx             # Shopping cart state management
├── lib/
│   └── supabase.ts                 # Supabase client and API functions
└── types/
    └── types.ts                    # TypeScript interfaces
```

## 🔧 Key Features

### ✅ Implemented

- OBD code search and lookup
- Individual diagnostic code pages with SEO optimization
- Shopping cart functionality
- Parts catalog integration
- Responsive design with MUI components
- TypeScript type safety

### 🚧 Future Enhancements

- Stripe payment integration
- User authentication
- Order management system
- Advanced parts filtering
- Vehicle compatibility checking
- Admin panel for content management

## 🎯 SEO Strategy

The system is optimized for OBD diagnostic code searches:

- Individual pages for each OBD code (`/diagnostic/p0123`)
- Structured data markup
- Meta tags with code-specific information
- Internal linking between related codes and parts

## 💰 Monetization

- Free diagnostic information drives traffic
- Parts sales generate revenue
- Potential for affiliate partnerships
- Premium diagnostic tools (future)

## 🔒 Security

- Supabase RLS policies protect data
- Client-side cart (no sensitive data stored)
- Environment variables for API keys
- Input validation and sanitization

## 📱 Mobile Optimization

- Responsive design with MUI breakpoints
- Touch-friendly interface
- Mobile-first cart experience
- Optimized for on-the-go diagnostic lookups

## 🚀 Deployment

The system can be deployed to:

- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

Remember to set up environment variables in your hosting platform.
