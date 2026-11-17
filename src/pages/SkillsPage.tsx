import { Link } from 'react-router-dom';
import { INTERNSHIPS } from '../data/internships';
import { PRODUCTS } from '../data/products';
import { SKILL_GROUPS } from '../data/skills';
import './SkillsPage.css';

export default function SkillsPage() {
  return (
    <main className="site-page skills-page">
      <header className="skills-intro">
        <p className="site-eyebrow">ABOUT / SKILLS</p>
        <h1>Skills</h1>
        <p>制作物やインターンで使った技術と、開発・分析の経験を紹介します。</p>
      </header>

      <nav className="skills-page-nav" aria-label="Skillsページ内の移動">
        <a href="#technical-stack">技術スタック <span aria-hidden="true">↗</span></a>
        <a href="#internship-experience">インターン経験 <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="skills-block" id="technical-stack" aria-labelledby="technical-stack-title">
        <div className="skills-block-heading">
          <span className="skills-block-number" aria-hidden="true">01 / TECH STACK</span>
          <h2 id="technical-stack-title">技術スタック</h2>
          <p>制作物・インターン・授業で使用した技術をカテゴリごとにまとめています。</p>
        </div>

        <div className="skills-categories">
          {SKILL_GROUPS.map((group, index) => {
            const relatedProducts = PRODUCTS.map((product) => ({
              product,
              matchedSkills: group.skills.filter((skill) => product.technologies.includes(skill)),
            })).filter(({ matchedSkills }) => matchedSkills.length > 0);
            const relatedInternships = INTERNSHIPS.map((experience) => ({
              experience,
              matchedSkills: group.skills.filter((skill) => experience.technologies?.includes(skill)),
            })).filter(({ matchedSkills }) => matchedSkills.length > 0);

            return (
              <section className="skills-category" key={group.id} aria-labelledby={`skills-${group.id}`}>
                <div className="skills-category-heading">
                  <span className="skills-category-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 id={`skills-${group.id}`}>{group.label}</h3>
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
                    <h4>関連するProducts</h4>
                    <ul>
                      {relatedProducts.map(({ product, matchedSkills }) => (
                        <li key={product.slug}>
                          <Link to={`/products#product-${product.slug}`}>
                            <span>{product.title}</span>
                            <span aria-hidden="true">↗</span>
                          </Link>
                          <span className="skills-related-tech">{matchedSkills.join(' / ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {relatedInternships.length > 0 && (
                  <div className="skills-related">
                    <h4>関連するインターン経験</h4>
                    <ul>
                      {relatedInternships.map(({ experience, matchedSkills }) => (
                        <li key={experience.id}>
                          <a href={`#internship-${experience.id}`}>
                            <span>{experience.title}</span>
                            <span aria-hidden="true">↗</span>
                          </a>
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
      </section>

      <section className="skills-block" id="internship-experience" aria-labelledby="internship-experience-title">
        <div className="skills-block-heading">
          <span className="skills-block-number" aria-hidden="true">02 / EXPERIENCE</span>
          <h2 id="internship-experience-title">インターン経験</h2>
          <p>開発や分析の現場で、課題の整理から実装・レビューまで取り組みました。</p>
        </div>

        <div className="internship-grid">
          {INTERNSHIPS.map((experience, index) => (
            <article className="internship-card" id={`internship-${experience.id}`} tabIndex={-1} key={experience.id}>
              <div className="internship-card-meta">
                <span className="internship-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="internship-card-duration">{experience.duration}</span>
              </div>
              <h3>{experience.title}</h3>
              <p className="internship-card-role">{experience.role}</p>
              <p className="internship-card-summary">{experience.summary}</p>
              {experience.technologies && experience.technologies.length > 0 && (
                <div className="internship-card-technologies">
                  <h4>使用技術</h4>
                  <ul aria-label={`${experience.title}で使用した技術`}>
                    {experience.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                </div>
              )}
              <div className="internship-card-detail">
                <h4>担当したこと</h4>
                <ul>
                  {experience.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
                </ul>
              </div>
              <div className="internship-card-detail internship-card-learning">
                <h4>工夫・学び</h4>
                <p>{experience.learning}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
