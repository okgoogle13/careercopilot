#!/usr/bin/env python3
"""
Performance Benchmark Script

This script demonstrates the performance improvements made to the codebase.
Run this to verify that optimizations provide measurable benefits.
"""

import time
from typing import Callable, List


def benchmark(func: Callable, iterations: int = 1000, *args, **kwargs) -> float:
    """Benchmark a function over multiple iterations."""
    start = time.perf_counter()
    for _ in range(iterations):
        func(*args, **kwargs)
    end = time.perf_counter()
    return (end - start) / iterations * 1000  # Return ms per iteration


def test_nested_loop_optimization():
    """Test nested loop vs single-pass optimization."""
    
    test_text = """
    Company: TechCorp Industries
    Position: Senior Software Engineer
    Location: San Francisco, CA
    """
    
    # OLD: Nested loop approach
    def old_extract(text: str) -> str:
        lines = text.split("\n")[:10]
        keywords = ["company:", "employer:", "organization:"]
        for line in lines:
            if any(keyword in line.lower() for keyword in keywords):
                for keyword in keywords:
                    if keyword in line.lower():
                        company = line.lower().split(keyword)[1].strip()
                        return company.split()[0] if company else None
        return None
    
    # NEW: Single-pass approach
    def new_extract(text: str) -> str:
        lines = text.split("\n")[:10]
        keywords = ["company:", "employer:", "organization:"]
        for line in lines:
            line_lower = line.lower()
            for keyword in keywords:
                if keyword in line_lower:
                    company = line_lower.split(keyword, 1)[1].strip()
                    return company.split()[0] if company else None
        return None
    
    old_time = benchmark(old_extract, 10000, test_text)
    new_time = benchmark(new_extract, 10000, test_text)
    
    improvement = ((old_time - new_time) / old_time) * 100
    
    print(f"Nested Loop Optimization:")
    print(f"  Old approach: {old_time:.4f} ms")
    print(f"  New approach: {new_time:.4f} ms")
    print(f"  Improvement: {improvement:.1f}%\n")


def test_list_comprehension_vs_sum():
    """Test list comprehension vs generator expression with sum."""
    
    # Use a much larger dataset to see memory benefits
    test_tokens = ["hello", "world", " ", "this", "is", " ", "a", "test"] * 10000
    
    # OLD: List comprehension (creates intermediate list in memory)
    def old_count(tokens: List[str]) -> int:
        return len([t for t in tokens if t.strip()])
    
    # NEW: Generator with sum (no intermediate list)
    def new_count(tokens: List[str]) -> int:
        return sum(1 for t in tokens if t.strip())
    
    old_time = benchmark(old_count, 1000, test_tokens)
    new_time = benchmark(new_count, 1000, test_tokens)
    
    improvement = ((old_time - new_time) / old_time) * 100
    
    print(f"List Comprehension vs Sum Optimization (Memory-Focused):")
    print(f"  Old approach: {old_time:.4f} ms (creates list of {len(test_tokens)} items)")
    print(f"  New approach: {new_time:.4f} ms (O(1) memory)")
    print(f"  Speed change: {improvement:.1f}%")
    print(f"  Memory benefit: {len(test_tokens) * 8} bytes saved (approximate)\n")


def test_cached_lower():
    """Test caching .lower() calls."""
    
    test_lines = [
        "Key Selection Criteria",
        "1. Must have 5 years experience",
        "2. Strong communication skills",
        "3. Team leadership abilities",
        "4. Technical expertise in Python",
        "Desirable criteria",
    ] * 20
    
    # OLD: Repeated .lower() calls
    def old_parse(lines: List[str]) -> List[str]:
        criteria = []
        in_section = False
        for line in lines:
            line = line.strip()
            if "key selection" in line.lower():
                in_section = True
                continue
            if in_section and (not line or line.lower().startswith("desirable")):
                break
            if in_section and line[0].isdigit():
                criteria.append(line)
        return criteria
    
    # NEW: Cached .lower()
    def new_parse(lines: List[str]) -> List[str]:
        criteria = []
        in_section = False
        for line in lines:
            line_stripped = line.strip()
            line_lower = line_stripped.lower()
            if "key selection" in line_lower:
                in_section = True
                continue
            if in_section and (not line_stripped or line_lower.startswith("desirable")):
                break
            if in_section and line_stripped and line_stripped[0].isdigit():
                criteria.append(line_stripped)
        return criteria
    
    old_time = benchmark(old_parse, 5000, test_lines)
    new_time = benchmark(new_parse, 5000, test_lines)
    
    improvement = ((old_time - new_time) / old_time) * 100
    
    print(f"Cached String Operations Optimization:")
    print(f"  Old approach: {old_time:.4f} ms")
    print(f"  New approach: {new_time:.4f} ms")
    print(f"  Improvement: {improvement:.1f}%\n")


def test_dict_iteration():
    """Test dictionary iteration optimization."""
    
    test_store = {str(i): {"user_id": "user1" if i % 3 == 0 else "user2", "data": f"job_{i}"} 
                  for i in range(1000)}
    
    # OLD: Convert to list then filter
    def old_filter(store: dict, user_id: str) -> List[dict]:
        jobs = list(store.values())
        return [j for j in jobs if j.get("user_id") == user_id]
    
    # NEW: Filter directly from dict.values()
    def new_filter(store: dict, user_id: str) -> List[dict]:
        return [j for j in store.values() if j.get("user_id") == user_id]
    
    old_time = benchmark(old_filter, 5000, test_store, "user1")
    new_time = benchmark(new_filter, 5000, test_store, "user1")
    
    improvement = ((old_time - new_time) / old_time) * 100
    
    print(f"Dictionary Iteration Optimization:")
    print(f"  Old approach: {old_time:.4f} ms")
    print(f"  New approach: {new_time:.4f} ms")
    print(f"  Improvement: {improvement:.1f}%\n")


if __name__ == "__main__":
    print("=" * 60)
    print("Performance Optimization Benchmarks")
    print("=" * 60)
    print()
    
    test_nested_loop_optimization()
    test_list_comprehension_vs_sum()
    test_cached_lower()
    test_dict_iteration()
    
    print("=" * 60)
    print("Benchmark complete!")
    print("=" * 60)
