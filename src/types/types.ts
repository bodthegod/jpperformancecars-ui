export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine?: string;
  transmission?: string;
  body_style?: string;
  created_at: string;
}

export interface VehicleMake {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
}

export interface VehicleModel {
  id: string;
  make_id: string;
  name: string;
  years: number[];
  created_at: string;
}

// OBD Diagnostic System Types
export interface OBDCode {
  id: string;
  code: string;
  description: string;
  severity: "low" | "medium" | "high";
  common_causes: string[];
  created_at: string;
}

export interface Solution {
  id: string;
  obd_code_id: string;
  description: string;
  steps: string[];
  difficulty: "easy" | "medium" | "hard";
  estimated_time: string;
  created_at: string;
}

export interface Part {
  id: string;
  name: string;
  slug: string; // SEO-friendly URL slug
  description: string;
  category: PartCategory;
  subcategory?: string;
  brand: string; // Ferrari, Novitec, Capristo, etc.
  price: number;
  quantity: number; // Stock quantity
  availability: "in_stock" | "out_of_stock" | "rare_find";
  condition?: "new" | "used_excellent" | "used_good" | "refurbished";
  images: string[];
  primary_image_index?: number;
  specifications: Record<string, any>;
  part_number?: string;
  ferrari_part_number?: string; // Official Ferrari part number
  alternative_numbers?: string[]; // Cross-reference numbers
  ferrari_models?: string[]; // Compatible Ferrari models
  year_range?: string; // e.g. "2015-2019"
  rarity_level?: "common" | "rare" | "extremely_rare" | "one_off";
  provenance?: string; // Source/history of the part
  fitment_notes?: string; // Special fitment requirements
  created_at: string;
}

// Ferrari supercar part categories
export type PartCategory =
  | "Engine & Performance"
  | "Transmission & Drivetrain"
  | "Braking System"
  | "Suspension & Handling"
  | "Exhaust System"
  | "Aerodynamics & Body"
  | "Interior & Trim"
  | "Electrical & Electronics"
  | "Cooling System"
  | "Wheels & Tires"
  | "Carbon Fiber Parts"
  | "OEM Replacement Parts";

export interface PartVehicle {
  id: string;
  part_id: string;
  vehicle_id: string;
  is_compatible: boolean;
  engine_codes?: string[]; // Specific engine variants
  chassis_codes?: string[]; // Chassis/body codes
  production_start?: string; // YYYY-MM format
  production_end?: string; // YYYY-MM format
  notes?: string;
  created_at: string;
}

export interface SolutionPart {
  solution_id: string;
  part_id: string;
}

export interface Order {
  id: string;
  email: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  shipping_info: ShippingInfo;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  part_id: string;
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface CartItem {
  part: Part;
  quantity: number;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  price_min?: number;
  price_max?: number;
  availability?: "in_stock" | "out_of_stock" | "rare_find";
  search?: string;
  vehicle_id?: string;
}

// Admin Types
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  created_at: string;
}

export interface AdminSession {
  id: string;
  admin_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: Vehicle;
        Insert: Omit<Vehicle, "id" | "created_at">;
        Update: Partial<Omit<Vehicle, "id" | "created_at">>;
      };
      vehicle_makes: {
        Row: VehicleMake;
        Insert: Omit<VehicleMake, "id" | "created_at">;
        Update: Partial<Omit<VehicleMake, "id" | "created_at">>;
      };
      vehicle_models: {
        Row: VehicleModel;
        Insert: Omit<VehicleModel, "id" | "created_at">;
        Update: Partial<Omit<VehicleModel, "id" | "created_at">>;
      };
      obd_codes: {
        Row: OBDCode;
        Insert: Omit<OBDCode, "id" | "created_at">;
        Update: Partial<Omit<OBDCode, "id" | "created_at">>;
      };
      solutions: {
        Row: Solution;
        Insert: Omit<Solution, "id" | "created_at">;
        Update: Partial<Omit<Solution, "id" | "created_at">>;
      };
      parts: {
        Row: Part;
        Insert: Omit<Part, "id" | "created_at">;
        Update: Partial<Omit<Part, "id" | "created_at">>;
      };
      part_vehicles: {
        Row: PartVehicle;
        Insert: Omit<PartVehicle, "id" | "created_at">;
        Update: Partial<Omit<PartVehicle, "id" | "created_at">>;
      };
      solution_parts: {
        Row: SolutionPart;
        Insert: SolutionPart;
        Update: Partial<SolutionPart>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
      admins: {
        Row: Admin;
        Insert: Omit<Admin, "id" | "created_at">;
        Update: Partial<Omit<Admin, "id" | "created_at">>;
      };
      admin_sessions: {
        Row: AdminSession;
        Insert: Omit<AdminSession, "id" | "created_at">;
        Update: Partial<Omit<AdminSession, "id" | "created_at">>;
      };
    };
  };
}
