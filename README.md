# 英語熟語学習アプリ

英語の熟語を楽しく学習するためのウェブアプリケーションです。

## 機能

- 英語の熟語を表示
- 回答者が考えて答えを確認
- 回答表示ボタンで答えを表示
- 次の問題に進むボタンで次の熟語へ
- 難易度別の分類（初級・中級・上級）
- 美しいモダンなUI
- **動的スクレイピング機能**: 新しい問題を10問ずつ取得

## 技術スタック

- **フロントエンド**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **スクレイピング**: Node.js標準ライブラリ
- **APIサーバー**: Node.js HTTPサーバー

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

#### 基本モード（静的データ）
```bash
npm run dev
```

#### フルモード（動的スクレイピング機能付き）
```bash
npm run dev:full
```

### 3. 動的スクレイピング機能

#### APIサーバーのみ起動
```bash
npm run api
```

#### スクレイピングの実行（静的データ生成）
```bash
npm run scrape
```

## デプロイ

### Renderでのデプロイ

1. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Renderでデプロイ**
   - [Render](https://render.com/)にアクセス
   - GitHubアカウントでログイン
   - "New +" → "Blueprint"を選択
   - GitHubリポジトリを選択
   - `render.yaml`ファイルが自動で認識される
   - "Apply"をクリック

3. **デプロイ完了**
   - フロントエンド: `https://study-english-idiom-frontend.onrender.com`
   - APIサーバー: `https://study-english-idiom-api.onrender.com`

## 動的スクレイピング機能

- **1回10問取得**: 毎回10個の新しい熟語を取得します
- **画面更新時に自動取得**: ページをリロードするたびに新しい熟語が表示されます
- **難易度別フィルタリング**: 選択した難易度に応じて適切な熟語を取得
- **手動更新**: 「新しい問題を取得」ボタンでいつでも新しい熟語を取得
- **APIサーバー**: 独立したAPIサーバーで安定したデータ提供

## プロジェクト構造

```
study-english-idiom/
├── src/
│   ├── components/
│   │   ├── IdiomCard.tsx           # 熟語カードコンポーネント
│   │   ├── DifficultyFilter.tsx    # 難易度フィルター
│   │   └── DynamicIdiomLoader.tsx  # 動的スクレイピング機能
│   ├── data/
│   │   ├── idioms.ts               # サンプル熟語データ
│   │   └── scraped-idioms.ts       # スクレイピングで取得したデータ
│   ├── services/
│   │   └── api.ts                  # APIクライアント
│   ├── types/
│   │   └── idiom.ts                # 型定義
│   ├── App.tsx                     # メインアプリコンポーネント
│   ├── main.tsx                    # エントリーポイント
│   └── index.css                   # スタイル
├── scripts/
│   ├── scrape-idioms-legacy.js     # 静的スクレイピングスクリプト
│   ├── dynamic-scraper.js          # 動的スクレイピングデータ
│   └── api-server.js               # APIサーバー
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── render.yaml                     # Render設定ファイル
└── README.md
```

## スクレイピングについて

このアプリでは、英語の熟語データを以下の方法で取得しています：

1. **サンプルデータ**: 基本的な熟語が含まれています
2. **静的スクレイピング**: 外部サイトから熟語を自動取得（事前生成）
3. **動的スクレイピング**: APIサーバーを通じてリアルタイムで新しい熟語を取得

### スクレイピングの制限事項

- 一部のサイトではスクレイピングが制限されている場合があります
- サイトの構造変更によりスクレイピングが失敗する可能性があります
- 利用規約を確認してからスクレイピングを実行してください

## カスタマイズ

### 新しい熟語の追加

`src/data/idioms.ts` ファイルに新しい熟語を追加できます：

```typescript
{
  id: '11',
  english: 'New Idiom',
  japanese: '新しい熟語の意味',
  example: 'Example sentence.',
  explanation: '詳しい説明',
  difficulty: 'easy' // 'easy', 'medium', 'hard'
}
```

### スタイルの変更

`tailwind.config.js` でカラーテーマやスタイルをカスタマイズできます。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します！ 