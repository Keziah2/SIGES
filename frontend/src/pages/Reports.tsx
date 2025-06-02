
import ComingSoon from "./ComingSoon";

const Reports = () => {
  const features = [
    "Tableaux de bord personnalisés par rôle",
    "Vue consolidée du groupe pour le Super Admin",
    "Rapports d'effectifs et d'assiduité",
    "Analyses financières et flux de trésorerie",
    "Comparatifs inter-écoles et évolutions",
    "Exports personnalisables (PDF, Excel)",
    "Planification automatique de rapports récurrents"
  ];

  return (
    <ComingSoon
      moduleName="Rapports & Statistiques"
      description="Tableaux de bord et analyses pour une vision globale et une prise de décision éclairée."
      expectedFeatures={features}
    />
  );
};

export default Reports;
