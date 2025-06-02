
import ComingSoon from "./ComingSoon";

const Communication = () => {
  const features = [
    "Messagerie interne sécurisée point-à-point",
    "Publication d'annonces générales ou ciblées",
    "Notifications in-app en temps réel",
    "Intégration SMS/Email pour notifications critiques",
    "Gestion des listes de diffusion par groupe",
    "Historique des communications et accusés de lecture"
  ];

  return (
    <ComingSoon
      moduleName="Communication"
      description="Système de messagerie et notifications pour faciliter les échanges entre tous les acteurs."
      expectedFeatures={features}
    />
  );
};

export default Communication;
