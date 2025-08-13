
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import LogicSection from "@/components/LogicSection";
import DifferentiationSection from "@/components/DifferentiationSection";
import ContentCategoriesSection from "@/components/ContentCategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FounderSection from "@/components/FounderSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <LogicSection />
        <DifferentiationSection />
        <ContentCategoriesSection />
        <TestimonialsSection />
        <FounderSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
