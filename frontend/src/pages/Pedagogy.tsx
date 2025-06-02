
import ComingSoon from "./ComingSoon";

const Pedagogy = () => {
  const features = [
    "Inscription et réinscription des élèves avec données complètes",
    "Gestion des classes, niveaux et affectations",
    "Suivi de l'assiduité (présences, absences, retards)",
    "Notifications automatiques aux parents en cas d'absence",
    "Saisie des notes et calcul automatique des moyennes",
    "Génération de bulletins semestriels/trimestriels",
    "Emplois du temps par classe et enseignant"
  ];

  return (
    <ComingSoon
      moduleName="Gestion Pédagogique"
      description="Module complet pour la gestion des élèves, classes, assiduité et évaluations."
      expectedFeatures={features}
    />
  );
};

export default Pedagogy;
