export interface School {
  id: number;
  name: string;
  address: string;
  contact_info?: string | null;
  director?: number | null;
  logo_url?: string | null;
  is_active: boolean;
}

export interface Level {
  id: number;
  name: string;
  school: number; // ID of the school
  cycle: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  level: number; // ID of the level
  academic_year: string;
}

export interface User { // Basic User type for parents, teachers, etc.
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // Format YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  photo_url?: string | null;
  school_class: number; // ID of SchoolClass
  parents: number[]; // Array of parent User IDs
  enrollment_date: string; // Format YYYY-MM-DD
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED_OUT';
  // For display purposes, you might want nested objects:
  // school_class_details?: SchoolClass;
  // parents_details?: User[];
}
