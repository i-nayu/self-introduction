import type { SkillGroup } from '../types/content';

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    description: '制作物やインターンのフロントエンド開発で使用した技術です。',
    skills: ['CSS', 'JavaScript', 'TypeScript', 'React', 'React Router', 'Ruby', 'Rails'],
  },
  {
    id: 'backend',
    label: 'Backend',
    description: '制作物やインターンのバックエンド・データベース開発で使用した技術です。',
    skills: ['Express', 'MySQL', 'PostgreSQL', 'Java', `Node.js`],
  },
  {
    id: 'other',
    label: 'Other',
    description: 'ブロックチェーン、アプリ、データ分析、インフラなどの技術です。',
    skills: ['Blockchain (Symbol)', 'Swift', 'SwiftUI', 'Python', 'AWS', 'Terraform', 'C'],
  },
];
