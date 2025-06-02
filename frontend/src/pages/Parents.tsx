
import ComingSoon from "./ComingSoon";

const Parents = () => {
  const features = [
    "Accès sécurisé avec vue unifiée multi-enfants",
    "Consultation des informations scolaires de chaque enfant",
    "Suivi de l'assiduité et consultation des notes",
    "Téléchargement des bulletins scolaires",
    "Vue consolidée de la situation financière",
    "Paiement en ligne via Mobile Money et cartes",
    "Historique détaillé des transactions",
    "Messagerie sécurisée avec enseignants et administration"
  ];

  return (
    <ComingSoon
      moduleName="Portail Parents"
      description="Interface dédiée aux parents pour le suivi de leurs enfants et les paiements en ligne."
      expectedFeatures={features}
    />
  );
};

export default Parents;
