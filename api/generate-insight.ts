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

    // 데이터 요약 및 날짜별 분석
    const monthlyData = searchData.reduce((acc: any, item: any) => {
      if (!acc[item.keyword]) {
        acc[item.keyword] = {
          totalVolume: 0,
          maleRatio: item.maleRatio,
          femaleRatio: item.femaleRatio,
          monthlyVolumes: []
        }
      }
      acc[item.keyword].totalVolume += item.searchVolume
      acc[item.keyword].monthlyVolumes.push({
        month: item.month,
        volume: item.searchVolume
      })
      return acc
    }, {})

    // 성별 분석
    const genderInsights = keywords.map(kw => {
      const data = monthlyData[kw]
      if (!data) return ''
      const dominant = data.maleRatio > data.femaleRatio ? '남성' : '여성'
      const ratio = Math.abs(data.maleRatio - data.femaleRatio).toFixed(1)
      return `${kw}는 ${dominant}이 ${ratio}%p 더 많이 검색`
    }).filter(Boolean).join(', ')

    // 검색량 변화 분석
    const trendAnalysis = keywords.map(kw => {
      const volumes = monthlyData[kw]?.monthlyVolumes || []
      if (volumes.length < 2) return ''
      const sorted = volumes.sort((a: any, b: any) => a.month - b.month)
      const latest = sorted[sorted.length - 1]
      const prev = sorted[sorted.length - 2]
      const change = ((latest.volume - prev.volume) / prev.volume * 100).toFixed(1)
      return change
    }).filter(Boolean)

    const dataContext = keywords.map(kw => {
      const data = monthlyData[kw]
      return `${kw}: 총 ${data?.totalVolume?.toLocaleString()}회 검색`
    }).join(', ')

    const prompt = `
당신은 마케팅 데이터 분석 전문가입니다. 다음 검색 데이터를 분석하여 실용적인 인사이트를 제공해주세요.

**분석 대상:**
- 키워드: ${keywords.join(', ')}
- 분석 기간: ${month}월
- 검색 데이터: ${dataContext}
- 성별 특성: ${genderInsights}

**분석 요구사항:**
1. ${month}월에 검색량이 급증/감소한 이유 분석 (특별한 날짜나 이벤트가 있었는지)
2. 어떤 성별이 주로 검색했는지와 그 이유
3. 연령대별 특성 (제공된 데이터 기반)
4. 이 인사이트를 활용한 구체적인 마케팅 제안

**작성 형식:**
- 2-3문장으로 간결하게 작성
- 반드시 날짜/성별 특성을 언급
- 실행 가능한 마케팅 제안 포함
- 한국어로 작성

**예시:**
"${month}월 ${keywords[0]} 검색량은 [특정 날짜/이벤트]로 인해 [증가/감소]했으며, 특히 [성별]의 검색이 [비율]를 차지했습니다. [연령대] 타겟의 관심이 높아 [구체적 마케팅 제안]을 추천합니다."
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

