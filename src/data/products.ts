import type { Product } from '../types/content';

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'arrow',
    title: 'ARROW（JPHACKS 2025）',
    imageUrl: '/ARROW.png',
    technologies: ['React', 'CSS', 'TypeScript', 'JavaScript'],
    description: 'イベントを誰もが見逃すことなく手軽に参加・運営できるWebアプリケーションです。イベント開催に必要な手順の多さと、それが生む参加・運営の障壁を減らすことを目指しています。',
    githubUrl: 'https://github.com/jphacks/os_2508',
    featured: true,
  },
  {
    slug: 'trustoken',
    title: 'TrusToken（KC3Hack 2026）',
    imageUrl: '/TrusToken.jpg',
    technologies: ['React', 'CSS', 'TypeScript', 'JavaScript', 'Blockchain (Symbol)'],
    description: '「信頼」をテーマに、コミュニティごとにトークンを発行・管理・取引できる、ブロックチェーンを使用したWebアプリケーションです。',
    githubUrl: 'https://github.com/kc3hack/2026_team3',
    featured: true,
  },
  {
    slug: 'touction',
    title: 'Touction（NEMTUS Hackathon）',
    imageUrl: '/Touction.png',
    technologies: ['React', 'CSS', 'TypeScript', 'JavaScript', 'Blockchain (Symbol)'],
    description: 'Symbolテストネットを使った写真トーナメントとオークションのアプリです。写真の投稿、投票、オークションへの入札・購入ができます。',
    githubUrl: 'https://github.com/i-nayu/Touction',
    featured: true,
  },
  {
    slug: 'clipboard-app',
    title: 'ClipboardApp（個人開発）',
    imageUrl: '/ClipboardApp.png',
    technologies: ['Swift'],
    description: 'macOS向けのクリップボード履歴管理アプリです。バックグラウンドでコピー内容を監視し、ショートカットキーで履歴を呼び出せます。',
    githubUrl: 'https://github.com/i-nayu/ClipboardApp',
    featured: false,
  },
  {
    slug: 'gagaku-welcome',
    title: 'gagaku_welcome（個人開発）',
    imageUrl: '/IMG_7029.jpg',
    technologies: [], // 既存の技術一覧は別作品と同一のため、確認後に記載する
    description: '', // 既存の説明はTouctionの複製のため、確認後に記載する
    siteUrl: 'https://gagakuwelcome.vercel.app',
    githubUrl: 'https://github.com/i-nayu/gagaku_welcome',
    featured: false,
  },
  {
    slug: 'remical',
    title: 'RemiCal（個人開発・開発中）',
    imageUrl: '/IMG_7030.jpg',
    technologies: [], // 既存の技術一覧は別作品と同一のため、確認後に記載する
    description: '画像やファイルから予定情報を認識し、予定を登録できるカレンダーLINE botです。',
    githubUrl: 'https://github.com/i-nayu/RemiCal',
    featured: false,
  },
];
