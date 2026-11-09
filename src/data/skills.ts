import type { SkillGroup } from '../types/content';

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    description: '掲載しているWebアプリの制作物で使用した技術です。',
    skills: ['CSS', 'JavaScript', 'TypeScript', 'React'],
  },
  {
    id: 'backend',
    label: 'Backend',
    description: '掲載内容を確認でき次第、追加します。',
    skills: [], // 掲載できる技術が確認できるまで空にしておく
  },
  {
    id: 'other',
    label: 'Other',
    description: 'ブロックチェーンやSwift、Cなど、Frontend以外の技術です。',
    skills: ['Blockchain (Symbol)', 'Swift', 'C'],
  },
];
