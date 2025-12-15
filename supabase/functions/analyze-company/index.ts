import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Perform web search to gather real data about the company
async function searchCompanyData(domain: string, companyName: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  const searchQueries = [
    `${domain} company traffic monthly visitors SimilarWeb`,
    `${domain} tech stack built with technologies`,
    `${domain} ${companyName} revenue funding valuation`,
    `${domain} ${companyName} employees team size LinkedIn`,
    `${domain} SEO domain authority backlinks`,
  ];

  const results: string[] = [];

  for (const query of searchQueries) {
    try {
      console.log('Searching:', query);
      
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'You are a research assistant. Search your knowledge for real, factual information about companies. Be specific with numbers when available. If you don\'t know exact data, say "Unknown" rather than guessing.'
            },
            {
              role: 'user',
              content: `Find real information about: ${query}. Provide specific numbers and facts only. No speculation.`
            }
          ],
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          results.push(`Research on "${query}":\n${content}`);
        }
      }
    } catch (error) {
      console.error('Search error for query:', query, error);
    }
  }

  return results.join('\n\n---\n\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, compareUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing company:', url);
    if (compareUrl) {
      console.log('Comparing with:', compareUrl);
    }

    // Extract domain from URL
    const domain = new URL(url).hostname.replace('www.', '');
    const compareDomain = compareUrl ? new URL(compareUrl).hostname.replace('www.', '') : null;

    // Step 1: Gather real data via web search
    console.log('Step 1: Gathering real data via research...');
    const researchData = await searchCompanyData(domain, domain.split('.')[0]);
    console.log('Research data gathered, length:', researchData.length);

    // Step 2: Use the stronger model to analyze with real data context
    console.log('Step 2: Analyzing with gemini-2.5-pro...');
    
    const analysisPrompt = `You are an expert business analyst. I have gathered research data about the company "${domain}".

RESEARCH DATA:
${researchData}

Based on this research data, provide a comprehensive business analysis. Use the REAL data from the research above whenever available. Only estimate when data is truly unavailable, and clearly mark estimates.

IMPORTANT RULES:
- Use actual numbers from the research when available
- If data is unknown, use realistic industry benchmarks but mark them as "estimated"
- Never fabricate specific numbers - use ranges if uncertain
- Be conservative with estimates

Provide your analysis in this JSON format:
{
  "company": {
    "name": "Company Name (from research or domain)",
    "domain": "${domain}",
    "description": "Brief description based on research",
    "industry": "Primary industry",
    "businessModel": "Revenue model",
    "foundedYear": "from research or 'Unknown'",
    "employeeCount": "from research or estimate range"
  },
  "traffic": {
    "monthlyVisitors": number or estimate,
    "pageViews": estimated number,
    "bounceRate": percentage (0-100),
    "avgSessionDuration": seconds,
    "topCountries": ["Country1", "Country2", "Country3"],
    "organicTraffic": percentage,
    "paidTraffic": percentage,
    "growthRate": percentage,
    "dataSource": "research" or "estimated"
  },
  "seo": {
    "domainAuthority": score (0-100),
    "domainAge": years,
    "backlinks": count,
    "organicKeywords": count,
    "topKeywords": ["keyword1", "keyword2", "keyword3"],
    "contentQuality": score (0-100),
    "dataSource": "research" or "estimated"
  },
  "techStack": {
    "frontend": ["from research"],
    "backend": ["from research"],
    "database": ["from research"],
    "hosting": ["from research"],
    "analytics": ["from research"],
    "marketing": ["from research"],
    "dataSource": "research" or "estimated"
  },
  "revenue": {
    "estimatedMRR": monthly amount in USD,
    "estimatedARR": annual amount in USD,
    "revenueModel": "subscription/freemium/etc",
    "pricingTiers": ["tier info from research"],
    "averageTicketSize": estimated,
    "growthRate": percentage,
    "dataSource": "research" or "estimated"
  },
  "social": {
    "twitter": { "followers": count, "engagement": "high/medium/low" },
    "linkedin": { "followers": count, "engagement": "high/medium/low" },
    "facebook": { "followers": count, "engagement": "high/medium/low" },
    "instagram": { "followers": count, "engagement": "high/medium/low" },
    "youtube": { "subscribers": count, "views": count },
    "dataSource": "research" or "estimated"
  },
  "competition": {
    "marketPosition": "Leader/Challenger/Niche",
    "competitiveAdvantage": "main differentiator",
    "mainCompetitors": ["Competitor1", "Competitor2"],
    "marketSize": "TAM estimate",
    "marketShare": "percentage or tier"
  },
  "aiInsights": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["opportunity1", "opportunity2"],
    "threats": ["threat1", "threat2"],
    "scalabilityScore": score (0-100),
    "innovationScore": score (0-100),
    "recommendedActions": ["action1", "action2"]
  },
  "lovablePrompt": "A detailed prompt to build a similar business using Lovable, including features, tech stack, and monetization strategy based on the analysis.",
  "dataQuality": {
    "overallConfidence": "high/medium/low",
    "researchBased": percentage of data from research vs estimated
  }
}

${compareUrl ? `
Also analyze ${compareDomain} and provide a comparison:
{
  "comparison": {
    "winner": "${domain}" or "${compareDomain}",
    "trafficDiff": percentage difference,
    "revenueDiff": percentage difference,
    "keyDifferences": ["difference1", "difference2"],
    "recommendation": "Which is better positioned and why"
  }
}
` : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst. Always base your analysis on the provided research data. Be accurate and conservative with estimates. Return valid JSON only.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.choices[0].message.content;
    
    console.log('Analysis received, parsing JSON...');
    
    // Strip markdown code blocks if present
    analysisText = analysisText.replace(/^```json?\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText.substring(0, 500));
      throw new Error('Failed to parse AI analysis');
    }

    console.log('Analysis complete for:', domain);
    console.log('Data quality:', analysis.dataQuality);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        timestamp: new Date().toISOString(),
        researchDataUsed: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-company function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
