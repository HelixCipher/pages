import { useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Projects from "./pages/Projects";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Dynamic basename - uses build-time define from vite.config.ts
const getBasename = () => {
  // @ts-ignore - defined at build time by Vite
  if (typeof __REPO_NAME__ !== 'undefined') {
    return `/${__REPO_NAME__}`;
  }
  return "/pages"; // Default fallback
};

// Dynamic site title - uses build-time define from vite.config.ts
const getSiteTitle = () => {
  // @ts-ignore - defined at build time by Vite
  if (typeof __REPO_NAME__ !== 'undefined') {
    return __REPO_NAME__;
  }
  return "pages"; // Default fallback
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  // Set dynamic title
  useEffect(() => {
    document.title = getSiteTitle();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <BrowserRouter basename={getBasename()}>
          <div className={`flex min-h-screen flex-col transition-opacity duration-500 ${showSplash ? "opacity-0" : "opacity-100"}`}>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
