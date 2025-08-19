from genkit.flows import define_flow
from genkit.ai import generate
from typing import Dict
import json

# Placeholder for models - replace with actual imports
gemini15Pro = "gemini-1.5-pro"
gemini15Flash = "gemini-1.5-flash"

@define_flow(name="analyze_company_culture")
async def analyze_company_culture(raw_data: Dict) -> Dict:
    """AI analysis of company culture from collected data"""

    culture_prompt = f"""
    Analyze the company culture based on this data:

    Website Content: {raw_data.get('website_analysis', {})}
    Employee Reviews: {raw_data.get('glassdoor_analysis', {})}
    Job Postings: {raw_data.get('careers_analysis', {})}
    News Articles: {raw_data.get('recent_news', [])}

    Provide insights on:
    1. Work environment (collaborative, competitive, innovative, traditional)
    2. Work-life balance indicators
    3. Growth and learning opportunities
    4. Diversity and inclusion commitment
    5. Management style indicators
    6. Remote work culture
    7. Values alignment for job seekers

    Rate each aspect 1-10 and provide specific evidence.
    Format as JSON.
    """

    culture_analysis_str = await generate(
        model=gemini15Flash,
        prompt=culture_prompt,
        config={"response_format": "json_object"}
    )

    return json.loads(culture_analysis_str.text())

@define_flow(name="predict_hiring_trends")
async def predict_hiring_trends(raw_data: Dict) -> Dict:
    """Predict company hiring patterns and opportunities"""

    hiring_prompt = f"""
    Based on this company data, predict hiring trends:

    Financial Performance: {raw_data.get('financial_data', {})}
    Recent News: {raw_data.get('recent_news', [])}
    Active Job Postings: {raw_data.get('current_jobs', [])}
    Company Growth Indicators: {raw_data.get('growth_indicators', {})}

    Predict:
    1. Hiring velocity (increasing, stable, decreasing)
    2. Most in-demand roles
    3. Best time to apply (timing recommendations)
    4. Budget constraints indicators
    5. Expansion areas (new markets, products)
    6. Layoff risk assessment
    7. Ideal candidate profile

    Provide confidence scores and reasoning.
    Format as JSON.
    """

    hiring_analysis_str = await generate(
        model=gemini15Pro,
        prompt=hiring_prompt,
        config={"response_format": "json_object"}
    )

    return json.loads(hiring_analysis_str.text())
