import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import { School, Level } from '../types/models'; 
import ClassesManagement from './ClassesManagement'; 

interface LevelsManagementProps {
  school: School;
}

interface LevelFormData {
  name: string;
  cycle: string; 
}

const LevelsManagement: React.FC<LevelsManagementProps> = ({ school }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [levelFormData, setLevelFormData] = useState<LevelFormData>({ name: '', cycle: 'PRIMARY' });

  const fetchLevels = useCallback(async () => {
    if (!school || !school.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Level[]>(`/schools/${school.id}/levels/`);
      setLevels(response.data);
    } catch (err) {
      console.error(`Failed to fetch levels for school ${school.id}:`, err);
      setError(`Failed to load levels for ${school.name}.`);
    } finally {
      setIsLoading(false);
    }
  }, [school.id, school.name]); 

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);
  
  const handleLevelFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLevelFormData({ ...levelFormData, [e.target.name]: e.target.value });
  };

  const handleLevelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post(`/schools/${school.id}/levels/`, levelFormData);
      fetchLevels(); 
      setShowLevelForm(false);
      setLevelFormData({ name: '', cycle: 'PRIMARY' }); 
    } catch (err: any) {
        console.error("Failed to create level:", err);
        if (err.response && err.response.data) {
            const errors = err.response.data;
            let errorMessages = [];
            for (const key in errors) {
              errorMessages.push(`${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`);
            }
            setError(errorMessages.join('; ') || 'Failed to create level.');
        } else {
            setError('Failed to create level. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
  }
  
  const handleBackToLevelsList = () => {
    setSelectedLevel(null);
    fetchLevels(); 
  }

  if (isLoading && levels.length === 0) return <p>Loading levels for {school.name}...</p>;
  if (error && !selectedLevel) return <p style={{ color: 'red' }}>{error}</p>;
  
  if (selectedLevel) {
    return (
      <div style={{marginLeft: '20px'}}>
        <button onClick={handleBackToLevelsList} style={{marginTop: '10px', marginBottom: '10px'}}>&larr; Back to Levels List for {school.name}</button>
        <h3>Managing Classes for Level: {selectedLevel.name}</h3>
        <ClassesManagement level={selectedLevel} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
      <h3>Levels for {school.name}</h3>
      <button onClick={() => setShowLevelForm(!showLevelForm)}>
        {showLevelForm ? 'Cancel Add Level' : 'Add New Level'}
      </button>

      {showLevelForm && (
        <form onSubmit={handleLevelSubmit} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
          <h4>Add New Level</h4>
          <div>
            <label htmlFor="levelName">Level Name (e.g., CP1, CM2):</label>
            <input type="text" id="levelName" name="name" value={levelFormData.name} onChange={handleLevelFormChange} required />
          </div>
          <div>
            <label htmlFor="levelCycle">Cycle:</label>
            <select name="cycle" value={levelFormData.cycle} onChange={handleLevelFormChange}>
              <option value="PRESCHOOL">Préscolaire</option>
              <option value="PRIMARY">Primaire</option>
            </select>
          </div>
          <button type="submit" style={{marginTop: '10px'}} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Level'}
          </button>
        </form>
      )}

      {levels.length === 0 && !isLoading && <p>No levels found for this school. Add one!</p>}
      <ul style={{ paddingLeft: 0 }}>
        {levels.map(level => (
          <li key={level.id} onClick={() => handleSelectLevel(level)} style={{cursor: 'pointer', borderBottom: '1px dashed #eee', padding: '8px 0', listStyleType: 'none'}}>
            {level.name} ({level.cycle})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LevelsManagement;
