import React from 'react';
import { Student } from '../../types/models';

interface StudentListItemProps {
  student: Student;
  onEdit: (student: Student) => void;
  // onDelete: (studentId: number) => void; 
}

const StudentListItem: React.FC<StudentListItemProps> = ({ student, onEdit /*, onDelete */ }) => {
  return (
    <li style={{ borderBottom: '1px solid #eee', padding: '10px 0', listStyleType: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div>
        <h4>{student.first_name} {student.last_name}</h4>
        <p><strong>DOB:</strong> {student.date_of_birth} | <strong>Gender:</strong> {student.gender} | <strong>Status:</strong> {student.status}</p>
        <p><strong>Class ID:</strong> {student.school_class} | <strong>Enrolled:</strong> {student.enrollment_date}</p>
        {student.address && <p><strong>Address:</strong> {student.address}</p>}
        {student.emergency_contact_name && <p><strong>Emergency:</strong> {student.emergency_contact_name} ({student.emergency_contact_phone})</p>}
        {student.parents && student.parents.length > 0 && <p><strong>Parent IDs:</strong> {student.parents.join(', ')}</p>}
      </div>
      <div>
        <button onClick={() => onEdit(student)} style={{marginRight: '5px'}}>Edit</button>
        {/* <button onClick={() => onDelete(student.id)} style={{backgroundColor: 'red', color: 'white'}}>Delete</button> */}
      </div>
    </li>
  );
};

export default StudentListItem;
