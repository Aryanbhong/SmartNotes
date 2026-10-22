import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/DashBoard";
import NotesPage from "./pages/NotesPage";
import OCRPage from "./pages/OCRPage";
import SharedNoteView from "./pages/SharedNoteView";
import NotFound from "./pages/NotFound";

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/share/:shareId" element={<SharedNoteView />} />

      {/* Protected Student Workspace */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ocr"
        element={
          <ProtectedRoute>
            <OCRPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <Router>
            <AppRoutes />
            {/* Custom Modern Toasts — warm CSS variable colors */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  borderRadius: "1rem",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  padding: "0.75rem 1rem",
                },
                success: {
                  iconTheme: {
                    // heart/terracotta for success moments
                    primary: "var(--accent-heart)",
                    secondary: "var(--bg-surface)",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "var(--color-destructive)",
                    secondary: "var(--bg-surface)",
                  },
                },
              }}
            />
          </Router>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
