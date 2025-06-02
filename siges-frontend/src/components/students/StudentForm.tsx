import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import { Student, SchoolClass, User } from '../../types/models';

interface StudentFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  photo_url: string;
  school_class: string; 
  parents: string[]; 
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED_OUT';
}

interface StudentFormProps {
  onStudentSaved: (student: Student) => void;
  existingStudent?: Student | null;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  onStudentSaved,
  existingStudent,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    first_name: '', last_name: '', date_of_birth: '', gender: '',
    address: '', emergency_contact_name: '', emergency_contact_phone: '',
    photo_url: '', school_class: '', parents: [], status: 'ACTIVE',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For submission
  const [formLoading, setFormLoading] = useState(false); // For loading dropdown data

  const [availableClasses, setAvailableClasses] = useState<SchoolClass[]>([]);
  const [availableParents, setAvailableParents] = useState<User[]>([]);

  const fetchDropdownData = useCallback(async () => {
    setFormLoading(true);
    try {
      const classesResponse = await apiClient.get<SchoolClass[]>('/classes/'); // Fetch all classes
      setAvailableClasses(classesResponse.data);

      const usersResponse = await apiClient.get<User[]>('/users/'); // Fetch all users
      setAvailableParents(usersResponse.data.filter(user => user.role === 'parent')); // Filter for parents
      
    } catch (err) {
      console.error("Failed to fetch classes/parents for form:", err);
      setError("Failed to load necessary data (classes/parents) for the form.");
    } finally {
      setFormLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (existingStudent) {
      setFormData({
        first_name: existingStudent.first_name,
        last_name: existingStudent.last_name,
        date_of_birth: existingStudent.date_of_birth,
        gender: existingStudent.gender || '',
        address: existingStudent.address || '',
        emergency_contact_name: existingStudent.emergency_contact_name || '',
        emergency_contact_phone: existingStudent.emergency_contact_phone || '',
        photo_url: existingStudent.photo_url || '',
        school_class: existingStudent.school_class.toString(),
        parents: existingStudent.parents.map(p => p.toString()),
        status: existingStudent.status,
      });
    } else { 
      setFormData({
        first_name: '', last_name: '', date_of_birth: '', gender: '',
        address: '', emergency_contact_name: '', emergency_contact_phone: '',
        photo_url: '', school_class: '', parents: [], status: 'ACTIVE',
      });
    }
  }, [existingStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedValues }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.school_class) {
        setError("School class is required.");
        return;
    }
    setIsLoading(true);
    setError(null);

    const submissionData = {
      ...formData,
      school_class: parseInt(formData.school_class),
      parents: formData.parents.map(p => parseInt(p)),
      address: formData.address || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      photo_url: formData.photo_url || null,
    };

    try {
      let response;
      if (existingStudent && existingStudent.id) {
        response = await apiClient.put<Student>(`/students/${existingStudent.id}/`, submissionData);
      } else {
        response = await apiClient.post<Student>('/students/', submissionData);
      }
      onStudentSaved(response.data);
    } catch (err: any) {
      console.error("Failed to save student:", err);
      if (err.response && err.response.data) {
        const errors = err.response.data;
        let errorMessages = [];
        for (const key in errors) {
          errorMessages.push(`${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`);
        }
        setError(errorMessages.join('; ') || 'Failed to save student.');
      } else {
        setError(err.message || 'Failed to save student. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (formLoading) return <p>Loading form data (classes, parents)...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '4px' }}>
      <h3>{existingStudent ? 'Edit Student' : 'Enroll New Student'}</h3>
      
      <div><label>First Name: <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required /></label></div>
      <div><label>Last Name: <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required /></label></div>
      <div><label>Date of Birth: <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required /></label></div>
      <div><label>Gender: 
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
        </select>
      </label></div>
      <div><label>Address: <textarea name="address" value={formData.address} onChange={handleChange} /></label></div>
      <div><label>Emergency Contact Name: <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} /></label></div>
      <div><label>Emergency Contact Phone: <input type="text" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} /></label></div>
      <div><label>Photo URL: <input type="url" name="photo_url" value={formData.photo_url} onChange={handleChange} /></label></div>
      
      <div><label>School Class: 
        <select name="school_class" value={formData.school_class} onChange={handleChange} required>
          <option value="">Select Class</option>
          {availableClasses.map(cls => <option key={cls.id} value={cls.id.toString()}>{cls.name} (Lvl ID: {cls.level})</option>)}
        </select>
      </label></div>
      
      <div><label>Parents (Ctrl/Cmd+click to select multiple): 
        <select name="parents" value={formData.parents} onChange={handleMultiSelectChange} multiple size={4} style={{minWidth: '200px'}}>
          {availableParents.map(p => <option key={p.id} value={p.id.toString()}>{p.first_name} {p.last_name} ({p.email})</option>)}
        </select>
      </label></div>
      
      <div><label>Status: 
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="GRADUATED">Graduated</option><option value="TRANSFERRED_OUT">Transferred Out</option>
        </select>
      </label></div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{marginTop: '15px'}}>
        <button type="submit" disabled={isLoading || formLoading} style={{marginRight: '10px'}}>
          {isLoading ? 'Saving...' : (existingStudent ? 'Update Student' : 'Enroll Student')}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading || formLoading}>Cancel</button>
      </div>
    </form>
  );
};

export default StudentForm;
