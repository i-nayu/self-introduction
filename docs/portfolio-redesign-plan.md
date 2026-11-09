# ポートフォリオ改修計画

この文書は、サイトの改修を小さなPRに分けて進めるための作業計画です。実装中に内容を見直して構いませんが、各PRの目的を一つに絞り、`develop`で動く状態を保ちます。

## 決定済みの方針

- 最終的なサイトは一つに統一し、`?v=v1/v2`による切り替えと旧画面は廃止する。
- サイト内の表記は「Products」に統一する。「Works」「View Works」「RiST」は表示しない。
- Homeにターミナル風の仕掛けを残す。
- 実在・経験を確認できない経歴、技術、制作物の説明、リンクは推測で補わない。
- PRは小さく分け、`feature/*`から`develop`へ、全体が完成してから`develop`から`main`へマージする。

## デザイン案

### テーマ

「飛行機雲と澄み渡る夏空」。明るい背景、十分な余白、青のグラデーション、控えめな円やラインを使う。装飾よりも文章・制作物・操作の見つけやすさを優先する。

| 用途 | 色 |
| --- | --- |
| 背景 | `#F0F9FF` |
| 淡い面・グラデーション | `#BAE6FD` |
| 補助アクセント | `#38BDF8` |
| 見出し・主要ボタン | `#1D4ED8` |

本文には読みやすさを確保できる濃い青系の文字色を補助的に使う。`#38BDF8`のような明るい青を、小さな文字の色として使わない。

- フォントは明朝体ではなく、日本語も読みやすいゴシック系に統一する。ターミナル内部のみ等幅フォントを使う。
- 共通ヘッダーからHome / Profile / Skills / Productsへ移動できるようにする。現在地を明示する。
- Productsは画像・名前・短い説明・技術が読み取れるグリッドにし、実在する公開サイトやGitHubへ直接つなぐ。
- スマートフォンでは横並びを縦に並べ替え、メニュー・カード・ターミナルが画面からはみ出さないようにする。
- 動きはページ表示の短いフェード、カードのわずかな浮き上がり、ターミナルのカーソル点滅程度に抑える。`prefers-reduced-motion`では動きを止める。
- キーボード操作、フォーカス表示、文字のコントラスト、画像の代替テキストを確認する。

### ページ構成

| URL | 主な内容 |
| --- | --- |
| `/` | ヒーロー、自己紹介の要約、注目のProducts 3件、ターミナル |
| `/about` | 写真または代替ビジュアル、所属、関心分野、SNS |
| `/skills` | Frontend / Backend / Other。可能なら関連Productsも示す |
| `/products` | 制作物の一覧 |
| その他 | 404ページとHomeへの戻り口 |

作品ごとの詳細ページは現時点では設けず、一覧だけで情報を確認できるようにする。将来、担当・課題と工夫・制作過程など、一覧に収まらない確認済みの内容ができた作品について追加を検討する。

Homeの注目作品と一覧は`src/data/products.ts`を共通の情報源とする。Skillsも`src/data/skills.ts`を参照する。Backendなど掲載情報は本人が確認した内容のみ採用する。

## ブランチとPRの流れ

```text
main（本番）
  └─ develop（各作業の統合先・プレビュー）
       ├─ feature/content-data
       ├─ feature/quality-gates
       ├─ feature/routing-layout
       ├─ feature/products
       ├─ feature/home-profile
       ├─ feature/skills
       ├─ feature/terminal
       ├─ feature/e2e
       └─ feature/polish
```

1. 新しい`feature/*`は、その時点の最新の`develop`から切る。先行PRが未マージなら、原則としてその内容に依存する次のブランチを切らない。
2. 各PRの宛先は`develop`。PR本文に目的、変更点、確認方法、未解決事項を書く。
3. CIとレビューを確認してからマージする。`develop`へ直接作業コミットを積まない。
4. 全機能と公開プレビューを確認してから、`develop`から`main`へのリリースPRを作る。

