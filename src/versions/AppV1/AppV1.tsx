import { FaGithub } from 'react-icons/fa';
import './AppV1.css'; // ★CSSを読み込む
import Terminal from '../Terminal/Terminal';

// データの定義
const PROFILE = {
  name: "nayu",
  role: "立命館大学 RiST ",
  avatarUrl: "/IMG_2510.JPG",
  xUrl: "https://twitter.com/nayu4201",
  githubUrl: "https://github.com/i-nayu",
  about: `ハッカソンに出るのが好きで、主にwebサイトの開発を行っています。
          最近はブロックチェーンとSwiftに興味があります。`
};

const SKILLS = [
  "CSS", "JavaScript", "TypeScript", "React", "Blockchain(SYMBOL)", "C"
];

const PROJECTS = [
  {
    title: "ARROW（JPHACKS 2025）",
    imageUrl: "/ARROW.png",
    techStack: "React, CSS, TypeScript, JavaScript",
    description: "イベントを誰もが見逃すことなく手軽に参加/運営することが出来、イベント開催にあたっての手順の多さとそれがもたらすイベント参加/運営への障壁をなくすことができるWebアプリケーションです。",
    siteUrl: "",
    githubUrl: "https://github.com/jphacks/os_2508",
  },
  {
    title: "TrusToken（KC3Hack 2026）",
    imageUrl: "/TrusToken.jpg",
    techStack: "React, CSS, TypeScript, JavaScript, Blockchain(SYMBOL)",
    description: "「信頼」をテーマとした、複数のコミュニティ（ルーム）ごとにトークンを発行・管理・取引できるブロックチェーンを使用したウェブアプリケーションです。",
    siteUrl: "",
    githubUrl: "https://github.com/kc3hack/2026_team3",
  },
  {
    title: "Touction（NEMTUS Hackathon）",
    imageUrl: "/Touction.png", // ★ここを追加
    techStack: "React, CSS, TypeScript, JavaScript, Blockchain(SYMBOL)",
    description: "Symbolテストネットを使った写真トーナメント + オークションアプリです。 ユーザーは写真を投稿し、トーナメントで投票を受け、終了後にオークション入札・購入を行えます。",
    siteUrl: "",
    githubUrl: "https://github.com/i-nayu/Touction",
  },
  {
    title: "ClipboardApp（個人開発）",
    imageUrl: "/Clipboard.png", // ★ここを追加
    techStack: "Swift",
    description: "macOS向けのシンプルで軽量なクリップボード履歴管理アプリです。 バックグラウンドで常にコピー内容を監視し、ショートカットキーで素早く履歴を呼び出すことができます。",
    siteUrl: "",
    githubUrl: "https://github.com/i-nayu/ClipboardApp",
  },
  {
    title: "gagaku_welcome（個人開発）",
    imageUrl: "/IMG_7029.jpg", // ★ここを追加
    techStack: "React, CSS, TypeScript, JavaScript, Blockchain(SYMBOL)",
    description: "Symbolテストネットを使った写真トーナメント + オークションアプリです。 ユーザーは写真を投稿し、トーナメントで投票を受け、終了後にオークション入札・購入を行えます。",
    siteUrl: "https://gagakuwelcome.vercel.app",
    githubUrl: "https://github.com/i-nayu/gagaku_welcome",
  },
  {
    title: "RemiCal（個人開発・開発中）",
    imageUrl: "/IMG_7030.jpg", // ★ここを追加
    techStack: "React, CSS, TypeScript, JavaScript, Blockchain(SYMBOL)",
    description: "予定の管理を簡単に行うための画像やファイルから予定情報を認識して登録できるカレンダーLINEbotです。",
    siteUrl: "",
    githubUrl: "https://github.com/i-nayu/RemiCal",
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
            {SKILLS.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        {/* 💳 Works & Hackathons（カード複数） */}
        <section id="Products" className="card">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '10px', margin: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🚀</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1e293b', alignItems: 'flex-end' }}>Products</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {PROJECTS.map((project, index) => (
              <div key={index} className="card">
                <h3 className="header-light-gray">{project.title}</h3>

                <div className="card-body">
                  {/* ★ここから: 画像がある場合のみ表示する処理を追加 */}
                  {project.imageUrl && (
                    <div style={{
                      marginBottom: '1.5rem',
                      display: 'inline-block',      // 画像サイズに合わせる
                      border: '1px solid #e2e8f0', // 枠線
                      borderRadius: '8px',          // 角丸
                      overflow: 'hidden',           // 角丸内に画像を収める
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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