import React from 'react';

export const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrateur',
    instructor: 'Instructeur',
    coordinator: 'Coordinateur',
    supervisor: 'Superviseur',
    trainee: 'Stagiaire'
  };
  return labels[role] || role;
};

export const getPermissions = (role) => {
  const permissions = {
    admin: [
      'Créer et gérer tous les comptes utilisateurs',
      'Gérer les matières',
      'Créer des cours, contrôles et corrections',
      'Voir les statistiques globales',
      'Accéder à toutes les fonctionnalités'
    ],
    instructor: [
      'Créer des cours pour les matières',
      'Créer des contrôles et corrections',
      'Publier des sujets de recherche',
      'Noter les soumissions des stagiaires',
      'Voir les progrès des stagiaires'
    ],
    coordinator: [
      'Voir la progression des stagiaires',
      'Suivre la formation globale',
      'Voir les statistiques de formation'
    ],
    supervisor: [
      'Voir la progression détaillée des stagiaires',
      'Voir les soumissions des stagiaires',
      'Suivre la formation de manière approfondie',
      'Voir les statistiques détaillées'
    ],
    trainee: [
      'Consulter les cours',
      'Télécharger et soumettre les contrôles',
      'Consulter les corrections',
      'Soumettre les recherches',
      'Voir sa progression'
    ]
  };
  return permissions[role] || [];
};

const PermissionsInfo = ({ role }) => {
  return (
    <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
      <h4 style={{ marginBottom: '10px', color: '#374151', fontSize: '14px' }}>
        Vos permissions ({getRoleLabel(role)}):
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
        {getPermissions(role).map((permission, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', color: '#4B5563' }}>
            <span style={{ color: '#10B981', marginRight: '8px', fontSize: '12px' }}>✓</span>
            {permission}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermissionsInfo;
