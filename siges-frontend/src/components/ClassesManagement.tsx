import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import { Level, SchoolClass } from '../types/models';

interface ClassesManagementProps {
  level: Level;
}

interface ClassFormData {
  name: string;
  academic_year: string;
}

const ClassesManagement: React.FC<ClassesManagementProps> = ({ level }) => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [classFormData, setClassFormData] = useState<ClassFormData>({ name: '', academic_year: '2024-2025' });

  const fetchClasses = useCallback(async () => {
    if(!level || !level.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<SchoolClass[]>(`/levels/${level.id}/classes/`);
      setClasses(response.data);
    } catch (err) {
      console.error(`Failed to fetch classes for level ${level.id}:`, err);
      setError(`Failed to load classes for ${level.name}.`);
    } finally {
      setIsLoading(false);
    }
  }, [level.id, level.name]); 

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleClassFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassFormData({ ...classFormData, [e.target.name]: e.target.value });
  };

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post(`/levels/${level.id}/classes/`, classFormData);
      fetchClasses(); 
      setShowClassForm(false);
      setClassFormData({ name: '', academic_year: '2024-2025' }); 
    } catch (err: any) {
        console.error("Failed to create class:", err);
        if (err.response && err.response.data) {
            const errors = err.response.data;
            let errorMessages = [];
            for (const key in errors) {
              errorMessages.push(`${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`);
            }
            setError(errorMessages.join('; ') || 'Failed to create class.');
        } else {
            setError('Failed to create class. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading && classes.length === 0) return <p>Loading classes for {level.name}...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '15px', marginLeft: '20px' }}>
      <h4>Classes for {level.name}</h4>
      <button onClick={() => setShowClassForm(!showClassForm)}>
        {showClassForm ? 'Cancel Add Class' : 'Add New Class'}
      </button>

      {showClassForm && (
        <form onSubmit={handleClassSubmit} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
          <h5>Add New Class</h5>
          <div>
            <label htmlFor="className">Class Name (e.g., CM2 A):</label>
            <input type="text" id="className" name="name" value={classFormData.name} onChange={handleClassFormChange} required />
          </div>
          <div>
            <label htmlFor="academicYear">Academic Year (e.g., 2024-2025):</label>
            <input type="text" id="academicYear" name="academic_year" value={classFormData.academic_year} onChange={handleClassFormChange} required />
          </div>
          <button type="submit" style={{marginTop: '10px'}} disabled={isLoading}>
             {isLoading ? 'Saving...' : 'Save Class'}
          </button>
        </form>
      )}

      {classes.length === 0 && !isLoading && <p>No classes found for this level. Add one!</p>}
      <ul style={{ paddingLeft: '20px' }}> 
        {classes.map(cls => (
          <li key={cls.id}>
            {cls.name} - {cls.academic_year}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassesManagement;
