"""Unit tests for the market intelligence helpers."""

import asyncio
import importlib.util
import sys
from contextlib import contextmanager
from datetime import datetime, timedelta
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest

MODULE_PATH = Path(__file__).resolve().parents[2] / "ml/market_intelligence.py"


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for isolated tests."""
    return None


class _StubEstimator:
    """Simple scikit-learn replacement used during module import."""

    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs


class _StubDataFrame(list):
    """Minimal pandas.DataFrame replacement for import-time typing."""

    def __init__(self, rows):
        super().__init__(rows)


@contextmanager
def _patched_modules(modules):
    """Temporarily register module stubs in sys.modules."""
    originals = {name: sys.modules.get(name) for name in modules}
    try:
        for name, module in modules.items():
            sys.modules[name] = module
        yield
    finally:
        for name, original in originals.items():
            if original is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = original


def _load_market_module():
    """Load the module from disk with lightweight dependency stubs."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []
    database_module = ModuleType("app.core.database")
    database_module.get_db_session = lambda: None
    core_module.database = database_module

    models_module = ModuleType("app.models")
    models_module.__path__ = []
    models_database_module = ModuleType("app.models.database")
    models_database_module.Job = object
    models_database_module.MarketAnalysis = SimpleNamespace
    models_module.database = models_database_module

    services_module = ModuleType("app.services")
    services_module.__path__ = []
    web_search_module = ModuleType("app.services.web_search")

    async def _web_search(_query):
        return []

    web_search_module.web_search = _web_search
    services_module.web_search = web_search_module

    pandas_module = ModuleType("pandas")
    pandas_module.DataFrame = _StubDataFrame
    pandas_module.to_datetime = lambda values: values

    sklearn_module = ModuleType("sklearn")
    sklearn_module.__path__ = []
    cluster_module = ModuleType("sklearn.cluster")
    cluster_module.KMeans = _StubEstimator
    ensemble_module = ModuleType("sklearn.ensemble")
    ensemble_module.RandomForestRegressor = _StubEstimator
    feature_module = ModuleType("sklearn.feature_extraction")
    feature_module.__path__ = []
    text_module = ModuleType("sklearn.feature_extraction.text")
    text_module.TfidfVectorizer = _StubEstimator
    linear_module = ModuleType("sklearn.linear_model")
    linear_module.LinearRegression = _StubEstimator
    preprocessing_module = ModuleType("sklearn.preprocessing")
    preprocessing_module.StandardScaler = _StubEstimator

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.core.database": database_module,
        "app.models": models_module,
        "app.models.database": models_database_module,
        "app.services": services_module,
        "app.services.web_search": web_search_module,
        "pandas": pandas_module,
        "sklearn": sklearn_module,
        "sklearn.cluster": cluster_module,
        "sklearn.ensemble": ensemble_module,
        "sklearn.feature_extraction": feature_module,
        "sklearn.feature_extraction.text": text_module,
        "sklearn.linear_model": linear_module,
        "sklearn.preprocessing": preprocessing_module,
    }

    with _patched_modules(stubs):
        module_name = f"_market_intelligence_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        return module


class _FakeColumn:
    """Minimal SQLAlchemy-like column for query filtering."""

    def ilike(self, value):
        return ("ilike", value)

    def __gt__(self, value):
        return ("gt", value)


class _FakeSeries:
    """Small Series-like object for competition calculations."""

    def __init__(self, value=0.5):
        self.value = value

    def nunique(self):
        return 3

    def mean(self):
        return self.value


class _CompetitionFrame:
    """DataFrame stand-in for _assess_competition."""

    def __init__(self, length):
        self.length = length

    def __len__(self):
        return self.length

    def __getitem__(self, _key):
        return _FakeSeries()


