
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ModulesGrid from "@/components/ModulesGrid";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <HeroSection />
      <ModulesGrid />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
