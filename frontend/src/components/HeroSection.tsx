
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { CreditCard, Shield, Users } from "lucide-react";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Modernisez la gestion de vos écoles
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Plateforme numérique complète pour centraliser et automatiser la gestion administrative, 
          pédagogique et financière de votre groupe scolaire en Côte d'Ivoire.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-8">
          <span className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            Paiements Mobile Money
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Sécurité renforcée
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Multi-établissements
          </span>
        </div>
        
        {user ? (
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Accéder au tableau de bord
            </Button>
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">
                Créer un compte
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
