import React from 'react';
import { School } from '../pages/SchoolsPage'; // Import the shared type

interface SchoolListItemProps {
  school: School;
  // onEdit: (school: School) => void;
  // onDelete: (schoolId: number) => void;
}

const SchoolListItem: React.FC<SchoolListItemProps> = ({ school }) => {
  return (
    <li style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', listStyleType: 'none', borderRadius: '4px' }}>
      <h3>{school.name}</h3>
      <p><strong>Address:</strong> {school.address}</p>
      {school.contact_info && <p><strong>Contact:</strong> {school.contact_info}</p>}
      {school.director && <p><strong>Director ID:</strong> {school.director}</p>}
      <p><strong>Status:</strong> {school.is_active ? 'Active' : 'Inactive'}</p>
      {/*
        // TODO: Add Edit/Delete buttons here, conditioned by user permissions
        // <button onClick={() => onEdit(school)}>Edit</button>
        // <button onClick={() => onDelete(school.id)}>Delete</button>
      */}
    </li>
  );
};

export default SchoolListItem;
