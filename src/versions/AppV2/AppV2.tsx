import { FaGithub } from 'react-icons/fa';
import './AppV2.css'; // ★CSSを読み込む

// データの定義
const PROFILE = {
  name: "nayu",
  role: "立命館大学 RiST ",
  avatarUrl: "../../../public/IMG_2510.JPG", 
  xUrl: "https://twitter.com/nayu4201",
  githubUrl: "https://github.com/i-nayu",
  about: `ハッカソンに出るのが好きで、主にwebサイトの開発を行っています。
          最近はブロックチェーンに興味があります。`
};

const SKILLS = [
  "CSS", "JavaScript", "TypeScript", "React", "Blockchain(SYMBOL)","C"
];

const PROJECTS = [
  {
    title: "ARROW（JPHACKS 2025）",
    imageUrl: `https://private-user-images.githubusercontent.com/176911084/505255102-e948677c-3178-4c7c-8ca4-6799cdbbd5e2.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM3NDA4OTgsIm5iZiI6MTc3Mzc0MDU5OCwicGF0aCI6Ii8xNzY5MTEwODQvNTA1MjU1MTAyLWU5NDg2NzdjLTMxNzgtNGM3Yy04Y2E0LTY3OTljZGJiZDVlMi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzE3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxN1QwOTQzMThaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00Yjc0YjljYTZiMGJkNGJlMmEwYjEyMjgxMzZkZTFmZjNjY2UwNWYxZGUzZWY5MTBhN2JjYjYwMDA3YjlmNWQ5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.REBeKfE2rtCwdBjeZajrUPb2xeKEuXku-DGM1tELfQU`, 
    techStack: "React, CSS, TypeScript, JavaScript",
    description: "〇〇の課題を解決するアプリです。チーム3人で開発し、私はフロントエンドとUIデザインを担当しました。",
    siteUrl: "", 
    githubUrl: "https://github.com/jphacks/os_2508",
  },
  {
    title: "TrusToken（KC3Hack 2026）",
    imageUrl: "https://private-user-images.githubusercontent.com/198358207/553082419-72e9ae57-fbcc-4307-9b20-098aa9cee8dd.jpg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM3NDEwNTcsIm5iZiI6MTc3Mzc0MDc1NywicGF0aCI6Ii8xOTgzNTgyMDcvNTUzMDgyNDE5LTcyZTlhZTU3LWZiY2MtNDMwNy05YjIwLTA5OGFhOWNlZThkZC5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzE3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxN1QwOTQ1NTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1kY2ZkYWEyYTEwYzU4Y2M3ODEzMjk5N2FiNDkwMDY1NDlkYTRlZjAwMzkyYTk2MzgxYjJlM2Y2Zjg3Y2M4MzA3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.-x3hUtFg_rjR-q7Cbmd9d2LP-BXU69T5tWCJBp2BVNo", 
    techStack: "React, CSS, TypeScript, JavaScript, Blockchain(SYMBOL)",
    description: "〇〇を自動で生成する個人開発ツールです。APIと連携し、レスポンス速度を上げる工夫をしました。",
    siteUrl: "", 
    githubUrl: "https://github.com/kc3hack/2026_team3",
  },
  {
    title: "Touction（NEMTUS Hackathon）",
    imageUrl: "../../../public/Touction.png", // ★ここを追加
    techStack: "React, CSS, TypeScript, JavaScript, Blockchain(SYMBOL)",
    description: "〇〇を自動で生成する個人開発ツールです。APIと連携し、レスポンス速度を上げる工夫をしました。",
    siteUrl: "", 
    githubUrl: "https://github.com/i-nayu/Touction",
  }
];

export default function Portfolio() {
  return (
    <div className="page-wrapper">
      
      {/* ▼ ヘッダー ▼ */}
      <header className="header-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PROFILE.avatarUrl} alt="Profile Avatar" className="profile-avatar" />
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#1e293b' }}>{PROFILE.name}</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontWeight: 'bold' }}>{PROFILE.role}</p>
        
        <div>
          <a href={PROFILE.xUrl} target="_blank" rel="noopener noreferrer" className="sns-btn btn-x">
            𝕏 (Twitter)
          </a>
          <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className="sns-btn btn-github">
            <FaGithub size={20} /> GitHub
          </a>
        </div>
      </header>

      {/* ▼ メインコンテンツ ▼ */}
      <main className="main-content">

        {/* 💳 About Me */}
        <section className="card">
          <h2 className="header-light-blue">👤 About Me</h2>
          <div className="card-body">
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>{PROFILE.about}</p>
          </div>
        </section>

        {/* 💳 Skills */}
        <section className="card">
          <h2 className="header-light-purple">💻 Skills</h2>
          <div className="card-body">
            {SKILLS.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        {/* 💳 Works & Hackathons（カード複数） */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🚀</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1e293b' }}>Works & Hackathons</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {PROJECTS.map((project, index) => (
              <div key={index} className="card">
                <h3 className="header-light-gray">{project.title}</h3>
                
                <div className="card-body">
                  {/* ★ここから: 画像がある場合のみ表示する処理を追加 */}
                  {project.imageUrl && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={project.imageUrl} 
                        alt={`${project.title}のスクリーンショット`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '300px',      // 高くなりすぎるのを防ぐ
                          objectFit: 'cover',      // 枠に合わせてトリミング
                          borderRadius: '8px',     // 角を丸くする
                          border: '1px solid #e2e8f0' // 薄い枠線をつける
                        }}
                      />
                    </div>
                  )}
                  {/* ★ここまで */}

                  <div className="tech-tag">✨ 使用技術: {project.techStack}</div>
                  <p style={{ lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.05rem', marginTop: 0 }}>{project.description}</p>
                  
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