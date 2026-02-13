export interface Job {
  is_bookmarked: string | boolean;
  bookmark_id: number;
  id: string | number;
  title: string;
  company_name: string;
  location?: string;
  job_type?: string;
  work_mode?: string;
  company_logo_url: string;
  experience_level: string;
  salary_range: string;
  company_bio?: string;
  description?: string;
  email?: string;
  skills?: string[];
  years_of_experience?: {
    lower: number;
    upper: number;
    bounds: string;
  };
  expires_at?: string;
  created_at?: string;
}