class _NumericSeries:
    """Tiny numeric series with just the math the tests need."""

    def __init__(self, values):
        self.values = list(values)

    def __add__(self, other):
        return _NumericSeries([left + right for left, right in zip(self.values, other.values)])

    def __truediv__(self, divisor):
        return _NumericSeries([value / divisor for value in self.values])

    def mean(self):
        return sum(self.values) / len(self.values)

    def median(self):
        values = sorted(self.values)
        middle = len(values) // 2
        if len(values) % 2:
            return values[middle]
        return (values[middle - 1] + values[middle]) / 2

    def min(self):
        return min(self.values)

    def max(self):
        return max(self.values)

    def quantile(self, fraction):
        values = sorted(self.values)
        index = int(round((len(values) - 1) * fraction))
        return values[index]


class _SalaryFrame:
    """Small DataFrame replacement for salary analysis."""

    def __init__(self, rows):
        self.rows = [dict(row) for row in rows]

    def dropna(self, subset):
        filtered = [
            row for row in self.rows if all(row.get(column) is not None for column in subset)
        ]
        return _SalaryFrame(filtered)

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, column):
        return _NumericSeries([row[column] for row in self.rows])

    def __setitem__(self, column, series):
        for row, value in zip(self.rows, series.values):
            row[column] = value


class _TextSeries(list):
    """Simple text column helper."""

    def fillna(self, value):
        return _TextSeries([value if item is None else item for item in self])

    def astype(self, _type):
        return _TextSeries([str(item) for item in self])


class _SkillsFrame:
    """Small DataFrame replacement for skill extraction."""

    def __init__(self, descriptions):
        self.descriptions = descriptions

    def __getitem__(self, key):
        assert key == "description"
        return _TextSeries(self.descriptions)


class _CompanyCounts(dict):
    """Minimal value_counts result object."""

    def head(self, _size):
        return self

    def to_dict(self):
        return dict(self)


class _CompanySeries(list):
    """Simple series that can produce value counts."""

    def value_counts(self):
        counts = {}
        for company in self:
            counts[company] = counts.get(company, 0) + 1
        return _CompanyCounts(counts)


class _EmployersFrame:
    """DataFrame replacement for employer analysis."""

    def __init__(self, companies):
        self.companies = companies

    def __getitem__(self, key):
        assert key == "company"
        return _CompanySeries(self.companies)


class _DateSeries:
    """Simple datetime-like series with a .dt.date accessor."""

    def __init__(self, values):
        self.values = values
        self.dt = SimpleNamespace(date=values)


class _MeanWindow:
    """Simple object returned by head/tail with a mean."""

    def __init__(self, value):
        self.value = value

    def mean(self):
        return self.value


class _DailyCounts:
    """Group-by size result for forecast tests."""

    def __init__(self, length, head_mean, tail_mean):
        self.length = length
        self.head_mean = head_mean
        self.tail_mean = tail_mean

    def __len__(self):
        return self.length

    def head(self, _size):
        return _MeanWindow(self.head_mean)

    def tail(self, _size):
        return _MeanWindow(self.tail_mean)


class _GroupedCounts:
    """Return wrapper for df.groupby(...).size()."""

    def __init__(self, counts):
        self.counts = counts

    def size(self):
        return self.counts


class _ForecastFrame:
    """DataFrame replacement for forecast calculations."""

    def __init__(self, counts):
        self.counts = counts
        self.columns = {"discovered_at": ["2026-03-01", "2026-03-02"]}

    def __getitem__(self, key):
        return self.columns[key]

    def __setitem__(self, key, value):
        self.columns[key] = value

    def groupby(self, _key):
        return _GroupedCounts(self.counts)


class _ComparisonColumn:
    """Column stub for equality and greater-than filters."""

    def __eq__(self, value):
        return ("eq", value)

    def __gt__(self, value):
        return ("gt", value)


