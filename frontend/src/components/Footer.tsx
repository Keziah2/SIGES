
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">SIGES</span>
        </div>
        <p className="text-gray-400">
          Système Intégré de Gestion Scolaire - Côte d'Ivoire
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Développé pour moderniser la gestion des groupes scolaires
        </p>
      </div>
    </footer>
  );
};

export default Footer;
