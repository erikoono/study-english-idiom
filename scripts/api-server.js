const http = require('http');
const url = require('url');
const { getRandomIdioms, getRandomIdiomsByDifficulty, fetchNewIdiomsFromAPI } = require('./dynamic-scraper');
const { generateFallbackWords } = require('./word-generator-fallback');
const { generateRandomWordsFromAPI, getAPIStatistics } = require('./external-word-api');

const PORT = process.env.PORT || 3001;

// CORSヘッダーを設定
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Pragma, Expires',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// APIサーバーを作成
const server = http.createServer(async (req, res) => {
  // CORSプリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  try {
    if (path === '/api/idioms' && req.method === 'GET') {
      // ランダムな熟語を取得
      const count = parseInt(parsedUrl.query.count) || 10;
      const difficulty = parsedUrl.query.difficulty;
      
      let idioms;
      if (difficulty && difficulty !== 'all') {
        idioms = getRandomIdiomsByDifficulty(difficulty, count);
      } else {
        idioms = getRandomIdioms(count);
      }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        data: idioms,
        timestamp: new Date().toISOString()
      }));

    } else if (path === '/api/idioms/refresh' && req.method === 'GET') {
      // 新しい熟語を取得（模擬APIコール）
      const newIdioms = await fetchNewIdiomsFromAPI();
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        data: newIdioms,
        timestamp: new Date().toISOString(),
        message: '新しい熟語を取得しました'
      }));

    } else if (path === '/api/words' && req.method === 'GET') {
      // 外部APIからランダムな単語を取得
      const count = parseInt(parsedUrl.query.count) || 10;
      const difficulty = parsedUrl.query.difficulty || 'all';
      const useExternal = parsedUrl.query.external !== 'false'; // デフォルトで外部API使用
      
      try {
        let words;
        if (useExternal) {
          // 外部API使用
          words = await generateRandomWordsFromAPI(count, difficulty);
          if (words.length === 0) {
            throw new Error('外部APIから単語を取得できませんでした');
          }
        } else {
          // 内部データベース使用（フォールバック）
          words = generateFallbackWords(count, difficulty);
        }

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({
          success: true,
          data: words,
          source: useExternal ? 'external-api' : 'internal-database',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('単語取得エラー:', error.message);
        
        // フォールバック: 軽量内部データベースを使用
        console.log('フォールバックで軽量内部データベースを使用します');
        try {
          const fallbackWords = generateFallbackWords(count, difficulty);
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({
            success: true,
            data: fallbackWords,
            source: 'internal-database-fallback',
            warning: '外部APIが利用できないため、内部データベースを使用しました',
            timestamp: new Date().toISOString()
          }));
        } catch (fallbackError) {
          throw fallbackError; // フォールバックも失敗した場合
        }
      }

    } else if (path === '/api/words/refresh' && req.method === 'GET') {
      // 外部APIから新しい単語を取得
      const useExternal = parsedUrl.query.external !== 'false';
      
      try {
        let newWords;
        if (useExternal) {
          newWords = await generateRandomWordsFromAPI(10, 'all');
          if (newWords.length === 0) {
            throw new Error('外部APIから単語を取得できませんでした');
          }
        } else {
          newWords = generateFallbackWords(10, 'all');
        }
        
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({
          success: true,
          data: newWords,
          source: useExternal ? 'external-api' : 'internal-database',
          timestamp: new Date().toISOString(),
          message: '新しい単語を取得しました'
        }));
      } catch (error) {
        console.error('単語更新エラー:', error.message);
        
        // フォールバック: 軽量内部データベースを使用
        console.log('フォールバックで軽量内部データベースを使用します');
        const fallbackWords = generateFallbackWords(10, 'all');
        
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({
          success: true,
          data: fallbackWords,
          source: 'internal-database-fallback',
          warning: '外部APIが利用できないため、内部データベースを使用しました',
          timestamp: new Date().toISOString(),
          message: '新しい単語を取得しました（内部データベース使用）'
        }));
      }

    } else if (path === '/api/health' && req.method === 'GET') {
      // ヘルスチェック
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
      }));

    } else if (path === '/api/stats' && req.method === 'GET') {
      // 統計情報
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        data: getAPIStatistics(),
        timestamp: new Date().toISOString()
      }));

    } else {
      // 404エラー
      res.writeHead(404, corsHeaders);
      res.end(JSON.stringify({
        success: false,
        error: 'Endpoint not found'
      }));
    }

  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`英語学習APIサーバーが起動しました: http://localhost:${PORT}`);
  console.log('利用可能なエンドポイント:');
  console.log('  GET /api/idioms?count=10&difficulty=medium');
  console.log('  GET /api/idioms/refresh');
  console.log('  GET /api/words?count=10&difficulty=medium&external=true');
  console.log('  GET /api/words/refresh?external=true');
  console.log('  GET /api/stats');
  console.log('  GET /api/health');
  console.log('');
  console.log('外部API統合機能:');
  console.log('  - Free Dictionary API統合済み');
  console.log('  - 自動フォールバック機能');
  console.log('  - インメモリキャッシュ');
});

// エラーハンドリング
server.on('error', (error) => {
  console.error('サーバーエラー:', error);
});

process.on('SIGINT', () => {
  console.log('\nサーバーを停止中...');
  server.close(() => {
    console.log('サーバーが停止しました');
    process.exit(0);
  });
}); 