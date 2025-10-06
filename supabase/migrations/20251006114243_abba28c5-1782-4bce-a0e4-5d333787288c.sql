-- Create companies table to store analyzed companies
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  name TEXT,
  description TEXT,
  industry TEXT,
  business_model TEXT,
  tech_stack TEXT[],
  traffic_estimate JSONB,
  revenue_estimate JSONB,
  seo_metrics JSONB,
  social_presence JSONB,
  growth_metrics JSONB,
  ai_insights JSONB,
  lovable_prompt TEXT,
  analysis_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own companies" 
ON public.companies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" 
ON public.companies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_companies_updated_at();

-- Create index for faster queries
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_companies_domain ON public.companies(domain);
CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_companies_created_at ON public.companies(created_at DESC);