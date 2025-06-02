
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Schools from "./pages/Schools";
import Pedagogy from "./pages/Pedagogy";
import Staff from "./pages/Staff";
import Finance from "./pages/Finance";
import Parents from "./pages/Parents";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<><Navigation /><Index /></>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="/schools" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Schools />
                  </ProtectedRoute>
                } />
                <Route path="/pedagogy" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Pedagogy />
                  </ProtectedRoute>
                } />
                <Route path="/staff" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Staff />
                  </ProtectedRoute>
                } />
                <Route path="/finance" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Finance />
                  </ProtectedRoute>
                } />
                <Route path="/parents" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Parents />
                  </ProtectedRoute>
                } />
                <Route path="/communication" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Communication />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
