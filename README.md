# Portfolio

プロフィール、使用技術、制作物を紹介するポートフォリオサイトです。
通常のページ移動に加え、ターミナルへのコマンド入力でもサイトを操作できます。

[公開サイトを見る](https://self-introduction-ochre.vercel.app/)

## 主な機能

- プロフィール、使用技術、インターン経験、制作物の紹介
- 制作物の公開サイト・紹介ページ・GitHubへのリンク
- ターミナルのコマンドによるページ移動や外部リンクの表示
- 季節に応じた背景装飾と配色の切り替え
- スマートフォンに対応したレイアウト
- 「動きを減らす」設定に対応したアニメーションの停止

## 使用技術

| 用途 | 技術 |
| --- | --- |
| UI | React |
| 言語 | TypeScript |
| 開発・ビルド | Vite |
| ルーティング | React Router |
| ターミナル | xterm.js |
| アイコン | React Icons |
| 単体テスト | Vitest |
| E2Eテスト | Playwright |
| 静的解析 | ESLint |
| CI | GitHub Actions |
| ホスティング | Vercel |

## ターミナルの使い方

ホーム画面のターミナルをクリックすると、コマンドを入力できます。

| コマンド | 動作 |
| --- | --- |
| `help` | 使用できるコマンドを表示 |
| `hello` | 挨拶を表示 |
| `ls` | ページ一覧を表示 |
| `cd about` | Profileへ移動 |
| `cd skills` | Skillsへ移動 |
| `cd products` | Productsへ移動 |
| `open github` | GitHubを開く |
| `open x` | Xを開く |
| `echo <text>` | 入力した文字列を表示 |
| `history` | コマンド履歴を表示 |
| `clear` | 表示をクリア |

左右の矢印キーでカーソルを移動でき、上下の矢印キーで履歴を参照できます。
Home／Endキーで入力の先頭・末尾へ移動できます。


## ディレクトリ構成

```text
src/
├── components/   # 共通UI、季節の装飾、ターミナル
├── data/         # プロフィール、制作物、スキルなどのデータ
├── pages/        # 各ページ
├── types/        # コンテンツの型定義
└── SiteLayout.tsx # 共通レイアウト

public/           # 画像、SVG、ライセンス表記
tests/            # 単体テスト
e2e/              # E2Eテスト
.github/workflows/ # CIの設定
```


## 使用素材・ライセンス表記

使用しているアイコンなどのライセンス情報は、
`public/THIRD_PARTY_NOTICES.txt` に記載しています。
