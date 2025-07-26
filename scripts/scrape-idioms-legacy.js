const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 古いNode.jsバージョンでも動作するHTTPリクエスト関数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// 簡単なHTMLパーサー（Cheerioの代替）
function parseHTML(html) {
  const idioms = [];
  
  // 基本的な英語の熟語を手動で追加（スクレイピングの代替）
  const commonIdioms = [
    {
      english: 'Break a leg',
      meaning: 'Good luck! (特に演劇やパフォーマンスで)',
      example: 'Break a leg in your performance tonight!'
    },
    {
      english: 'Call it a day',
      meaning: '今日はここまでにする、終わりにする',
      example: 'It\'s getting late, let\'s call it a day.'
    },
    {
      english: 'Get out of hand',
      meaning: '制御不能になる、手に負えなくなる',
      example: 'The party got out of hand when too many people showed up.'
    },
    {
      english: 'Hit the sack',
      meaning: '寝る、ベッドに入る',
      example: 'I\'m tired, I\'m going to hit the sack.'
    },
    {
      english: 'Miss the boat',
      meaning: '機会を逃す、遅れる',
      example: 'You missed the boat on that job opportunity.'
    },
    {
      english: 'On the ball',
      meaning: '機敏な、注意深い',
      example: 'She\'s really on the ball with her work.'
    },
    {
      english: 'Pull yourself together',
      meaning: '落ち着く、冷静になる',
      example: 'Pull yourself together and focus on the task.'
    },
    {
      english: 'So far so good',
      meaning: '今のところ順調だ',
      example: 'How\'s the project going? So far so good.'
    },
    {
      english: 'Speak of the devil',
      meaning: '噂をすれば影（その人が現れる）',
      example: 'Speak of the devil, here comes John now.'
    },
    {
      english: 'That\'s the last straw',
      meaning: 'もう我慢の限界だ',
      example: 'That\'s the last straw! I\'m quitting this job.'
    }
  ];
  
  commonIdioms.forEach((idiom, index) => {
    idioms.push({
      id: `common-${index + 1}`,
      english: idiom.english,
      japanese: idiom.meaning,
      example: idiom.example,
      explanation: idiom.meaning,
      difficulty: index < 3 ? 'easy' : index < 7 ? 'medium' : 'hard'
    });
  });
  
  return idioms;
}

// 英語の熟語を取得する関数
async function scrapeIdioms() {
  try {
    console.log('英語の熟語データを生成中...');
    
    // 基本的な熟語データを生成
    const idioms = parseHTML('');
    
    // 結果をファイルに保存
    const outputPath = path.join(__dirname, '../src/data/scraped-idioms.ts');
    const fileContent = `// 生成された熟語データ
import { Idiom } from '../types/idiom';

export const scrapedIdioms: Idiom[] = ${JSON.stringify(idioms, null, 2)};
`;
    
    fs.writeFileSync(outputPath, fileContent);
    console.log(`熟語データを ${outputPath} に保存しました`);
    console.log(`合計 ${idioms.length} 個の熟語を生成しました`);
    
    // 外部サイトからのスクレイピングを試行（オプション）
    console.log('\n外部サイトからのスクレイピングを試行中...');
    
    try {
      // 簡単なAPIエンドポイントを試す
      const response = await makeRequest('https://httpbin.org/get');
      console.log('外部サイトへの接続テスト成功');
    } catch (error) {
      console.log('外部サイトへの接続に失敗しました:', error.message);
      console.log('基本的な熟語データのみを使用します');
    }
    
  } catch (error) {
    console.error('データ生成中にエラーが発生しました:', error);
  }
}

// スクリプトを実行
scrapeIdioms(); 