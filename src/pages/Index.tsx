
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import DifferentiationSection from "@/components/DifferentiationSection";
import FounderSection from "@/components/FounderSection";
import ExploreSection from "@/components/ExploreSection";
import LogicSection from "@/components/LogicSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DifferentiationSection />
        <FounderSection />
        <ExploreSection />
        <LogicSection />
        <TestimonialsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
