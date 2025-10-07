import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, compareUrl } = await req.json();
    const GROQ_API_KEY = Deno.env.get('Grokapikey');

    if (!GROQ_API_KEY) {
      throw new Error('Groq API key is not configured');
    }

    console.log('Analyzing company:', url);
    if (compareUrl) {
      console.log('Comparing with:', compareUrl);
    }

    // Extract domain from URL
    const domain = new URL(url).hostname.replace('www.', '');
    const compareDomain = compareUrl ? new URL(compareUrl).hostname.replace('www.', '') : null;

    // Create comprehensive analysis prompt
    const prompt = `Analyze the following company website: ${url}${compareUrl ? ` and compare it with: ${compareUrl}` : ''}

Provide a comprehensive business analysis in JSON format with the following structure:
{
  "company": {
    "name": "Company Name",
    "domain": "${domain}",
    "description": "Brief company description",
    "industry": "Primary industry/niche",
    "businessModel": "Revenue model (SaaS, Marketplace, etc)",
    "foundedYear": estimated year or "Unknown",
    "employeeCount": "estimate range like 10-50"
  },
  "traffic": {
    "monthlyVisitors": estimated number,
    "pageViews": estimated number,
    "bounceRate": percentage (0-100),
    "avgSessionDuration": seconds,
    "topCountries": ["Country1", "Country2", "Country3"],
    "organicTraffic": percentage (0-100),
    "paidTraffic": percentage (0-100),
    "growthRate": percentage change
  },
  "seo": {
    "domainAuthority": score (0-100),
    "domainAge": years,
    "backlinks": estimated count,
    "organicKeywords": estimated count,
    "topKeywords": ["keyword1", "keyword2", "keyword3"],
    "contentQuality": score (0-100)
  },
  "techStack": {
    "frontend": ["React", "Next.js", etc],
    "backend": ["Node.js", "Python", etc],
    "database": ["PostgreSQL", "MongoDB", etc],
    "hosting": ["AWS", "Vercel", etc],
    "analytics": ["Google Analytics", etc],
    "marketing": ["Mailchimp", "HubSpot", etc]
  },
  "revenue": {
    "estimatedMRR": monthly amount in USD,
    "estimatedARR": annual amount in USD,
    "revenueModel": "subscription/freemium/one-time/etc",
    "pricingTiers": ["Free", "Pro $X/mo", etc],
    "averageTicketSize": estimated amount,
    "growthRate": percentage
  },
  "social": {
    "twitter": { "followers": count, "engagement": "high/medium/low" },
    "linkedin": { "followers": count, "engagement": "high/medium/low" },
    "facebook": { "followers": count, "engagement": "high/medium/low" },
    "instagram": { "followers": count, "engagement": "high/medium/low" },
    "youtube": { "subscribers": count, "views": count }
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
  "lovablePrompt": "A detailed, actionable prompt to build a similar or improved version of this business using Lovable. Include specific features, tech stack, and monetization strategy."
}

${compareUrl ? `
Also provide a comparison object:
{
  "comparison": {
    "winner": "${domain}" or "${compareDomain}",
    "trafficDiff": percentage difference,
    "revenueDiff": percentage difference,
    "keyDifferences": ["difference1", "difference2"],
    "recommendation": "Which is better positioned and why"
  }
}
` : ''}

Base your analysis on realistic estimates for a company with domain ${domain}. Be specific with numbers and insights.`;

    console.log('Sending request to Groq AI...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst specializing in SaaS companies, tech startups, and digital businesses. Provide detailed, realistic analysis based on industry knowledge and market data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
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
    const analysisText = data.choices[0].message.content;
    
    console.log('Analysis received, parsing JSON...');
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      throw new Error('Failed to parse AI analysis');
    }

    console.log('Analysis complete for:', domain);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        timestamp: new Date().toISOString()
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