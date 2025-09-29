
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
import PublishedArticlesDashboardSimple from "./pages/PublishedArticlesDashboardSimple";

// Dynamic component loader to avoid import conflicts
import { lazy, Suspense } from "react";

// Dynamic component loader function
const createDynamicComponent = (componentName: string) => {
  return lazy(() => 
    import(`./pages/${componentName}.tsx`)
      .then(module => ({ default: module.default }))
      .catch(() => {
        console.error(`Failed to load component: ${componentName}`);
        return import('./pages/NotFound.tsx');
      })
  );
};

// Create dynamic components
const CleanTestArticle2024 = createDynamicComponent('CleanTestArticle2024');
const SimpleTest = createDynamicComponent('SimpleTest');
const SimpleTestDebug = createDynamicComponent('SimpleTestDebug');
const UltimateSystemTest = createDynamicComponent('UltimateSystemTest');
const FinalVerificationTest = createDynamicComponent('FinalVerificationTest');
const SampleContentForTesting = createDynamicComponent('SampleContentForTesting');
const GeneratedArticles = createDynamicComponent('GeneratedArticles');
const Auth = createDynamicComponent('Auth');
const BuildingAIWorkflows = createDynamicComponent('BuildingAIWorkflows');
const AiPoweredEmailAutomationStrategies = createDynamicComponent('AiPoweredEmailAutomationStrategies');
const TheAipoweredMeetingSummariesGuide = createDynamicComponent('TheAipoweredMeetingSummariesGuide');
const AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse = createDynamicComponent('AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse');

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
              
              {/* Discovered Pages Routes - All Dynamic */}
              <Route path="/cleantestarticle2024" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <CleanTestArticle2024 />
                </Suspense>
              } />
              <Route path="/simpletest" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <SimpleTest />
                </Suspense>
              } />
              <Route path="/ultimatesystemtest" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <UltimateSystemTest />
                </Suspense>
              } />
              <Route path="/finalverificationtest" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <FinalVerificationTest />
                </Suspense>
              } />
              <Route path="/samplecontentfortesting" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <SampleContentForTesting />
                </Suspense>
              } />
              <Route path="/generatedarticles" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <GeneratedArticles />
                </Suspense>
              } />
              <Route path="/auth" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <Auth />
                </Suspense>
              } />
              <Route path="/buildingaiworkflows" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <BuildingAIWorkflows />
                </Suspense>
              } />
              <Route path="/aipoweredemailautomationstrategies" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <AiPoweredEmailAutomationStrategies />
                </Suspense>
              } />
              <Route path="/theaipoweredmeetingsummariesguide" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <TheAipoweredMeetingSummariesGuide />
                </Suspense>
              } />
              <Route path="/aiagentsecuritythenononsenseguide" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-lg text-muted-foreground">Loading...</div></div>}>
                  <AiAgentSecurityTheNononsenseGuideToPromptInjectionMaliciousUse />
                </Suspense>
              } />
              
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