def test_collect_job_data_merges_database_rows_with_web_fallback(monkeypatch):
    """Database rows should be normalized and supplemented by web results."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    class _JobModel:
        title = _FakeColumn()
        location = _FakeColumn()
        discovered_at = _FakeColumn()

    class _Query:
        def __init__(self, rows):
            self.rows = rows

        def filter(self, *args):
            return self

        def all(self):
            return self.rows

    class _Db:
        def __init__(self, rows):
            self.rows = rows

        def query(self, _model):
            return _Query(self.rows)

    class _Session:
        def __init__(self, rows):
            self.rows = rows

        def __enter__(self):
            return _Db(self.rows)

        def __exit__(self, exc_type, exc, tb):
            return False

    db_rows = [
        SimpleNamespace(
            title="Case Manager",
            company="Community First",
            location="Sydney",
            description="Client support and case management",
            salary_min=70000,
            salary_max=82000,
            discovered_at=datetime(2026, 3, 1, 12, 0, 0),
            match_score=None,
            source=None,
        )
    ]

    async def fake_search(field, location):
        assert field == "Social Work"
        assert location == "Sydney"
        return [{"title": "Web Role", "source": "web_search"}]

    monkeypatch.setattr(module, "Job", _JobModel)
    monkeypatch.setattr(module, "get_db_session", lambda: _Session(db_rows))
    monkeypatch.setattr(analyzer, "_search_web_jobs", fake_search)

    result = asyncio.run(analyzer._collect_job_data("Social Work", "Sydney"))

    assert len(result) == 2
    assert result[0]["title"] == "Case Manager"
    assert result[0]["match_score"] == 0.5
    assert result[0]["source"] == "database"
    assert result[1] == {"title": "Web Role", "source": "web_search"}


def test_search_web_jobs_limits_results_to_fifteen(monkeypatch):
    """The helper should cap added web jobs even if the search returns more."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    async def fake_web_search(query):
        return [
            {"snippet": f"{query} snippet {index}", "url": f"https://example.com/{index}"}
            for index in range(6)
        ]

    monkeypatch.setattr(module, "web_search", fake_web_search)

    results = asyncio.run(analyzer._search_web_jobs("Support Worker", "Melbourne"))

    assert len(results) == 15
    assert results[0]["title"] == "Support Worker Position"
    assert results[0]["company"] == "Various Companies"
    assert results[0]["location"] == "Melbourne"
    assert results[0]["source"] == "web_search"


def test_search_web_jobs_returns_empty_when_lookup_fails(monkeypatch):
    """Search failures should be treated as a soft failure."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    async def failing_search(_query):
        raise RuntimeError("search unavailable")

    monkeypatch.setattr(module, "web_search", failing_search)

    assert asyncio.run(analyzer._search_web_jobs("Support Worker", "Melbourne")) == []


def test_perform_ml_analysis_short_circuits_without_job_data():
    """No source jobs should return a small error payload without pandas work."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    result = asyncio.run(analyzer._perform_ml_analysis([], "Social Work", "Sydney"))

    assert result == {"error": "No job data available for analysis"}


