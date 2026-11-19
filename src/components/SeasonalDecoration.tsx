import type { CSSProperties } from 'react';
import './SeasonalDecoration.css';
import { getSeason, type Season } from './season';

const DECORATION_COUNTS: Record<Season, number> = {
  spring: 18,
  summer: 5,
  autumn: 18,
  winter: 54,
};

export default function SeasonalDecoration({ season = getSeason(new Date()) }: { season?: Season }) {
  return (
    <div className={`seasonal-decoration seasonal-decoration--${season}`} aria-hidden="true">
      {season === 'summer' && (
        <div className="summer-sun">
          <div className="summer-sun-rays" />
          <div className="summer-sun-disc" />
        </div>
      )}
      {Array.from({ length: DECORATION_COUNTS[season] }, (_, index) => (
        <span
          className="seasonal-particle"
          key={index}
          style={{
            '--left': `${(index * 37 + 4) % 100}%`,
            '--rest-top': `${(index * 23 + 8) % 90}%`,
            '--duration': `${22 + (index * 7) % 15}s`,
            '--delay': `${-(index * 11 + 4)}s`,
            '--size': `${28 + (index * 7) % 18}px`,
            '--rotation': `${(index * 47) % 180 - 90}deg`,
            '--sway-duration': `${4 + index % 4}s`,
          } as CSSProperties}
        >
          {season === 'winter' && index % 2 === 0 && (
            <img src="/snowflake.svg" alt="" width="100" height="100" />
          )}
          {season === 'summer' && (
            <img src="/summer-cumulonimbus.svg" alt="" width="480" height="340" />
          )}
          {season === 'spring' && (
            <img
              src={index % 3 === 0 ? '/sakura-blossom.svg' : '/sakura-petal.svg'}
              alt=""
              width="100"
              height="100"
            />
          )}
          {season === 'autumn' && (
            <img
              src={index % 2 === 0 ? '/ginkgo-leaf.svg' : '/maple-leaf.svg'}
              alt=""
              width="100"
              height="116"
            />
          )}
        </span>
      ))}
    </div>
  );
}
