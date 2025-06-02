
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  MessageSquare, 
  BarChart3,
  School,
  UserCheck,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnexion réussie");
      navigate("/");
    }
  };

  const modules = [
    {
      title: "Gestion des Utilisateurs",
      description: "Contrôle d'accès basé sur les rôles (RBAC)",
      icon: <Users className="w-6 h-6" />,
      status: "En développement",
      color: "bg-blue-500",
      href: "/users"
    },
    {
      title: "Gestion des Établissements",
      description: "Administration des écoles du groupe",
      icon: <School className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-green-500",
      href: "/schools"
    },
    {
      title: "Gestion Pédagogique",
      description: "Élèves, classes, assiduité et évaluations",
      icon: <GraduationCap className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-purple-500",
      href: "/pedagogy"
    },
    {
      title: "Gestion du Personnel",
      description: "Enseignants et personnel administratif",
      icon: <UserCheck className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-orange-500",
      href: "/staff"
    },
    {
      title: "Gestion Financière",
      description: "Trésorerie et paiements digitaux CI",
      icon: <DollarSign className="w-6 h-6" />,
      status: "Critique",
      color: "bg-red-500",
      href: "/finance"
    },
    {
      title: "Portail Parents",
      description: "Accès sécurisé pour les parents",
      icon: <BookOpen className="w-6 h-6" />,
      status: "Critique",
      color: "bg-indigo-500",
      href: "/parents"
    },
    {
      title: "Communication",
      description: "Messagerie et notifications",
      icon: <MessageSquare className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-cyan-500",
      href: "/communication"
    },
    {
      title: "Rapports & Statistiques",
      description: "Tableaux de bord et analyses",
      icon: <BarChart3 className="w-6 h-6" />,
      status: "Planifié",
      color: "bg-amber-500",
      href: "/reports"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "En développement": "bg-blue-100 text-blue-800",
      "Critique": "bg-red-100 text-red-800",
      "Planifié": "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={`${variants[status]} border-0`}>
        {status}
      </Badge>
    );
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user.user_metadata?.first_name || user.email}
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Modules Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Modules du Système
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={() => navigate(module.href)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${module.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {module.icon}
                      </div>
                    </div>
                    {getStatusBadge(module.status)}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
