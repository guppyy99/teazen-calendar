import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { keywords, month, searchData } = req.body

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: '키워드가 필요합니다.' })
    }

    // 데이터 요약
    const dataContext = searchData.map((item: any) => 
      `${item.keyword}: ${item.searchVolume}회 검색 (남성 ${item.maleRatio}%, 여성 ${item.femaleRatio}%)`
    ).join(', ')

    const prompt = `
당신은 마케팅 데이터 분석 전문가입니다. 다음 검색 데이터를 분석하여 인사이트를 제공해주세요.

**분석 대상:**
- 키워드: ${keywords.join(', ')}
- 기간: ${month}월
- 데이터: ${dataContext}

**요구사항:**
1. 검색량 트렌드 분석
2. 타겟 고객층 특성
3. 마케팅 전략 제안
4. 간단명료하게 2-3문장으로 작성
5. 한국어로 작성

**형식:**
[키워드]에 대한 ${month}월 검색 트렌드를 분석한 결과, [주요 인사이트]. [추가 분석]. [마케팅 제안].
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: '당신은 마케팅 데이터 분석 전문가입니다. 검색 데이터를 기반으로 실용적인 인사이트를 제공합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const insight = completion.choices[0]?.message?.content || '인사이트를 생성할 수 없습니다.'

    return res.status(200).json({
      insight,
      summary: `${keywords.join(', ')} 키워드 분석 완료`
    })

  } catch (error: any) {
    console.error('OpenAI API 오류:', error)
    return res.status(500).json({ 
      error: 'AI 인사이트 생성 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
}

