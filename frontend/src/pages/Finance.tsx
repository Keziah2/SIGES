
import ComingSoon from "./ComingSoon";

const Finance = () => {
  const features = [
    "Configuration des frais scolaires par niveau/classe",
    "Génération automatique des factures avec échéances",
    "Intégration Mobile Money CI (Orange, MTN, Moov, Wave)",
    "Paiements par cartes bancaires (Visa, Mastercard)",
    "Suivi en temps réel des encaissements via webhooks",
    "Gestion des dépenses par catégorie et école",
    "Tableau de bord de trésorerie consolidé",
    "Rapports financiers détaillés et exports"
  ];

  return (
    <ComingSoon
      moduleName="Gestion Financière & Trésorerie"
      description="Module critique pour la gestion des finances avec paiements digitaux spécifiques à la Côte d'Ivoire."
      expectedFeatures={features}
    />
  );
};

export default Finance;
