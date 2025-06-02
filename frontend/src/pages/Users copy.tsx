//frontend/src/pages/users.tsx
import ComingSoon from "./ComingSoon";

const Users = () => {
  const features = [
    "Gestion des rôles prédéfinis (Super Admin, Directeur, Enseignant, Comptable, Parent)",
    "Création de rôles personnalisés avec permissions spécifiques", 
    "Authentification sécurisée avec récupération de mot de passe",
    "Contrôle d'accès par établissement (isolation des données)",
    "Vue consolidée pour le Super Admin du groupe",
    "Interface de gestion des utilisateurs par rôle"
  ];

  return (
    <ComingSoon
      moduleName="Gestion des Utilisateurs & Rôles"
      description="Système de contrôle d'accès basé sur les rôles (RBAC) pour sécuriser l'accès aux données."
      expectedFeatures={features}
    />
  );
};

export default Users;