def test_perform_ml_analysis_aggregates_component_outputs(monkeypatch):
    """The top-level analyzer should combine each specialized analysis result."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    class _Frame(list):
        def __init__(self, rows):
            super().__init__(rows)

    monkeypatch.setattr(module.pd, "DataFrame", lambda rows: _Frame(rows))

    async def fake_salaries(df):
        assert len(df) == 1
        return {"average_salary": 88000}

    async def fake_skills(_df):
        return {"top_skills": ["Case Management"]}

    async def fake_employers(_df):
        return {"top_employers": ["Community First"]}

    async def fake_forecast(_df, field, location):
        assert (field, location) == ("Social Work", "Sydney")
        return {"short_term_outlook": "growing"}

    async def fake_competition(_df):
        return "medium"

    async def fake_trends(_df):
        return {"salary_trends": "up"}

    monkeypatch.setattr(analyzer, "_analyze_salaries", fake_salaries)
    monkeypatch.setattr(analyzer, "_analyze_skills", fake_skills)
    monkeypatch.setattr(analyzer, "_analyze_employers", fake_employers)
    monkeypatch.setattr(analyzer, "_forecast_demand", fake_forecast)
    monkeypatch.setattr(analyzer, "_assess_competition", fake_competition)
    monkeypatch.setattr(analyzer, "_identify_trends", fake_trends)

    result = asyncio.run(
        analyzer._perform_ml_analysis([{"title": "Case Manager"}], "Social Work", "Sydney")
    )

    assert result["salary_insights"] == {"average_salary": 88000}
    assert result["skill_insights"] == {"top_skills": ["Case Management"]}
    assert result["employer_insights"] == {"top_employers": ["Community First"]}
    assert result["demand_forecast"] == {"short_term_outlook": "growing"}
    assert result["competition_level"] == "medium"
    assert result["market_trends"] == {"salary_trends": "up"}
    assert result["data_sources"] == 1


def test_analyze_market_trends_returns_cached_analysis(monkeypatch):
    """Recent cached analysis should bypass fresh data collection."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    cached = SimpleNamespace(
        field="Social Work",
        location="Sydney",
        analysis_date="2026-03-04T08:00:00",
        expires_at=datetime.utcnow() + timedelta(hours=2),
        total_jobs_found=6,
        average_salary=84000,
        competition_level="medium",
        salary_range={"min": 80000, "max": 90000},
        top_skills=["Assessment"],
        emerging_skills=["Telehealth"],
        skill_frequency={"Assessment": 2},
        top_employers=["Community First"],
        company_hiring_trends={"Community First": "up"},
        demand_forecast={"short_term_outlook": "stable"},
    )

    class _MarketAnalysis:
        field = _ComparisonColumn()
        location = _ComparisonColumn()
        expires_at = _ComparisonColumn()

    class _Query:
        def filter(self, *args):
            return self

        def first(self):
            return cached

    class _Db:
        def query(self, _model):
            return _Query()

    class _Session:
        def __enter__(self):
            return _Db()

        def __exit__(self, exc_type, exc, tb):
            return False

    async def should_not_run(*_args, **_kwargs):
        raise AssertionError("fresh collection should not run for cached results")

    monkeypatch.setattr(module, "MarketAnalysis", _MarketAnalysis)
    monkeypatch.setattr(module, "get_db_session", lambda: _Session())
    monkeypatch.setattr(analyzer, "_collect_job_data", should_not_run)

    result = asyncio.run(analyzer.analyze_market_trends("Social Work", "Sydney"))

    assert result["summary"]["total_jobs_analyzed"] == 6
    assert result["salary_insights"]["average_salary"] == 84000


def test_analyze_market_trends_persists_fresh_analysis(monkeypatch):
    """Fresh analysis should collect data, run analysis, and store the record."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    added = []

    class _Query:
        def filter(self, *args):
            return self

        def first(self):
            return None

    class _Db:
        def query(self, _model):
            return _Query()

        def add(self, value):
            added.append(value)

    class _Session:
        def __enter__(self):
            return _Db()

        def __exit__(self, exc_type, exc, tb):
            return False

    class _MarketAnalysis:
        field = _ComparisonColumn()
        location = _ComparisonColumn()
        expires_at = _ComparisonColumn()

        def __init__(self, **kwargs):
            self.analysis_date = "2026-03-04T09:00:00"
            for key, value in kwargs.items():
                setattr(self, key, value)

    async def fake_collect(_field, _location):
        return [{"title": "Case Manager"}, {"title": "Family Support"}]

    async def fake_ml_analysis(_jobs, _field, _location):
        return {
            "salary_insights": {
                "average_salary": 93000,
                "salary_range": {"min": 80000, "max": 110000},
            },
            "skill_insights": {
                "top_skills": ["Case Management"],
                "emerging_skills": ["Telehealth"],
                "skill_frequency": {"Case Management": 4},
            },
            "employer_insights": {
                "top_employers": ["Community First"],
                "hiring_trends": {"Community First": "up"},
            },
            "demand_forecast": {"short_term_outlook": "growing"},
            "competition_level": "low",
            "data_sources": 2,
        }

    monkeypatch.setattr(module, "MarketAnalysis", _MarketAnalysis)
    monkeypatch.setattr(module, "get_db_session", lambda: _Session())
    monkeypatch.setattr(analyzer, "_collect_job_data", fake_collect)
    monkeypatch.setattr(analyzer, "_perform_ml_analysis", fake_ml_analysis)

    result = asyncio.run(analyzer.analyze_market_trends("Social Work", "Sydney", refresh_data=True))

    assert len(added) == 1
    assert added[0].source_count == 2
    assert result["summary"]["competition_level"] == "low"
    assert result["skill_insights"]["emerging_skills"] == ["Telehealth"]


def test_analyze_market_trends_re_raises_failures(monkeypatch):
    """Unexpected analysis failures should be logged and re-raised."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    async def failing_collect(_field, _location):
        raise RuntimeError("db unavailable")

    monkeypatch.setattr(analyzer, "_collect_job_data", failing_collect)

    with pytest.raises(RuntimeError, match="db unavailable"):
        asyncio.run(analyzer.analyze_market_trends("Social Work", "Sydney", refresh_data=True))


