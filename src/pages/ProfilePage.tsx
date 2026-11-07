import { PROFILE } from '../data/profile';

export default function ProfilePage() {
  return (
    <main className="site-page">
      <h1>Profile</h1>
      <div className="site-profile">
        <img src={PROFILE.avatarUrl} alt={`${PROFILE.name}のプロフィール写真`} />
        <div>
          <h2>{PROFILE.name}</h2>
          <p className="site-muted">{PROFILE.affiliation}</p>
          <p>{PROFILE.about}</p>
          <div className="site-links">
            <a href={PROFILE.xUrl} target="_blank" rel="noopener noreferrer">X</a>
            <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </main>
  );
}
