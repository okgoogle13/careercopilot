from datetime import datetime
from typing import Dict

class ResearchCacheManager:
    def __init__(self, firestore_client):
        self.db = firestore_client
        self.cache_ttl = {
            'financial_data': 86400,  # 24 hours
            'website_analysis': 604800,  # 7 days
            'social_sentiment': 172800,  # 48 hours
            'news_analysis': 43200,  # 12 hours
        }

    def normalize_company_name(self, company_name: str) -> str:
        # Placeholder for normalization logic
        return company_name.lower().replace(' ', '_')

    async def get_cached_research(self, company_name: str) -> Dict:
        """Get cached research with freshness assessment"""
        doc_ref = self.db.collection('company_research').document(
            self.normalize_company_name(company_name)
        )
        doc = await doc_ref.get()

        if not doc.exists:
            return None

        data = doc.to_dict()
        freshness_score = self.assess_data_freshness(data)

        if freshness_score < 0.6:  # Stale data threshold
            return None

        data['data_freshness_score'] = freshness_score
        return data

    def assess_data_freshness(self, research_data: Dict) -> float:
        """Calculate how fresh the research data is"""
        now = datetime.now()
        freshness_scores = []

        for source, ttl in self.cache_ttl.items():
            if source in research_data.get('data_sources', {}):
                last_updated = research_data['data_sources'][source].get('timestamp')
                if last_updated:
                    # Make sure last_updated is a datetime object
                    if isinstance(last_updated, (int, float)):
                        last_updated = datetime.fromtimestamp(last_updated)

                    if isinstance(last_updated, datetime):
                        age = (now - last_updated).total_seconds()
                        freshness = max(0, 1 - (age / ttl))
                        freshness_scores.append(freshness)

        return sum(freshness_scores) / len(freshness_scores) if freshness_scores else 0
