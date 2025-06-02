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
  cycle: string; // Ex: PRESCHOOL, PRIMARY
}

export interface SchoolClass {
  id: number;
  name: string;
  level: number; // ID of the level
  academic_year: string; // Ex: 2023-2024
}