`feature/content-data`は実装済みで、[PR #1](https://github.com/i-nayu/self-introduction/pull/1)を`develop`向けに作成済み。以下はその次からの予定であり、ブランチ名や順序は必要に応じて見直す。

## 各ブランチの具体的な作業

### 1. `feature/content-data` — 掲載データの整理（実装済み）

- プロフィール・Skills・Productsを型付きデータへ分離する。
- ProductにURL用の`slug`とHome掲載用の`featured`を持たせる。
- 既存の誤った複製文や未確認の技術を、事実として転載しない。
- 完了条件：ビルド・Lintが通り、slugの重複と画像パスを確認できる。

### 2. `feature/quality-gates` — 最初の自動チェック

- テスト実行環境（候補：Vitest）と`npm run test`を追加する。
- まずデータの不変条件をテストする。例：slugが一意、注目作品が3件、必要なフィールドが揃っている。
- `.github/workflows/ci.yml`を追加し、`develop`と`main`向けPRで`npm ci`、Lint、テスト、ビルドを実行する。
- PRのGitHub Actionsが成功することを確認してから、`develop`と`main`の必須チェックを設定する。チェック名は一意にする。
- 完了条件：ローカルとPR上で同じチェックが実行され、失敗を検知できる。

### 3. `feature/routing-layout` — ページの土台

- React Routerで共通レイアウト、ヘッダー、フッター、各URL、404ページを用意する。
- 夏空配色とゴシック系フォントを共通のデザイントークンとして定義する。
- 既存のプロフィール・制作物情報を新しいページへ移してから、v1/v2画面と`?v=`切り替えを削除する。
- ターミナルはHomeに残し、少なくとも既存コマンドが誤ったページ内要素を参照しないようにする。コマンド全体の整理は`feature/terminal`で行う。
- 完了条件：各URLを直接開け、ナビゲーションで移動でき、画面が空にならない。

### 4. `feature/products` — 制作物の一覧

- 共通Productデータから一覧カードを描画する。Homeの注目カードは次のブランチで扱う。
- 公開サイトURLなどがない場合はリンクを表示しない。個別の詳細URLは作らない。
- 画像サイズ・代替テキスト・スマートフォンのグリッド表示を整える。
- 完了条件：全Productが一覧で確認でき、設定された外部リンクだけが表示される。

### 5. `feature/home-profile` — HomeとProfile

- Homeのヒーロー、自己紹介の要約、注目作品3件を完成させる。
- Profileに写真、所属、興味分野、SNSリンクを配置する。
- 既存データと本人が確認した内容だけを表示し、「View Works」や「RiST」を復活させない。
- 旧Homeを置き換えると、ターミナルの`cd`が参照していたページ内セクションと、`open`が参照していた旧SNSボタンがなくなる。ターミナルを残したまま既存の操作を壊さないため、この段階で`cd`を各ページへの移動、`open`をプロフィールデータのSNSリンク参照に変更する。コマンド全体の整理は7で行う。
- 旧画面を削除すると`versions`にはTerminalだけが残るため、再利用する部品として`src/components/Terminal`へ移す。
- 完了条件：両ページの導線と外部リンクを確認できる。

### 6. `feature/skills` — 技術の見せ方

- Frontend / Backend / Otherを分け、単なるタグ一覧ではなく経験の文脈が伝わる構成にする。
- 関連するProductがあればリンクする。習熟度バーなど、根拠のない評価は付けない。
- 未確認の技術は追加しない。空カテゴリの扱いは公開前に決める。
- 完了条件：カテゴリと掲載内容が本人の経験と一致する。

### 7. `feature/terminal` — ターミナルの内部整理とテスト

- 5で済ませた`cd`のページ移動と`open`のSNSリンク参照は維持し、ここではコマンド判定をターミナルの表示部分から分離する。
- `help`、`hello`、`cd`、`ls`、`echo`、`history`、`open`、`clear`の入力とエラー時の案内を整理する。任意のシェルコマンドは実行せず、許可した操作だけを扱う。
- コマンド解析の単体テストと、キーボード・小画面での操作確認を追加する。
- 完了条件：案内される全コマンドが意図した動作をする。

### 8. `feature/e2e` — ブラウザでの動作確認

- E2Eテスト環境（候補：Playwright）を追加する。
- Homeから各ページへの移動、Products一覧と外部リンク、存在しないURL、ターミナルの移動を確認する。
- CIで安定して動く最小限のスモークテストから始め、見た目のスナップショットは必要性を判断してから導入する。
- 完了条件：主要なユーザー操作がPR上のCIで再現・検証できる。

### 9. `feature/polish` — 表示・アクセシビリティ・公開前確認

- 軽いアニメーションと`prefers-reduced-motion`対応を実装する。
- スマートフォン表示、キーボード操作、色のコントラスト、画像、リンク、404表示を確認する。
- VercelのプレビューURLで実機に近い確認を行う。問題がなければ`develop`から`main`へリリースPRを作る。
- 完了条件：CIが成功し、主要画面とプレビューを確認できる。

## Codexレビュー・CI/CDの位置づけ

- **Codexレビュー**：リポジトリをCodexに接続し、まずPRコメントの`@codex review`で試す。運用が合えば自動レビューを有効にする。`AGENTS.md`に固有のレビュー規則を追加する場合は、掲載内容の事実確認やターミナルの許可操作など、機械的なテストでは表しにくい少数の規則に絞る。Codexレビューはテストや必須チェックの代わりにはしない。
- **CI**：GitHub Actionsでテスト・Lint・ビルドをPRごとに実行する。`npm test`は現時点では未定義なので、`feature/quality-gates`で整備する。
- **CD**：現状のPRにはVercelの成功チェックが付いている。VercelのGit連携を活かし、`main`が本番ブランチ、`develop`と`feature/*`がプレビューになる設定を確認する。重複するGitHub Actionsのデプロイ処理は、必要になるまで追加しない。
- **マージ保護**：CIのチェック名が実際にGitHub上へ現れてから、`develop`と`main`で必須チェックを設定する。個人開発で他の承認者がいない場合は、必須の他者承認を安易に設定しない。

参考：[CodexのGitHubレビュー](https://learn.chatgpt.com/docs/third-party/github) / [GitHub ActionsのNode.js CI](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs) / [GitHubのブランチ保護](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) / [VercelのGitデプロイ](https://vercel.com/docs/git)
