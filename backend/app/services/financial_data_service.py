import yfinance as yf
from alpha_vantage.timeseries import TimeSeries
import newsapi
from typing import Dict
from datetime import datetime, timedelta

class FinancialDataService:
    def __init__(self, alpha_vantage_key: str, news_api_key: str):
        self.av = TimeSeries(key=alpha_vantage_key)
        self.news_api = newsapi.NewsApiClient(api_key=news_api_key)

    async def get_company_financial_data(self, company_name: str, ticker: str = None) -> Dict:
        """Gather financial data and recent news"""

        financial_data = {}

        # 1. Stock data (if public company)
        if ticker:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info

                financial_data['stock_performance'] = {
                    'current_price': info.get('currentPrice'),
                    'market_cap': info.get('marketCap'),
                    'revenue': info.get('totalRevenue'),
                    'employee_count': info.get('fullTimeEmployees'),
                    'industry': info.get('industry'),
                    'sector': info.get('sector'),
                    '52_week_high': info.get('fiftyTwoWeekHigh'),
                    '52_week_low': info.get('fiftyTwoWeekLow'),
                    'pe_ratio': info.get('trailingPE')
                }
            except Exception as e:
                financial_data['stock_error'] = str(e)

        # 2. Recent news
        try:
            news_articles = self.news_api.get_everything(
                q=company_name,
                language='en',
                sort_by='publishedAt',
                page_size=20,
                from_param=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            )

            financial_data['recent_news'] = [
                {
                    'title': article['title'],
                    'description': article['description'],
                    'url': article['url'],
                    'published_at': article['publishedAt'],
                    'source': article['source']['name']
                }
                for article in news_articles['articles']
            ]
        except Exception as e:
            financial_data['news_error'] = str(e)

        return financial_data
