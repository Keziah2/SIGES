
import ComingSoon from "./ComingSoon";

const Schools = () => {
  const features = [
    "Création et gestion des établissements du groupe",
    "Configuration des cycles (Préscolaire, Primaire) et niveaux",
    "Paramètres spécifiques par école (années scolaires, jours fériés)",
    "Gestion des grilles tarifaires par établissement",
    "Association des directeurs et du personnel aux écoles",
    "Activation/désactivation des établissements"
  ];

  return (
    <ComingSoon
      moduleName="Gestion des Établissements"
      description="Administration centralisée de tous les établissements du groupe scolaire."
      expectedFeatures={features}
    />
  );
};

export default Schools;
