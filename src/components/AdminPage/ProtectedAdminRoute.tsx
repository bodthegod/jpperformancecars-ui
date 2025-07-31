import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { supabase } from "../../lib/supabase";
import AdminLogin from "./AdminLogin";
import SimpleAdminDashboard from "./SimpleAdminDashboard";

const ProtectedAdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Small delay to ensure Supabase client is initialized
    const initAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      checkAuthStatus();
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setAdminUser(null);
        localStorage.removeItem("admin_user");
      } else if (event === "SIGNED_IN" && session) {
        // User signed in, set up admin session directly
        const adminUser = {
          id: session.user.id,
          email: session.user.email!,
          admin_id: session.user.id,
          name: session.user.email!.split("@")[0],
          role: "admin",
        };

        setAdminUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check if user has active Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // User is authenticated, set up admin session
        const adminUser = {
          id: session.user.id,
          email: session.user.email!,
          admin_id: session.user.id,
          name: session.user.email!.split("@")[0],
          role: "admin",
        };

        setAdminUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
      } else {
        // No active session, user needs to login
        setIsAuthenticated(false);
        setAdminUser(null);
        localStorage.removeItem("admin_user");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setAdminUser(null);
      localStorage.removeItem("admin_user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    checkAuthStatus();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("admin_user");
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={40} sx={{ color: "#DC143C" }} />
        <Typography variant="body1" color="text.secondary">
          Verifying admin access...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <SimpleAdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
};

export default ProtectedAdminRoute;
