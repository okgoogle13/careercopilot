#!/usr/bin/env python3
"""
Test script for NLP Model Optimization

This script demonstrates the performance improvement achieved by using
the singleton NLP Model Manager instead of loading spaCy models on every request.

Run this script to verify the optimization works correctly.
"""

import asyncio
import sys
import time

# Sample resume text for testing
SAMPLE_RESUME = """
John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years developing scalable web applications using Python, JavaScript, and cloud technologies. Proven track record of leading development teams and delivering high-quality solutions.

TECHNICAL SKILLS
• Programming Languages: Python, JavaScript, TypeScript, Java, Go
• Web Frameworks: React, Django, Flask, FastAPI, Node.js
• Cloud Platforms: AWS, Azure, Google Cloud Platform
• Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
• DevOps: Docker, Kubernetes, Jenkins, Terraform, CI/CD
• Machine Learning: scikit-learn, TensorFlow, PyTorch, pandas, numpy

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Corp | 2020 - Present
• Led development of microservices architecture serving 10M+ users daily
• Implemented automated CI/CD pipeline reducing deployment time by 75%
• Mentored junior developers and conducted code reviews
• Technologies: Python, React, AWS, Docker, Kubernetes

Software Engineer | StartupXYZ | 2018 - 2020
• Developed full-stack web applications using React and Django
• Built RESTful APIs and integrated third-party services
• Optimized database queries improving application performance by 40%
• Technologies: Python, JavaScript, PostgreSQL, Redis

Junior Developer | WebSolutions Inc | 2016 - 2018
• Created responsive web interfaces using HTML, CSS, and JavaScript
• Collaborated with designers to implement pixel-perfect UI components
• Participated in agile development process and sprint planning
• Technologies: JavaScript, HTML, CSS, jQuery, PHP

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2012 - 2016
• Relevant Coursework: Data Structures, Algorithms, Software Engineering
• Senior Project: Machine Learning-based Recommendation System

CERTIFICATIONS
• AWS Certified Solutions Architect - Professional (2021)
• Google Cloud Professional Developer (2020)
• Certified Kubernetes Administrator (2019)

PROJECTS
E-commerce Platform | Personal Project
• Built full-stack e-commerce application with React and Django
• Implemented payment processing with Stripe API
• Deployed on AWS with auto-scaling capabilities
• GitHub: github.com/johnsmith/ecommerce-platform

AI-Powered Chat Bot | Open Source Contribution
• Developed NLP-based chatbot using Python and spaCy
• Contributed to open-source project with 500+ stars
• Implemented intent recognition and entity extraction
• Technologies: Python, spaCy, TensorFlow, Flask
"""


def test_without_optimization():
    """Test parsing WITHOUT the optimization (slow method)."""
    print("🐌 Testing WITHOUT optimization (loading model each time)...")

    times = []

    for i in range(5):
        start_time = time.time()

        try:
            import spacy

            # This is the SLOW way - loading model every time
            nlp = spacy.load("en_core_web_sm")
            doc = nlp(SAMPLE_RESUME)

            # Extract some basic info
            entities = [(ent.text, ent.label_) for ent in doc.ents]
            tokens = len([token for token in doc if not token.is_space])

            end_time = time.time()
            duration = (end_time - start_time) * 1000
            times.append(duration)

            print(f"  Run {i + 1}: {duration:.2f}ms ({tokens} tokens, {len(entities)} entities)")

        except ImportError:
            print(
                "❌ spaCy not installed. Install with: pip install spacy && python -m spacy download en_core_web_sm"
            )
            return []
        except OSError:
            print(
                "❌ en_core_web_sm model not found. Download with: python -m spacy download en_core_web_sm"
            )
            return []

    avg_time = sum(times) / len(times)
    print(f"  Average time: {avg_time:.2f}ms")
    print()

    return times


def test_with_optimization():
    """Test parsing WITH the optimization (fast method)."""
    print("🚀 Testing WITH optimization (cached model)...")

    try:
        from app.core.nlp_model_manager import preload_models
        from app.utils.resume_parser import parse_resume_optimized

        # Preload models (this happens once at startup)
        print("  Preloading models...")
        preload_start = time.time()
        preload_models()
        preload_time = (time.time() - preload_start) * 1000
        print(f"  Model preloading took: {preload_time:.2f}ms")

        # Now test parsing multiple times (this is fast!)
        times = []

        for i in range(5):
            start_time = time.time()

            # This is the FAST way - using cached model
            result = parse_resume_optimized(SAMPLE_RESUME)

            end_time = time.time()
            duration = (end_time - start_time) * 1000
            times.append(duration)

            print(
                f"  Run {i + 1}: {duration:.2f}ms ({result.word_count} words, {len(result.skills)} skills)"
            )

        avg_time = sum(times) / len(times)
        print(f"  Average time: {avg_time:.2f}ms")
        print()

        return times, preload_time

    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running from the backend directory")
        return [], 0


