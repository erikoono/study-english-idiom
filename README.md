# 英語学習アプリ

英語の熟語・単語を楽しく学習するためのウェブアプリケーションです。

## 機能

### 🔤 学習コンテンツ
- **熟語学習**: 英語の熟語（イディオム）とその意味・例文
- **単語学習**: 英単語の定義・発音・品詞・例文・類義語・対義語

### 📚 学習機能
- コンテンツタイプ切り替え（熟語/単語）
- 回答者が考えて答えを確認
- 回答表示ボタンで答えを表示
- 次の問題に進むボタンで次の問題へ
- 難易度別の分類（初級・中級・上級）
- 美しいモダンなUI

### 🔄 動的コンテンツ取得
- **動的スクレイピング機能**: 新しい熟語を10問ずつ取得
- **外部辞書API統合**: Free Dictionary APIから単語データを取得
- **フォールバック機能**: API障害時の軽量内部データベース
- **インメモリキャッシュ**: パフォーマンス最適化

## 技術スタック

- **フロントエンド**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **スクレイピング**: Node.js標準ライブラリ
- **APIサーバー**: Node.js HTTPサーバー
- **外部API**: Free Dictionary API
- **キャッシュ**: インメモリLRUキャッシュ

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

## 動的コンテンツ取得機能

### 🎯 熟語取得機能
- **1回10問取得**: 毎回10個の新しい熟語を取得します
- **画面更新時に自動取得**: ページをリロードするたびに新しい熟語が表示されます
- **難易度別フィルタリング**: 選択した難易度に応じて適切な熟語を取得
- **手動更新**: 「新しい問題を取得」ボタンでいつでも新しい熟語を取得

### 📖 単語取得機能
- **外部辞書API**: Free Dictionary APIから豊富な単語データを取得
- **完全な辞書情報**: 定義・発音・品詞・例文・類義語・対義語
- **インテリジェントキャッシュ**: 取得済み単語をメモリキャッシュで高速化
- **自動フォールバック**: API障害時は内部データベースを使用
- **レベル別単語リスト**: 学習レベルに応じた適切な単語選択

### ⚙️ 技術的特徴
- **APIサーバー**: 独立したAPIサーバーで安定したデータ提供
- **エラーハンドリング**: 堅牢な例外処理とフォールバック機能
- **パフォーマンス最適化**: 並行処理とキャッシュによる高速化

## プロジェクト構造

```
study-english-idiom/
├── src/
│   ├── components/
│   │   ├── StudyCard.tsx           # 統合学習カードコンポーネント
│   │   ├── ContentTypeTab.tsx      # コンテンツタイプ選択タブ
│   │   ├── DifficultyFilter.tsx    # 難易度フィルター
│   │   ├── DynamicIdiomLoader.tsx  # 動的熟語取得機能
│   │   └── DynamicWordLoader.tsx   # 動的単語取得機能
│   ├── data/
│   │   ├── idioms.ts               # サンプル熟語データ
│   │   ├── scraped-idioms.ts       # スクレイピングで取得したデータ
│   │   └── learningContent.ts      # 統合学習コンテンツ定義
│   ├── hooks/
│   │   ├── useStudyContent.ts      # 学習コンテンツ統合フック
│   │   ├── useIdioms.ts            # 熟語管理フック
│   │   └── useErrorHandler.ts      # エラーハンドリングフック
│   ├── services/
│   │   └── api.ts                  # APIクライアント
│   ├── types/
│   │   ├── idiom.ts                # 熟語型定義
│   │   └── learningItem.ts         # 学習アイテム型定義
│   ├── App.tsx                     # メインアプリコンポーネント
│   ├── main.tsx                    # エントリーポイント
│   └── index.css                   # スタイル
├── scripts/
│   ├── api-server.js               # 統合APIサーバー
│   ├── dynamic-scraper.js          # 動的スクレイピングデータ
│   ├── external-word-api.js        # 外部辞書API統合
│   └── word-generator-fallback.js  # フォールバック単語データ
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── render.yaml                     # Render設定ファイル
└── README.md
```

## データ取得について

このアプリでは、英語学習コンテンツを以下の方法で取得しています：

### 🎯 熟語データ取得
1. **サンプルデータ**: 基本的な熟語が含まれています
2. **静的スクレイピング**: 外部サイトから熟語を自動取得（事前生成）
3. **動的スクレイピング**: APIサーバーを通じてリアルタイムで新しい熟語を取得

### 📖 単語データ取得
1. **Free Dictionary API**: 公式辞書APIから詳細な単語情報を取得
2. **フォールバック辞書**: API障害時用の軽量内部データベース
3. **インテリジェントキャッシュ**: 取得済み単語の高速アクセス

### 制限事項と注意事項

- 一部のサイトではスクレイピングが制限されている場合があります
- サイトの構造変更によりスクレイピングが失敗する可能性があります
- 外部API利用時はネットワーク接続が必要です
- 利用規約を確認してからスクレイピングを実行してください

## カスタマイズ

### 🎯 新しい熟語の追加

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

### 📖 フォールバック単語の追加

`scripts/word-generator-fallback.js` でオフライン用の単語データを追加できます：

```javascript
{
  english: 'example',
  japanese: '例、見本',
  partOfSpeech: 'noun',
  pronunciation: '/ɪɡˈzæmpəl/',
  definition: 'A thing characteristic of its kind',
  exampleSentences: ['This is a good example.'],
  synonyms: ['instance', 'sample'],
  antonyms: [],
  difficulty: 'medium'
}
```

### 🎨 スタイルの変更

`tailwind.config.js` でカラーテーマやスタイルをカスタマイズできます。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します！ 