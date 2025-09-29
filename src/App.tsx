
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { ArticleRenderer } from "@/components/ArticleRenderer";
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
import ShaperTester from "./pages/ShaperTester";
import DeploymentMonitor from "./pages/DeploymentMonitor";
import PublishedArticlesDashboard from "./pages/PublishedArticlesDashboard";

// Import all discovered pages
import CleanTestArticle2024 from "./pages/CleanTestArticle2024";
import SimpleTest from "./pages/SimpleTest";
import UltimateSystemTest from "./pages/UltimateSystemTest";
import FinalVerificationTest from "./pages/FinalVerificationTest";
import SampleContentForTesting from "./pages/SampleContentForTesting";
import GeneratedArticles from "./pages/GeneratedArticles";
import Auth from "./pages/Auth";
import BuildingAIWorkflows from "./pages/BuildingAIWorkflows";
import AiPoweredEmailAutomationStrategies from "./pages/AiPoweredEmailAutomationStrategies";
import TheAipoweredMeetingSummariesGuide from "./pages/TheAipoweredMeetingSummariesGuide";
import AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse from "./pages/AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse";

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
              <Route path="/shaper-tester" element={<ShaperTester />} />
              <Route path="/deployment-monitor" element={<DeploymentMonitor />} />
              <Route path="/published-articles" element={<PublishedArticlesDashboard />} />
              
              {/* Discovered Pages Routes */}
              <Route path="/cleantestarticle2024" element={<CleanTestArticle2024 />} />
              <Route path="/simpletest" element={<SimpleTest />} />
              <Route path="/ultimatesystemtest" element={<UltimateSystemTest />} />
              <Route path="/finalverificationtest" element={<FinalVerificationTest />} />
              <Route path="/samplecontentfortesting" element={<SampleContentForTesting />} />
              <Route path="/generatedarticles" element={<GeneratedArticles />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/buildingaiworkflows" element={<BuildingAIWorkflows />} />
              <Route path="/aipoweredemailautomationstrategies" element={<AiPoweredEmailAutomationStrategies />} />
              <Route path="/theaipoweredmeetingsummariesguide" element={<TheAipoweredMeetingSummariesGuide />} />
              <Route path="/aiagentsecuritythenononsenseguide" element={<AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse />} />
              <Route path="/aiagenttester" element={<AiCoderTester />} />
              <Route path="/aicodertest" element={<AiCoderTester />} />
              <Route path="/shapetester" element={<ShaperTester />} />
              <Route path="/deploymentmonitor" element={<DeploymentMonitor />} />
              
              {/* Dynamic Article Routes */}
              <Route path="/ai-automation/:slug" element={<ArticleRenderer category="ai-automation" />} />
              <Route path="/ai-news/:slug" element={<ArticleRenderer category="ai-news" />} />
              <Route path="/tool-comparisons/:slug" element={<ArticleRenderer category="tool-comparisons" />} />
              <Route path="/builder-stories/:slug" element={<ArticleRenderer category="builder-stories" />} />
              <Route path="/ai-reality-check/:slug" element={<ArticleRenderer category="ai-reality-check" />} />
              <Route path="/trending-opportunities/:slug" element={<ArticleRenderer category="trending-opportunities" />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="/AI Automation/:slug" element={<ArticleRenderer category="AI Automation" />} />
                <Route path="/Test/:slug" element={<ArticleRenderer category="Test" />} />
                <Route path="/General/:slug" element={<ArticleRenderer category="General" />} />
        <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
