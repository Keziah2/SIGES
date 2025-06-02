
import { Shield, CreditCard, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Sécurité Renforcée</h4>
            <p className="text-gray-600">
              Contrôle d'accès basé sur les rôles (RBAC) avec protection des données sensibles
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Paiements Digitaux CI</h4>
            <p className="text-gray-600">
              Intégration Mobile Money (Orange, MTN, Moov, Wave) et cartes bancaires
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Analyse Avancée</h4>
            <p className="text-gray-600">
              Tableaux de bord et rapports consolidés pour une vision globale
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
