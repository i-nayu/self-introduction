export interface Profile {
  name: string;
  affiliation: string;
  avatarUrl: string;
  about: string;
  interests: readonly string[];
  xUrl: string;
  githubUrl: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'other';

export interface SkillGroup {
  id: SkillCategory;
  label: string;
  skills: readonly string[];
}

export interface Product {
  slug: string;
  title: string;
  imageUrl: string;
  technologies: readonly string[];
  description: string;
  githubUrl?: string;
  siteUrl?: string;
  featured: boolean;
}
