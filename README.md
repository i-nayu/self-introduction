# React + TypeScript + Vite

このテンプレートは、ViteでReactを動作させるための最小構成です。
HMR（ホットリロード）と基本的なESLint設定が含まれています。

---

## 🚀 アプリのバージョン切り替え

このプロジェクトは複数のアプリバージョンに対応しています。

### 📁 ファイル構成

* src/versions/AppV1.tsx
* src/versions/AppV2.tsx
* src/appVersions.ts（バージョン管理）
* src/App.tsx（切り替え用）

### 🔁 切り替え方法

* デフォルト変更
  → src/appVersions.ts の DEFAULT_APP_VERSION を編集

* 一時的に切り替え
  → URLに以下を追加

?v=v1

または

?v=v2

---

## 🔌 利用可能なプラグイン

* @vitejs/plugin-react（Oxc使用）
* @vitejs/plugin-react-swc（SWC使用）

---

## ⚙️ React Compiler

このテンプレートでは、開発・ビルド速度への影響を考慮して
React Compilerは無効になっています。

導入方法：
https://react.dev/learn/react-compiler/installation

---

## 🧹 ESLint設定（本番向け）

型チェックを含めたLint設定にする場合：

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // より厳しくする場合
      // tseslint.configs.strictTypeChecked,
      // スタイルルール追加
      // tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

---

## 🧩 React用ESLintプラグイン

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

---

## 💡 メモ

* 本番では型チェック付きESLint推奨
* SWCの方が高速
* バージョン切り替えで検証しやすい構成

---
