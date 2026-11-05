import type { SkillGroup } from '../types/content';

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: ['CSS', 'JavaScript', 'TypeScript', 'React'],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [], // 掲載できる技術が確認できるまで空にしておく
  },
  {
    id: 'other',
    label: 'Other',
    skills: ['Blockchain (Symbol)', 'Swift', 'C'],
  },
];
