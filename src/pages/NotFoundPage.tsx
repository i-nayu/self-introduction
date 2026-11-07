import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="site-page">
      <h1>ページが見つかりません</h1>
      <p>URLを確認するか、Homeに戻ってください。</p>
      <Link to="/">Homeへ戻る</Link>
    </main>
  );
}
