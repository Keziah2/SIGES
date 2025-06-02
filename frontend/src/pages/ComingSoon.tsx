
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComingSoonProps {
  moduleName: string;
  description: string;
  expectedFeatures?: string[];
}

const ComingSoon = ({ 
  moduleName, 
  description, 
  expectedFeatures = [] 
}: ComingSoonProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {moduleName}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Module en cours de développement</CardTitle>
            <CardDescription className="text-center">
              Ce module fait partie du Système Intégré de Gestion Scolaire (SIGES) 
              et sera bientôt disponible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expectedFeatures.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Fonctionnalités prévues :</h3>
                <ul className="space-y-2">
                  {expectedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            Être notifié du lancement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
