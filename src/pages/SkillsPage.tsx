import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { SKILL_GROUPS } from '../data/skills';
import './SkillsPage.css';

export default function SkillsPage() {
  return (
    <main className="site-page skills-page">
      <header className="skills-intro">
        <p className="site-eyebrow">ABOUT / SKILLS</p>
        <h1>Skills</h1>
        <p>制作物とあわせて、使用した技術を紹介します。</p>
      </header>

      <div className="skills-categories">
        {SKILL_GROUPS.map((group, index) => {
          const relatedProducts = PRODUCTS.map((product) => ({
            product,
            matchedSkills: group.skills.filter((skill) => product.technologies.includes(skill)),
          })).filter(({ matchedSkills }) => matchedSkills.length > 0);

          return (
            <section className="skills-category" key={group.id} aria-labelledby={`skills-${group.id}`}>
              <div className="skills-category-heading">
                <span className="skills-category-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 id={`skills-${group.id}`}>{group.label}</h2>
                  <p>{group.description}</p>
                </div>
              </div>

              {group.skills.length > 0 ? (
                <ul className="skills-list" aria-label={`${group.label}の技術`}>
                  {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              ) : (
                <p className="skills-empty">準備中…</p>
              )}

              {relatedProducts.length > 0 && (
                <div className="skills-related">
                  <h3>関連するProducts</h3>
                  <ul>
                    {relatedProducts.map(({ product, matchedSkills }) => (
                      <li key={product.slug}>
                        <Link to={`/products#product-${product.slug}`}>
                          <span>{product.title}</span>
                          <span aria-hidden="true">↗</span>
                        </Link>
                        {/* プロダクトの技術スタック */}
                        <span className="skills-related-tech">{matchedSkills.join(' / ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
