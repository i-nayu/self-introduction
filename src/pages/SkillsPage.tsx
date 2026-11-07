import { SKILL_GROUPS } from '../data/skills';

export default function SkillsPage() {
  return (
    <main className="site-page">
      <h1>Skills</h1>
      <div className="site-grid">
        {SKILL_GROUPS.map((group) => (
          <section className="site-panel" key={group.id}>
            <h2>{group.label}</h2>
            {group.skills.length > 0 ? (
              <ul className="site-tags">
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            ) : (
              <p className="site-muted">掲載内容を準備中です。</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
