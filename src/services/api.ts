import { Idiom } from '../types/idiom';

// 本番環境ではRenderのAPIサーバーを使用、開発環境ではlocalhost
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://study-english-idiom-api.onrender.com/api'
  : 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
  message?: string;
}

// ランダムな熟語を取得
export async function fetchRandomIdioms(count: number = 10, difficulty?: string): Promise<Idiom[]> {
  try {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    if (difficulty && difficulty !== 'all') {
      params.append('difficulty', difficulty);
    }

    const response = await fetch(`${API_BASE_URL}/idioms?${params}`);
    const result: ApiResponse<Idiom[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch idioms');
    }
  } catch (error) {
    console.error('API Error:', error);
    // フォールバック: ローカルデータを使用
    return [];
  }
}

// 新しい熟語を取得（模擬スクレイピング）
export async function refreshIdioms(): Promise<Idiom[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/idioms/refresh`);
    const result: ApiResponse<Idiom[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to refresh idioms');
    }
  } catch (error) {
    console.error('API Error:', error);
    // フォールバック: ローカルデータを使用
    return [];
  }
}

// APIサーバーのヘルスチェック
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const result: ApiResponse<any> = await response.json();
    return result.success;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
} 