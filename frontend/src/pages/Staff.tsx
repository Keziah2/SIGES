
import ComingSoon from "./ComingSoon";

const Staff = () => {
  const features = [
    "Fiches complètes des enseignants avec classes assignées",
    "Gestion des matières enseignées par professeur",
    "Fiches du personnel administratif et de service",
    "Assignation automatique des rôles système",
    "Suivi des qualifications et certifications",
    "Historique des affectations et évolutions"
  ];

  return (
    <ComingSoon
      moduleName="Gestion du Personnel"
      description="Gestion complète des enseignants et du personnel administratif de l'école."
      expectedFeatures={features}
    />
  );
};

export default Staff;
