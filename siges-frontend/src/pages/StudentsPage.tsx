import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/api';
import { Student } from '../types/models'; 
import StudentListItem from '../components/students/StudentListItem';
import StudentForm from '../components/students/StudentForm';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async (/* classId?: string, schoolId?: string */) => {
    setIsLoading(true);
    setError(null);
    try {
      // let url = '/students/';
      // const params = new URLSearchParams();
      // if (classId) params.append('class_id', classId);
      // else if (schoolId) params.append('school_id', schoolId);
      // if (params.toString()) url += `?${params.toString()}`; // No need to escape $ with quoted EOF
      const response = await apiClient.get<Student[]>('/students/'); // Default to all students for now
      setStudents(response.data);
    } catch (err: any) {
      console.error("Failed to fetch students:", err);
      setError(err.message || "Failed to load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentSaved = (savedStudent: Student) => {
    fetchStudents(); 
    setShowStudentForm(false);
    setEditingStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };
  
  const handleCancelForm = () => {
    setShowStudentForm(false);
    setEditingStudent(null);
  }

  // const handleDeleteStudent = async (studentId: number) => { ... }; // Placeholder

  if (isLoading && students.length === 0) return <p>Loading students...</p>;
  
  return (
    <div>
      <h1>Students Management</h1>
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>Error: {error}</p>}
      
      {!showStudentForm && (
        <button onClick={() => { setEditingStudent(null); setShowStudentForm(true); }} style={{marginBottom: '15px'}}>
          Enroll New Student
        </button>
      )}

      {showStudentForm && (
        <StudentForm
          onStudentSaved={handleStudentSaved}
          existingStudent={editingStudent}
          onCancel={handleCancelForm}
        />
      )}

      <h2>Students List</h2>
      {isLoading && students.length > 0 && <p>Updating list...</p>}
      {students.length === 0 && !isLoading && !error && <p>No students found.</p>}
      <ul style={{paddingLeft: 0}}>
        {students.map(student => (
          <StudentListItem
            key={student.id}
            student={student}
            onEdit={handleEditStudent}
            // onDelete={handleDeleteStudent} 
          />
        ))}
      </ul>
    </div>
  );
};

export default StudentsPage;
