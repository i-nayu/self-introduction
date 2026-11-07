import { Link, NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Profile' },
  { to: '/skills', label: 'Skills' },
];

export default function SiteLayout() {
  return (
    <div className="site-shell">
      <a className="site-skip-link" href="#site-content">本文へ移動</a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" to="/">nayu</Link>
          <nav className="site-nav" aria-label="メインナビゲーション">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `site-nav-link${isActive ? ' is-active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div id="site-content" className="site-content" tabIndex={-1}>
        <Outlet />
      </div>
      <footer className="site-footer">© nayu</footer>
    </div>
  );
}
