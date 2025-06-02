import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/api';
import SchoolListItem from '../components/SchoolListItem'; // Ensure it is used
import SchoolForm from '../components/SchoolForm';

// Define the School type more precisely, according to the backend
export interface School { // Export to use in SchoolForm and SchoolListItem
  id: number;
  name: string;
  address: string;
  contact_info?: string | null;
  director?: number | null; // Director's user ID
  logo_url?: string | null;
  is_active: boolean;
}

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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
    // Either add to the existing list or refresh the entire list
    // For simplicity, let's refresh the entire list for now
    fetchSchools();
    setShowForm(false); // Hide the form after creation
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (isLoading && schools.length === 0) return <p>Loading schools...</p>;
  if (error && schools.length === 0) return <p style={{ color: 'red' }}>{error}</p>; // Show error prominently if list is empty

  return (
    <div>
      <h1>Schools Management</h1>
      {/* TODO: Conditionally display this button based on user roles (e.g., SuperAdmin) */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New School'}
      </button>

      {showForm && <SchoolForm onSchoolCreated={handleSchoolCreated} onCancel={handleCancelForm} />}

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error even if list is partially loaded */}
      <h2>Schools List</h2>
      {schools.length === 0 && !isLoading && <p>No schools found. Add one!</p>}
      {isLoading && schools.length > 0 && <p>Updating list...</p>} {/* Indicate loading when refreshing */}
      <ul style={{ paddingLeft: 0 }}> {/* Remove default ul padding */}
        {schools.map(school => (
          <SchoolListItem key={school.id} school={school} />
        ))}
      </ul>
    </div>
  );
};

export default SchoolsPage;
