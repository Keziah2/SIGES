import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { School } from '../pages/SchoolsPage'; // Import the shared type

interface SchoolFormProps {
  schoolToEdit?: School | null;
  onSchoolCreated: (school: School) => void;
  onCancel?: () => void;
}

// For creation, some fields of School are optional (like id)
// Use Partial for schoolData to allow omitting fields not required by create endpoint
// but ensure required fields by form are present.
type SchoolFormData = {
  name: string;
  address: string;
  contact_info?: string;
  director?: number | null;
  logo_url?: string;
  is_active?: boolean;
};


const SchoolForm: React.FC<SchoolFormProps> = ({ schoolToEdit, onSchoolCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [directorId, setDirectorId] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (schoolToEdit) {
      setName(schoolToEdit.name);
      setAddress(schoolToEdit.address);
      setContactInfo(schoolToEdit.contact_info || '');
      setDirectorId(schoolToEdit.director?.toString() || '');
      setLogoUrl(schoolToEdit.logo_url || '');
      setIsActive(schoolToEdit.is_active);
    } else {
      setName('');
      setAddress('');
      setContactInfo('');
      setDirectorId('');
      setLogoUrl('');
      setIsActive(true);
    }
  }, [schoolToEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const schoolData: SchoolFormData = {
      name,
      address,
    };
    if (contactInfo) schoolData.contact_info = contactInfo;
    if (directorId) schoolData.director = parseInt(directorId); else schoolData.director = null; // Send null if empty
    if (logoUrl) schoolData.logo_url = logoUrl;
    schoolData.is_active = isActive; // Always send is_active

    try {
      let response;
      if (schoolToEdit && schoolToEdit.id) {
        // Update logic (ensure all fields are sent, or use PATCH with only changed fields)
        // response = await apiClient.put<School>(`/schools/${schoolToEdit.id}/`, schoolData);
        console.log("Update logic to be implemented for:", schoolData);
        throw new Error("Update not yet implemented."); // Placeholder
      } else {
        // Create logic
        response = await apiClient.post<School>('/schools/', schoolData);
      }
      onSchoolCreated(response.data);
      if (!schoolToEdit) { // Reset form only on creation
        setName('');
        setAddress('');
        setContactInfo('');
        setDirectorId('');
        setLogoUrl('');
        setIsActive(true);
      }
      if(onCancel && !schoolToEdit) { // Also call onCancel if in create mode to hide form
          onCancel();
      }
    } catch (err: any) {
      console.error("Failed to save school:", err);
      if (err.response && err.response.data) {
        const errors = err.response.data;
        let errorMessages = [];
        for (const key in errors) {
          errorMessages.push(`${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`);
        }
        setError(errorMessages.join('; ') || 'Failed to save school.');
      } else {
        setError(err.message || 'Failed to save school. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '4px' }}>
      <h3>{schoolToEdit ? 'Edit School' : 'Create New School'}</h3>
      <div>
        <label htmlFor="name">School Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="contactInfo">Contact Info:</label>
        <input type="text" id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
      </div>
      <div>
        <label htmlFor="directorId">Director ID (User ID):</label>
        <input type="number" id="directorId" value={directorId} onChange={(e) => setDirectorId(e.target.value)} placeholder="Optional"/>
      </div>
      <div>
        <label htmlFor="logoUrl">Logo URL:</label>
        <input type="url" id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Optional" />
      </div>
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Is Active
        </label>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '10px' }}>
        <button type="submit" disabled={isLoading} style={{ marginRight: '10px' }}>
          {isLoading ? 'Saving...' : (schoolToEdit ? 'Update School' : 'Create School')}
        </button>
        {onCancel && <button type="button" onClick={onCancel} disabled={isLoading}>Cancel</button>}
      </div>
    </form>
  );
};

export default SchoolForm;
