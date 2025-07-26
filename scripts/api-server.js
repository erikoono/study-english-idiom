const http = require('http');
const url = require('url');
const { getRandomIdioms, getRandomIdiomsByDifficulty, fetchNewIdiomsFromAPI } = require('./dynamic-scraper');

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

    } else if (path === '/api/health' && req.method === 'GET') {
      // ヘルスチェック
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        status: 'healthy',
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
  console.log(`動的スクレイピングAPIサーバーが起動しました: http://localhost:${PORT}`);
  console.log('利用可能なエンドポイント:');
  console.log('  GET /api/idioms?count=10&difficulty=medium');
  console.log('  GET /api/idioms/refresh');
  console.log('  GET /api/health');
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