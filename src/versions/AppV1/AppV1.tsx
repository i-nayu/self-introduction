import { FaGithub } from 'react-icons/fa';
import { PROFILE } from '../../data/profile';
import { PRODUCTS } from '../../data/products';
import { SKILL_GROUPS } from '../../data/skills';
import './AppV1.css';
import Terminal from '../Terminal/Terminal';

export default function Portfolio() {
  return (
    <div className="page-wrapper">

      {/* ▼ ヘッダー ▼ */}
      <header className="header-section">
        <img src={PROFILE.avatarUrl} alt="Profile Avatar" className="profile-avatar" />
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>{PROFILE.name}</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontWeight: 'bold' }}>{PROFILE.affiliation}</p>

        <div className="">
          <a href={PROFILE.xUrl} target="_blank" rel="noopener noreferrer" className="sns-btn btn-x">
            𝕏 (Twitter)
          </a>
          <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className="sns-btn btn-github">
            <FaGithub size={20} /> GitHub
          </a>
          <div className="Terminal-container">
            <Terminal />
          </div>
        </div>
      </header>

      {/* ▼ メインコンテンツ ▼ */}
      <main className="main-content">

        {/* 💳 About Me */}
        <section id="about" className="card">
          <h2 className="header-light-blue">👤 About Me</h2>
          <div className="card-body">
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>{PROFILE.about}</p>
          </div>
        </section>

        {/* 💳 Skills */}
        <section id="skills" className="card">
          <h2 className="header-light-purple">💻 Skills</h2>
          <div className="card-body">
            {SKILL_GROUPS.flatMap((group) => group.skills).map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        {/* 💳 Products（カード複数） */}
        <section id="Products" className="card">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '10px', margin: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🚀</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1e293b', alignItems: 'flex-end' }}>Products</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {PRODUCTS.map((project) => (
              <div key={project.slug} className="card">
                <h3 className="header-light-gray">{project.title}</h3>

                <div className="card-body">
                  {/* ★ここから: 画像がある場合のみ表示する処理を追加 */}
                  {project.imageUrl && (
                    <div className="project-image-wrap" style={{
                      marginBottom: '1.5rem',
                      border: '1px solid #e2e8f0', // 枠線
                      borderRadius: '8px',          // 角丸
                      overflow: 'hidden',           // 角丸内に画像を収める
                    }}>
                      <img
                        src={project.imageUrl}
                        alt={`${project.title}のスクリーンショット`}
                        style={{
                          display: 'block',  // 下の隙間を消す
                          width: 'auto',     // 横幅は自動
                          height: 'auto',    // 高さも自動
                          maxWidth: '100%',  // 親要素より大きくならない
                          maxHeight: '400px' // 必要に応じて最大高さを制限
                        }}
                      />
                    </div>
                  )}
                  {/* ★ここまで */}

                  {project.technologies.length > 0 && (
                    <div className="tech-tag">✨ 使用技術: {project.technologies.join(', ')}</div>
                  )}
                  {project.description && (
                    <p style={{ lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.05rem', marginTop: 0 }}>{project.description}</p>
                  )}

                  <div>
                    {project.siteUrl && (
                      <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="btn-link btn-site">
                        🌐 サイトを見る
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-link btn-repo">
                        <FaGithub size={20} />GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>



    </div>
  );
}
