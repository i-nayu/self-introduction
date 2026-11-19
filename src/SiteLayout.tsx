import { Link, NavLink, Outlet } from 'react-router-dom';
import SeasonalDecoration from './components/SeasonalDecoration';
import { getSeason } from './components/season';
import './site.css';
import './seasonal-theme.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Profile' },
  { to: '/skills', label: 'Skills' },
  { to: '/products', label: 'Products' },
];

export default function SiteLayout() {
  const season = getSeason(new Date());

  return (
    <div className={`site-shell site-shell--${season}`}>
      <SeasonalDecoration season={season} />
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
    </div>
  );
}