def test_analyze_salaries_returns_error_without_salary_rows():
    """Salary analysis should fail softly when no rows contain salary data."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    result = asyncio.run(
        analyzer._analyze_salaries(
            _SalaryFrame(
                [{"salary_min": None, "salary_max": None}, {"salary_min": None, "salary_max": 5}]
            )
        )
    )

    assert result == {"error": "No salary data available"}


def test_analyze_salaries_summarizes_salary_distribution():
    """Salary analysis should calculate averages, ranges, and sample metadata."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    rows = [{"salary_min": 70000, "salary_max": 90000} for _ in range(11)]

    result = asyncio.run(analyzer._analyze_salaries(_SalaryFrame(rows)))

    assert result["average_salary"] == 80000
    assert result["median_salary"] == 80000
    assert result["salary_range"] == {"min": 70000, "max": 90000, "p25": 80000, "p75": 80000}
    assert result["confidence_level"] == "medium"
    assert result["sample_size"] == 11


def test_analyze_skills_counts_keywords_from_descriptions():
    """Skill extraction should count repeated domain keywords."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    frame = _SkillsFrame(
        [
            "Case management and community outreach with crisis intervention",
            "Strong assessment and documentation skills",
            None,
        ]
    )

    result = asyncio.run(analyzer._analyze_skills(frame))

    assert "Case Management" in result["top_skills"]
    assert result["skill_frequency"]["Assessment"] == 1
    assert result["declining_skills"] == ["Paper-based Documentation"]


def test_analyze_employers_summarizes_top_companies():
    """Employer analysis should expose counts and canned hiring trends."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    result = asyncio.run(
        analyzer._analyze_employers(
            _EmployersFrame(["Dept A", "Dept A", "Dept B", "Dept C", "Dept B"])
        )
    )

    assert result["top_employers"] == ["Dept A", "Dept B", "Dept C"]
    assert result["employer_job_counts"]["Dept A"] == 2
    assert "most_active_employers" in result["hiring_trends"]


def test_forecast_demand_returns_insufficient_data_when_history_is_short(monkeypatch):
    """Short histories should return the explicit insufficient-data payload."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    monkeypatch.setattr(module.pd, "to_datetime", lambda values: _DateSeries(values))

    result = asyncio.run(
        analyzer._forecast_demand(
            _ForecastFrame(_DailyCounts(length=3, head_mean=1, tail_mean=2)),
            "Social Work",
            "Sydney",
        )
    )

    assert result == {
        "forecast_type": "insufficient_data",
        "short_term_outlook": "stable",
        "confidence": "low",
    }


def test_forecast_demand_classifies_growing_markets(monkeypatch):
    """Longer histories should produce a trend-based forecast."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    monkeypatch.setattr(module.pd, "to_datetime", lambda values: _DateSeries(values))

    result = asyncio.run(
        analyzer._forecast_demand(
            _ForecastFrame(_DailyCounts(length=8, head_mean=1, tail_mean=3)),
            "Social Work",
            "Sydney",
        )
    )

    assert result["forecast_type"] == "trend_based"
    assert result["short_term_outlook"] == "growing"
    assert result["predicted_growth"] == "60 jobs/month"


