import type { InternshipExperience } from '../types/content';

// 公開ページには会社名・サービス名を含めず、担当した内容に絞って紹介する。
export const INTERNSHIPS: readonly InternshipExperience[] = [
  {
    id: 'frontend-development',
    title: 'フロントエンドの機能開発',
    duration: '5日間',
    role: 'フロントエンド担当',
    summary: '利用者からの改善要望をもとに、新しい機能の要件整理から画面設計・実装まで担当しました。',
    technologies: ['Ruby'],
    contributions: [
      '入力項目の必要性や対象範囲をチームに確認し、要件定義書と設計書を作成',
      '実装後にPRを作成し、レビューで受けた指摘を確認・修正',
    ],
    learning: '目の前の機能だけでなく、後から機能が増えても複雑になりにくい画面構成を考える大切さを学びました。',
  },
  {
    id: 'data-analysis',
    title: 'データ分析と結果の発表',
    duration: '1日',
    role: '分析・発表を担当',
    summary: '提供されたデータをペアで調べ、分析テーマを決めて結果を発表しました。',
    technologies: ['Python'],
    contributions: [
      'まず複数の切り口からデータを確認し、分かったことをペアと共有',
      '深掘りできるテーマを選び、追加の分析と結果の整理を実施',
    ],
    learning: '最初から結論を決めずにデータを探索し、得られた情報から問いを絞る進め方を経験しました。',
  },
  {
    id: 'feature-development',
    title: '要望をもとにした機能追加',
    duration: '3日間',
    role: '機能開発を担当',
    summary: '関係者の要望を整理し、既存のコード構成を読み解きながら機能追加に取り組みました。',
    technologies: ['Ruby', 'Rails', 'PostgreSQL'],
    contributions: [
      '要望と実装方針を段階ごとに整理し、メンターへレビューを依頼',
      'PRでは変更したファイルの役割と変更理由をまとめ、説明できる形に改善',
    ],
    learning: '実装が動くだけで終わらせず、自分の変更内容とその理由を理解して伝えることを意識するようになりました。',
  },
  {
    id: 'collaborative-web-development',
    title: 'アンケートサイトの機能追加',
    duration: '3日間',
    role: 'チーム開発に参加',
    summary: '提示された追加機能を、チームで実装方法を相談しながらアンケートサイトに追加しました。',
    technologies: ['React', 'TypeScript', 'CSS'],
    contributions: [
      '追加する機能の実装方法をチームで相談',
      'AIを使用せず、チームで機能追加に取り組んだ',
    ],
    learning: '機能の内容が決まっている場合でも、実装方法を自分たちで考えて進める経験をしました。',
  },
  {
    id: 'maintenance-and-operations',
    title: '既存画面の修正と運用作業',
    duration: '約1か月',
    role: '開発チームに参加',
    summary: 'ファイルの取り込み画面で発生するエラーを調査・修正し、環境更新に向けた準備にも取り組みました。',
    technologies: ['Java', 'AWS', 'Terraform'],
    contributions: [
      '実際の入力データで問題を確認し、原因を調べて画面の修正と追加対応を実施',
      '環境更新の作業手順書とPRを作成し、期間内に完了しなかった後続作業を引き継ぎ',
    ],
    learning: 'レビューで不明点を確認しながら、変更の検証や引き継ぎまで含めて進める実務の流れを学びました。',
  },
];
