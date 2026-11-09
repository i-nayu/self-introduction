import { PROFILE } from '../data/profile';
import './ProfilePage.css';

export default function ProfilePage() {
  return (
    <main className="site-page profile-page">
      <header className="profile-intro">
        <p className="site-eyebrow">ABOUT / PROFILE</p>
        <h1>Profile</h1>
        <p>自己紹介</p>
      </header>

      <section className="profile-overview" aria-labelledby="profile-name">
        <div className="profile-photo">
          <img src={PROFILE.avatarUrl} alt={`${PROFILE.name}のプロフィール写真`} />
        </div>
        <div className="profile-bio">
          <p className="site-eyebrow">HELLO, I'M</p>
          <h2 id="profile-name">{PROFILE.name}</h2>
          <p className="profile-affiliation">{PROFILE.affiliation}</p>
          <p>{PROFILE.about}</p>
        </div>
      </section>

      <div className="profile-details">
        <section className="profile-detail-panel" aria-labelledby="profile-interests-title">
          <p className="site-eyebrow">INTERESTS</p>
          <h2 id="profile-interests-title">興味・関心</h2>
          <ul className="profile-interests">
            {PROFILE.interests.map((interest) => <li key={interest}>{interest}</li>)}
          </ul>
        </section>
        <section className="profile-detail-panel" aria-labelledby="profile-links-title">
          <p className="site-eyebrow">CONNECT</p>
          <h2 id="profile-links-title">SNS・リンク</h2>
          <div className="profile-links">
            <a href={PROFILE.xUrl} target="_blank" rel="noopener noreferrer">X <span aria-hidden="true">↗</span></a>
            <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </div>
    </main>
  );
}