@pytest.mark.parametrize(
    ("job_count", "expected"),
    [(5, "high"), (20, "medium"), (60, "low")],
)
def test_assess_competition_uses_job_count_thresholds(job_count, expected):
    """Competition should follow the simple size thresholds."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    result = asyncio.run(analyzer._assess_competition(_CompetitionFrame(job_count)))

    assert result == expected


def test_format_market_analysis_marks_recent_data():
    """Formatted payloads should expose freshness and readable recommendations."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()
    analysis = SimpleNamespace(
        field="Social Work",
        location="Sydney",
        analysis_date="2026-03-04T08:00:00",
        expires_at=datetime.utcnow() + timedelta(hours=3),
        total_jobs_found=14,
        average_salary=91000,
        competition_level="medium",
        salary_range={"min": 80000, "max": 102000},
        top_skills=["Case Management"],
        emerging_skills=["Telehealth"],
        skill_frequency={"Case Management": 4},
        top_employers=["Community First"],
        company_hiring_trends={"Community First": "up"},
        demand_forecast={"short_term_outlook": "growing"},
    )

    result = analyzer._format_market_analysis(analysis)

    assert result["summary"]["data_freshness"] == "recent"
    assert result["summary"]["average_salary"] == 91000
    assert result["skill_insights"]["top_skills"] == ["Case Management"]
    assert "Strong demand in Social Work" in result["recommendations"][0]


def test_analyze_job_requirements_extracts_skills_and_entry_level():
    """Keyword parsing should infer skills, experience, and education."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()
    description = (
        "Graduate case management role requiring strong communication, "
        "documentation, and a bachelor qualification."
    )

    result = asyncio.run(engine._analyze_job_requirements(description))

    assert result["required_skills"] == [
        "Case Management",
        "Communication",
        "Documentation",
    ]
    assert result["experience_required"] == 0
    assert result["education_required"] == "Bachelor's degree"


def test_analyze_job_requirements_detects_three_year_requirement():
    """The parser should pick up the 3-year experience branch."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    result = asyncio.run(
        engine._analyze_job_requirements("Requires 3+ years of counselling and communication.")
    )

    assert result["experience_required"] == 3
    assert "Counseling" in result["required_skills"]


def test_analyze_job_requirements_detects_five_year_requirement():
    """The parser should pick up the 5-year experience branch."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    result = asyncio.run(
        engine._analyze_job_requirements("Candidates need 5 years in crisis intervention.")
    )

    assert result["experience_required"] == 5
    assert "Crisis Intervention" in result["required_skills"]


def test_calculate_job_match_score_aggregates_weighted_scores(monkeypatch):
    """The matching engine should return the weighted score breakdown."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    async def fake_job_analysis(_description):
        return {
            "required_skills": ["Case Management"],
            "experience_required": 3,
            "preferred_background": ["social work"],
        }

    async def fake_skill_match(user_skills, required_skills):
        assert user_skills == ["Case Management", "Assessment"]
        assert required_skills == ["Case Management"]
        return {"score": 0.9}

    async def fake_experience_match(user_experience, required_experience):
        assert (user_experience, required_experience) == (4, 3)
        return {"score": 0.8}

    async def fake_background_match(user_background, preferred_background):
        assert user_background == "finance"
        assert preferred_background == ["social work"]
        return {"score": 0.7}

    async def fake_recommendations(*_args):
        return ["Lead with transferable experience"]

    monkeypatch.setattr(engine, "_analyze_job_requirements", fake_job_analysis)
    monkeypatch.setattr(engine, "_calculate_skill_match", fake_skill_match)
    monkeypatch.setattr(engine, "_calculate_experience_match", fake_experience_match)
    monkeypatch.setattr(engine, "_calculate_background_match", fake_background_match)
    monkeypatch.setattr(engine, "_generate_improvement_recommendations", fake_recommendations)

    result = asyncio.run(
        engine.calculate_job_match_score(
            {
                "skills": ["Case Management", "Assessment"],
                "experience_years": 4,
                "career_transition_from": "finance",
            },
            "A" * 600,
        )
    )

    assert result["overall_match_score"] == 0.83
    assert result["recommendations"] == ["Lead with transferable experience"]
    assert result["confidence"] == "high"


