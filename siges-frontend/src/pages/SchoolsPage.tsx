import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/api';
import { School, Level, SchoolClass } from '../types/models'; // Import shared types

import SchoolListItem from '../components/SchoolListItem';
import SchoolForm from '../components/SchoolForm';
import LevelsManagement from '../components/LevelsManagement'; // New component

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSchoolForm, setShowSchoolForm] = useState(false);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<School[]>('/schools/');
      setSchools(response.data);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
      setError("Failed to load schools. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleSchoolCreated = (newSchool: School) => {
    fetchSchools(); // Refresh the list
    setShowSchoolForm(false);
  };

  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school);
  };
  
  const handleBackToList = () => {
    setSelectedSchool(null);
  }

  if (isLoading && schools.length === 0) return <p>Loading schools...</p>;
  if (error && !selectedSchool) return <p style={{ color: 'red' }}>{error}</p>; 

  if (selectedSchool) {
    return (
      <div>
        <button onClick={handleBackToList} style={{ marginBottom: '15px' }}>&larr; Back to Schools List</button>
        <h2>Managing School: {selectedSchool.name}</h2>
        <p><strong>Address:</strong> {selectedSchool.address}</p>
        {selectedSchool.contact_info && <p><strong>Contact:</strong> {selectedSchool.contact_info}</p>}
        <LevelsManagement school={selectedSchool} />
      </div>
    );
  }

  return (
    <div>
      <h1>Schools Management</h1>
      <button onClick={() => setShowSchoolForm(!showSchoolForm)}>
        {showSchoolForm ? 'Cancel Add School' : 'Add New School'}
      </button>

      {showSchoolForm && <SchoolForm onSchoolCreated={handleSchoolCreated} onCancel={() => setShowSchoolForm(false)} />}

      <h2>Schools List</h2>
      {schools.length === 0 && !isLoading && <p>No schools found. Add one!</p>}
      {isLoading && schools.length > 0 && <p>Updating list...</p>}
      <ul style={{ paddingLeft: 0 }}>
        {schools.map(school => (
          <div key={school.id} onClick={() => handleSelectSchool(school)} style={{cursor: 'pointer'}}>
            <SchoolListItem school={school} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SchoolsPage;
