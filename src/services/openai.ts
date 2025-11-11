import type { AIInsightResponse } from '../types'

/**
 * OpenAI API를 통해 AI 인사이트 생성
 * 보안을 위해 서버 사이드 API 라우트를 통해 호출
 */
export async function generateAIInsight(
  keywords: string[],
  month: number,
  searchData: any[]
): Promise<AIInsightResponse> {
  try {
    const response = await fetch('/api/generate-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords,
        month,
        searchData,
      }),
    })

    if (!response.ok) {
      throw new Error('AI 인사이트 생성 실패')
    }

    return await response.json()
  } catch (error) {
    console.error('AI 인사이트 생성 오류:', error)
    
    // 폴백: 기본 인사이트 반환
    return {
      insight: `${month}월 ${keywords.join(', ')} 키워드의 검색 트렌드를 분석했습니다.`,
      summary: '데이터를 기반으로 마케팅 전략을 수립하세요.'
    }
  }
}