def test_calculate_job_match_score_returns_fallback_when_analysis_fails(monkeypatch):
    """Unexpected matching errors should not crash the caller."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    async def failing_analysis(_description):
        raise RuntimeError("bad parse")

    monkeypatch.setattr(engine, "_analyze_job_requirements", failing_analysis)

    result = asyncio.run(engine.calculate_job_match_score({}, "short"))

    assert result["overall_match_score"] == 0.5
    assert result["error"] == "bad parse"
    assert result["confidence"] == "low"


def test_identify_trends_returns_static_market_summary():
    """The static trend payload should remain available to callers."""
    module = _load_market_module()
    analyzer = module.JobMarketAnalyzer()

    result = asyncio.run(analyzer._identify_trends(object()))

    assert "Remote work options increasing by 30%" in result["key_trends"]
    assert result["salary_trends"] == "Average salaries up 8% year-over-year"


def test_calculate_skill_match_handles_missing_requirements():
    """No explicit job skills should return the baseline transferable score."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    result = asyncio.run(engine._calculate_skill_match(["Assessment"], []))

    assert result == {"score": 0.8, "details": "No specific skills required"}


def test_calculate_skill_match_tracks_matches_and_gaps():
    """Skill matching should detect overlapping skills and missing requirements."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    result = asyncio.run(
        engine._calculate_skill_match(
            ["Case Management", "Stakeholder Communication"],
            ["Case Management", "Documentation"],
        )
    )

    assert result["score"] == 0.7
    assert result["matched_skills"] == ["case management"]
    assert result["missing_skills"] == ["documentation"]


@pytest.mark.parametrize(
    ("user_experience", "required_experience", "expected_score"),
    [(5, 3, 1.0), (3, 4, 0.8), (1, 4, 0.6)],
)
def test_calculate_experience_match_scores_ranges(
    user_experience, required_experience, expected_score
):
    """Experience scoring should cover all threshold branches."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    result = asyncio.run(engine._calculate_experience_match(user_experience, required_experience))

    assert result["score"] == expected_score
    assert result["required_experience"] == required_experience


def test_calculate_background_match_handles_finance_and_default_backgrounds():
    """Background scoring should special-case finance and fall back otherwise."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    finance_result = asyncio.run(engine._calculate_background_match("finance", ["social work"]))
    default_result = asyncio.run(engine._calculate_background_match("retail", ["social work"]))

    assert finance_result["score"] == 0.7
    assert "Analytical thinking" in finance_result["transferable_strengths"]
    assert default_result["score"] == 0.5
    assert default_result["transferable_strengths"] == ["Professional experience"]


def test_generate_improvement_recommendations_limits_and_combines_guidance():
    """Recommendations should combine low-score suggestions across categories."""
    module = _load_market_module()
    engine = module.SkillMatchingEngine()

    result = asyncio.run(
        engine._generate_improvement_recommendations(
            {"score": 0.6, "missing_skills": ["Documentation", "Assessment", "Counseling"]},
            {"score": 0.7},
            {"score": 0.6},
        )
    )

    assert len(result) == 5
    assert result[0].startswith("Consider developing skills in:")
    assert "Highlight transferable experience from previous roles" in result
