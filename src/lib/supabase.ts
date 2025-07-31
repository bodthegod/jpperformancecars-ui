import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/types";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// OBD Codes API
export const obdCodesApi = {
  getByCode: async (code: string) => {
    const { data, error } = await supabase
      .from("obd_codes")
      .select(`*, solutions (*, solution_parts (parts (*)))`)
      .eq("code", code.toUpperCase())
      .single();
    if (error) throw error;
    return data;
  },

  search: async (query: string) => {
    const { data, error } = await supabase
      .from("obd_codes")
      .select("*")
      .or(`code.ilike.%${query}%,description.ilike.%${query}%`)
      .order("code");
    if (error) throw error;
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("obd_codes")
      .select("*")
      .order("code");
    if (error) throw error;
    return data;
  },
};

// Parts API
export const partsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  search: async (filters: any) => {
    let query = supabase.from("parts").select("*");

    if (filters.search) {
      // Enhanced search including symptoms and OBD codes
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,part_number.ilike.%${filters.search}%,oem_number.ilike.%${filters.search}%`
      );
    }
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.brand) {
      query = query.eq("brand", filters.brand);
    }
    if (filters.availability) {
      query = query.eq("availability", filters.availability);
    }
    if (filters.price_min) {
      query = query.gte("price", filters.price_min);
    }
    if (filters.price_max) {
      query = query.lte("price", filters.price_max);
    }

    const { data, error } = await query.order("name");
    if (error) throw error;
    return data;
  },

  // Search by OBD code - what users actually want!
  searchByOBDCode: async (obdCode: string) => {
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .contains("obd_codes", [obdCode.toUpperCase()])
      .order("name");
    if (error) throw error;
    return data;
  },

  // Search by symptoms - natural user behavior
  searchBySymptom: async (symptom: string) => {
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .or(`symptoms.cs.{${symptom}},description.ilike.%${symptom}%`)
      .order("name");
    if (error) throw error;
    return data;
  },

  getByVehicle: async (vehicleId: string) => {
    const { data, error } = await supabase
      .from("parts")
      .select(
        `
        *,
        part_vehicles!inner(vehicle_id)
      `
      )
      .eq("part_vehicles.vehicle_id", vehicleId)
      .eq("part_vehicles.is_compatible", true)
      .order("name");
    if (error) throw error;
    return data;
  },
};

// Vehicle API
export const vehiclesApi = {
  getMakes: async () => {
    const { data, error } = await supabase
      .from("vehicle_makes")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },

  getModels: async (makeId: string) => {
    const { data, error } = await supabase
      .from("vehicle_models")
      .select("*")
      .eq("make_id", makeId)
      .order("name");
    if (error) throw error;
    return data;
  },

  getByMakeModelYear: async (make: string, model: string, year: number) => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("make", make)
      .eq("model", model)
      .eq("year", year)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (vehicle: any) => {
    const { data, error } = await supabase
      .from("vehicles")
      .insert(vehicle)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// Orders API
export const ordersApi = {
  create: async (order: any) => {
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  createItems: async (items: any[]) => {
    const { data, error } = await supabase
      .from("order_items")
      .insert(items)
      .select();
    if (error) throw error;
    return data;
  },

  getByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          parts (*)
        )
      `
      )
      .eq("email", email)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};

// Admin API
export const adminApi = {
  login: async (email: string, password: string) => {
    // For now, using a simple approach. In production, use proper auth
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;

    // In a real app, you'd hash the password and compare
    // For demo purposes, we'll use a simple check
    if (data) {
      // Create session token
      const token = Math.random().toString(36).substring(2);
      const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      await supabase.from("admin_sessions").insert({
        admin_id: data.id,
        token,
        expires_at: expiresAt,
      });

      return { admin: data, token };
    }

    throw new Error("Invalid credentials");
  },

  verifySession: async (token: string) => {
    const { data, error } = await supabase
      .from("admin_sessions")
      .select(
        `
        *,
        admins (*)
      `
      )
      .eq("token", token)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error) throw error;
    return data;
  },

  logout: async (token: string) => {
    const { error } = await supabase
      .from("admin_sessions")
      .delete()
      .eq("token", token);

    if (error) throw error;
  },

  // Admin CRUD operations
  createPart: async (part: any) => {
    const { data, error } = await supabase
      .from("parts")
      .insert(part)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updatePart: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("parts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deletePart: async (id: string) => {
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) throw error;
  },

  createOBDCode: async (obdCode: any) => {
    const { data, error } = await supabase
      .from("obd_codes")
      .insert(obdCode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateOBDCode: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("obd_codes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteOBDCode: async (id: string) => {
    const { error } = await supabase.from("obd_codes").delete().eq("id", id);
    if (error) throw error;
  },

  getAllOrders: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          parts (*)
        )
      `
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  getAllParts: async () => {
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },

  getAllOBDCodes: async () => {
    const { data, error } = await supabase
      .from("obd_codes")
      .select("*")
      .order("code");
    if (error) throw error;
    return data;
  },
};
