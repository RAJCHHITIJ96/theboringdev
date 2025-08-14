
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TrendingOpportunities from "./pages/TrendingOpportunities";
import AIAutomation from "./pages/AIAutomation";
import ToolComparisons from "./pages/ToolComparisons";
import AINews from "./pages/AINews";
import AIRealityCheck from "./pages/AIRealityCheck";
import BuilderStories from "./pages/BuilderStories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/temp-dashboard" element={<Dashboard />} />
          <Route path="/trending-opportunities" element={<TrendingOpportunities />} />
          <Route path="/ai-automation" element={<AIAutomation />} />
          <Route path="/tool-comparisons" element={<ToolComparisons />} />
          <Route path="/ai-news" element={<AINews />} />
          <Route path="/ai-reality-check" element={<AIRealityCheck />} />
          <Route path="/builder-stories" element={<BuilderStories />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