def test_model_manager_features():
    """Test additional features of the model manager."""
    print("🔧 Testing Model Manager Features...")

    try:
        from app.core.nlp_model_manager import health_check_models, nlp_model_manager

        # Test model info
        print("📊 Model Information:")
        models_info = nlp_model_manager.list_loaded_models()
        for model_name, info in models_info.items():
            print(f"  - {model_name}: {info}")

        # Test memory usage
        print("\n💾 Memory Usage:")
        memory_info = nlp_model_manager.get_memory_usage()
        print(f"  Total models: {memory_info['total_models']}")
        print(f"  Total memory: {memory_info['total_memory_mb']:.2f} MB")

        # Test health check
        print("\n🏥 Health Check:")
        health_status = health_check_models()
        print(f"  Status: {health_status['status']}")
        print(f"  Models loaded: {health_status['models_loaded']}")

        if health_status["issues"]:
            print("  Issues:")
            for issue in health_status["issues"]:
                print(f"    - {issue}")

        print()

    except ImportError as e:
        print(f"❌ Import error: {e}")


async def test_concurrent_parsing():
    """Test concurrent parsing to verify thread safety."""
    print("🧵 Testing Concurrent Parsing (Thread Safety)...")

    try:
        from app.utils.resume_parser import parse_resume_optimized

        async def parse_resume_async(resume_text: str, run_id: int):
            """Async wrapper for resume parsing."""
            start_time = time.time()
            result = parse_resume_optimized(resume_text)
            duration = (time.time() - start_time) * 1000
            return run_id, duration, len(result.skills)

        # Create multiple concurrent parsing tasks
        tasks = []
        for i in range(10):
            task = parse_resume_async(SAMPLE_RESUME, i + 1)
            tasks.append(task)

        # Run all tasks concurrently
        start_time = time.time()
        results = await asyncio.gather(*tasks)
        total_time = (time.time() - start_time) * 1000

        print(f"  Completed 10 concurrent parses in: {total_time:.2f}ms")

        for run_id, duration, skills_count in results:
            print(f"  Parse {run_id}: {duration:.2f}ms ({skills_count} skills)")

        avg_concurrent_time = sum(r[1] for r in results) / len(results)
        print(f"  Average concurrent parse time: {avg_concurrent_time:.2f}ms")
        print()

    except ImportError as e:
        print(f"❌ Import error: {e}")


def main():
    """Main test function."""
    print("🧪 NLP Model Optimization Test Suite")
    print("=" * 50)

    # Add the backend app to Python path
    sys.path.insert(0, ".")

    # Test without optimization (slow)
    slow_times = test_without_optimization()

    # Test with optimization (fast)
    fast_times, preload_time = test_with_optimization()

    # Test additional features
    test_model_manager_features()

    # Test concurrent parsing
    asyncio.run(test_concurrent_parsing())

    # Calculate improvement
    if slow_times and fast_times:
        avg_slow = sum(slow_times) / len(slow_times)
        avg_fast = sum(fast_times) / len(fast_times)
        improvement = (avg_slow - avg_fast) / avg_slow * 100

        print("📈 PERFORMANCE SUMMARY")
        print("=" * 50)
        print(f"Without optimization: {avg_slow:.2f}ms average")
        print(f"With optimization: {avg_fast:.2f}ms average")
        print(f"Improvement: {improvement:.1f}% faster")
        print(f"Time saved per request: {avg_slow - avg_fast:.2f}ms")
        print(f"One-time preload cost: {preload_time:.2f}ms")
        print()

        if improvement > 50:
            print("✅ EXCELLENT: Optimization provides significant performance improvement!")
        elif improvement > 20:
            print("✅ GOOD: Optimization provides noticeable performance improvement!")
        else:
            print("⚠️  MARGINAL: Optimization provides some improvement.")

        print(
            f"\n💡 With 1000 requests per day, you save: {(avg_slow - avg_fast) * 1000 / 1000:.1f} seconds total"
        )


if __name__ == "__main__":
    main()
