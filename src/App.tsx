
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ZuhuDashboard from "./pages/ZuhuDashboard";
import TrendingOpportunities from "./pages/TrendingOpportunities";
import AIAutomation from "./pages/AIAutomation";
import ToolComparisons from "./pages/ToolComparisons";
import AINews from "./pages/AINews";
import AIRealityCheck from "./pages/AIRealityCheck";
import AIUGC from "./pages/AIUGC";
import BuilderStories from "./pages/BuilderStories";
import NotFound from "./pages/NotFound";
import MCPConverter from "./pages/MCPConverter";
import AiCoderTester from "./pages/AiCoderTester";
import AICoderAgent from "./pages/AICoderAgent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <NavBar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/temp-dashboard" element={<Dashboard />} />
              <Route path="/zuhu" element={<ZuhuDashboard />} />
              <Route path="/trending-opportunities" element={<TrendingOpportunities />} />
              <Route path="/ai-automation" element={<AIAutomation />} />
              <Route path="/tool-comparisons" element={<ToolComparisons />} />
              <Route path="/ai-news" element={<AINews />} />
              <Route path="/ai-reality-check" element={<AIRealityCheck />} />
              <Route path="/ai-ugc" element={<AIUGC />} />
              <Route path="/builder-stories" element={<BuilderStories />} />
              <Route path="/mcp-converter" element={<MCPConverter />} />
              <Route path="/ai-coder-tester" element={<AiCoderTester />} />
              <Route path="/ai-coder-agent" element={<AICoderAgent />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
