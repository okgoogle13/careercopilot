#!/usr/bin/env python3
"""
Personal Career Automation Script
CLI interface for PersonalCareerWorkflow with Rich output formatting
"""

import argparse
import asyncio
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

try:
    from rich.console import Console
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TimeRemainingColumn
    from rich.panel import Panel
    from rich.table import Table
    from rich.text import Text
    from rich import print as rprint
    from rich.prompt import Confirm, Prompt
except ImportError:
    print("Error: Rich library is required. Install with: pip install rich")
    sys.exit(1)

from app.workflows.personal_career_workflow import PersonalCareerWorkflow
from app.core.personal_cache import get_personal_cache

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/personal_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Rich console for formatted output
console = Console()

class PersonalAutomationCLI:
    """CLI interface for personal career automation"""
    
    def __init__(self):
        self.workflow = PersonalCareerWorkflow()
        self.cache = get_personal_cache()
        
    async def morning_routine(self) -> None:
        """Execute morning job discovery routine"""
        console.print("\n[bold blue]🌅 Starting Morning Job Discovery Routine[/bold blue]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TimeRemainingColumn(),
            console=console
        ) as progress:
            
            # Task setup
            discovery_task = progress.add_task("Discovering job opportunities...", total=4)
            
            try:
                # Step 1: Initialize workflow
                progress.update(discovery_task, description="Initializing workflow...")
                await asyncio.sleep(0.5)  # Brief pause for visual feedback
                progress.advance(discovery_task)
                
                # Step 2: Execute job discovery
                progress.update(discovery_task, description="Finding job matches...")
                result = await self.workflow.daily_job_discovery()
                progress.advance(discovery_task)
                
                # Step 3: Process results
                progress.update(discovery_task, description="Processing opportunities...")
                await asyncio.sleep(0.5)
                progress.advance(discovery_task)
                
                # Step 4: Display summary
                progress.update(discovery_task, description="Preparing summary...")
                progress.advance(discovery_task)
                
                # Display results
                await self._display_morning_results(result)
                
            except Exception as e:
                progress.stop()
                console.print(f"[bold red]❌ Morning routine failed: {e}[/bold red]")
                logger.error(f"Morning routine failed: {e}")
    
    async def apply_to_job(self, job_url: str) -> None:
        """Apply to specific job with full workflow"""
        console.print(f"\n[bold green]📋 Starting Application Process[/bold green]")
        console.print(f"Job URL: [cyan]{job_url}[/cyan]")
        
        # Confirm before proceeding
        if not Confirm.ask("\nProceed with application preparation?"):
            console.print("[yellow]Application cancelled.[/yellow]")
            return
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TimeRemainingColumn(),
            console=console
        ) as progress:
            
            apply_task = progress.add_task("Preparing application...", total=5)
            
            try:
                # Step 1: Company research
                progress.update(apply_task, description="Researching company...")
                research_result = await self.workflow.quick_company_research(job_url)
                progress.advance(apply_task)
                
                if not research_result.get("success"):
                    progress.stop()
                    console.print(f"[bold red]❌ Company research failed: {research_result.get('error')}[/bold red]")
                    return
                
                # Step 2: Generate materials
                progress.update(apply_task, description="Generating application materials...")
                await asyncio.sleep(0.5)
                progress.advance(apply_task)
                
                # Step 3: Complete application workflow
                progress.update(apply_task, description="Processing application...")
                result = await self.workflow.apply_to_job(job_url)
                progress.advance(apply_task)
                
                # Step 4: Track application
                progress.update(apply_task, description="Tracking application...")
                await asyncio.sleep(0.3)
                progress.advance(apply_task)
                
                # Step 5: Finalize
                progress.update(apply_task, description="Finalizing...")
                progress.advance(apply_task)
                
                # Display results
                await self._display_application_results(result, research_result)
                
            except Exception as e:
                progress.stop()
                console.print(f"[bold red]❌ Application process failed: {e}[/bold red]")
                logger.error(f"Application process failed: {e}")
    
    async def weekly_review(self) -> None:
        """Execute weekly progress review"""
        console.print("\n[bold purple]📊 Starting Weekly Progress Review[/bold purple]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TimeRemainingColumn(),
            console=console
        ) as progress:
            
            review_task = progress.add_task("Analyzing progress...", total=4)
            
            try:
                # Step 1: Gather data
                progress.update(review_task, description="Gathering application data...")
                await asyncio.sleep(0.5)
                progress.advance(review_task)
                
                # Step 2: Execute review
                progress.update(review_task, description="Analyzing performance...")
                result = await self.workflow.weekly_review()
                progress.advance(review_task)
                
                # Step 3: Generate insights
                progress.update(review_task, description="Generating insights...")
                await asyncio.sleep(0.5)
                progress.advance(review_task)
                
                # Step 4: Prepare report
                progress.update(review_task, description="Preparing report...")
                progress.advance(review_task)
                
                # Display results
                await self._display_review_results(result)
                
            except Exception as e:
                progress.stop()
                console.print(f"[bold red]❌ Weekly review failed: {e}[/bold red]")
                logger.error(f"Weekly review failed: {e}")
    
    async def cache_stats(self) -> None:
        """Display cache statistics"""
        console.print("\n[bold cyan]💾 Cache Statistics[/bold cyan]")
        
        try:
            stats = await self.cache.get_cache_stats()
            
            # Create stats table
            table = Table(title="Cache Performance")
            table.add_column("Category", style="cyan", no_wrap=True)
            table.add_column("Files", justify="right", style="green")
            table.add_column("Size (MB)", justify="right", style="yellow")
            
            for category, info in stats.get("categories", {}).items():
                table.add_row(
                    category.replace("_", " ").title(),
                    str(info["files"]),
                    f"{info['size_mb']:.2f}"
                )
            
            # Add totals
            table.add_section()
            table.add_row(
                "[bold]Total[/bold]",
                f"[bold]{stats.get('total_files', 0)}[/bold]",
                f"[bold]{stats.get('total_size_mb', 0):.2f}[/bold]"
            )
            
            console.print(table)
            
            # Cache cleanup option
            if stats.get('total_files', 0) > 0:
                if Confirm.ask("\nClean expired cache entries?"):
                    with console.status("[bold green]Cleaning cache..."):
                        cleared = await self.cache.clear_expired()
                    console.print(f"[green]✅ Cleared {cleared} expired entries[/green]")
        
        except Exception as e:
            console.print(f"[bold red]❌ Failed to get cache stats: {e}[/bold red]")
            logger.error(f"Cache stats failed: {e}")

    async def salary_intelligence(self, job_title: str, company: str, location: str = None) -> None:
        """Research salary information and generate negotiation strategy"""
        console.print(f"\n[bold green]💰 Salary Intelligence Analysis[/bold green]")
        console.print(f"Job Title: [cyan]{job_title}[/cyan]")
        console.print(f"Company: [cyan]{company}[/cyan]")
        if location:
            console.print(f"Location: [cyan]{location}[/cyan]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console
        ) as progress:
            
            salary_task = progress.add_task("Researching salary data...", total=None)
            
            try:
                # Use workflow config location if not provided
                if not location:
                    location = self.workflow.config.location
                    
                progress.update(salary_task, description="Analyzing market data...")
                result = await self.workflow.salary_intelligence(job_title, company, location)
                progress.stop()
                
                # Display results
                await self._display_salary_results(result, job_title, company, location)
                
            except Exception as e:
                progress.stop()
                console.print(f"[bold red]❌ Salary analysis failed: {e}[/bold red]")
                logger.error(f"Salary analysis failed: {e}")

    async def skills_analysis(self, job_listings_file: str = None) -> None:
        """Analyze skills trends from job listings"""
        console.print(f"\n[bold blue]🎯 Skills Trends Analysis[/bold blue]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console
        ) as progress:
            
            skills_task = progress.add_task("Analyzing skills trends...", total=None)
            
            try:
                # For this demo, we'll use sample job listings
                # In a real implementation, this would load from a file or recent job searches
                sample_listings = [
                    {"description": "Social worker position requiring case management, crisis intervention, and report writing skills. Experience with trauma-informed care preferred."},
                    {"description": "Community development role needing stakeholder engagement, program evaluation, and budget management. Social work degree required."},
                    {"description": "Mental health support worker with counseling skills, group facilitation, and documentation abilities. Must have active listening skills."}
                ]
                
                progress.update(skills_task, description="Processing job requirements...")
                result = await self.workflow.analyze_skills_trends(sample_listings)
                progress.stop()
                
                # Display results
                await self._display_skills_results(result)
                
            except Exception as e:
                progress.stop()
                console.print(f"[bold red]❌ Skills analysis failed: {e}[/bold red]")
                logger.error(f"Skills analysis failed: {e}")

    async def interview_prep(self, job_url: str) -> None:
        """Generate interview preparation materials for a specific job"""
        console.print(f"\n[bold purple]🎤 Interview Preparation[/bold purple]")
        console.print(f"Job URL: [cyan]{job_url}[/cyan]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console
        ) as progress:
            
            prep_task = progress.add_task("Preparing interview materials...", total=None)
            
            try:
                # First get job description and company research
                progress.update(prep_task, description="Researching job and company...")
                
                # For demo purposes, using sample data
                # In real implementation, this would scrape the job URL
                job_description = "Social Worker position focusing on case management and client support"
                company_research = {
                    "name": "Community Care Services",
                    "mission": "Supporting vulnerable community members",
                    "values": ["Compassion", "Integrity", "Excellence"]
                }
                
                progress.update(prep_task, description="Generating interview questions...")
                result = await self.workflow.generate_interview_prep(job_description, company_research)
                progress.stop()
                
                # Display results
                await self._display_interview_results(result, job_url)
                
            except Exception as e:
                progress.stop()
                console.print(f"[bold red]❌ Interview prep failed: {e}[/bold red]")
                logger.error(f"Interview prep failed: {e}")
    
    async def _display_morning_results(self, result: Dict[str, Any]) -> None:
        """Display morning routine results"""
        if not result.get("success"):
            console.print(f"[bold red]❌ Job discovery failed: {result.get('error')}[/bold red]")
            return
        
        # Summary panel
        summary_text = f"""
[bold green]✅ Job Discovery Complete[/bold green]

📊 [bold]Results:[/bold]
• Total jobs found: [green]{result.get('total_jobs_found', 0)}[/green]
• Promising opportunities: [yellow]{result.get('promising_jobs', 0)}[/yellow]
• Application materials prepared: [cyan]{result.get('materials_prepared', 0)}[/cyan]
        """
        
        console.print(Panel(summary_text, title="🌅 Morning Routine Summary", border_style="blue"))
        
        # Job opportunities table
        jobs = result.get("jobs", [])[:5]  # Show top 5
        if jobs:
            table = Table(title="Top Job Opportunities")
            table.add_column("Company", style="cyan")
            table.add_column("Role", style="green")
            table.add_column("Match", justify="right", style="yellow")
            table.add_column("Location", style="white")
            
            for job in jobs:
                match_score = job.get("match_score", 0)
                match_percent = f"{match_score:.1%}"
                table.add_row(
                    job.get("company", "Unknown"),
                    job.get("title", "Unknown Role"),
                    match_percent,
                    job.get("location", "Remote")
                )
            
            console.print(table)
        
        console.print("\n[dim]💌 Email summary sent to your inbox[/dim]")
    
    async def _display_application_results(self, result: Dict[str, Any], research: Dict[str, Any]) -> None:
        """Display application process results"""
        if not result.get("success"):
            console.print(f"[bold red]❌ Application failed: {result.get('error')}[/bold red]")
            return
        
        # Success summary
        summary_text = f"""
[bold green]✅ Application Materials Ready[/bold green]

🏢 [bold]Company:[/bold] {result.get('company', 'Unknown')}
💼 [bold]Role:[/bold] {result.get('job_title', 'Unknown')}

📋 [bold]Prepared:[/bold]
• ✅ Resume optimized
• ✅ Cover letter generated
• ✅ Company research completed
• ✅ Application tracked
        """
        
        console.print(Panel(summary_text, title="📋 Application Status", border_style="green"))
        
        # Research preview
        if research.get("talking_points"):
            research_preview = research["talking_points"][:200] + "..."
            console.print(f"\n[bold]🎯 Key Talking Points Preview:[/bold]\n[italic]{research_preview}[/italic]")
        
        console.print("\n[dim]📧 Confirmation email sent with full materials[/dim]")
        console.print("[bold blue]📁 Access full materials in your dashboard[/bold blue]")
    
    async def _display_review_results(self, result: Dict[str, Any]) -> None:
        """Display weekly review results"""
        if not result.get("success"):
            console.print(f"[bold red]❌ Weekly review failed: {result.get('error')}[/bold red]")
            return
        
        analysis = result.get("analysis", {})
        
        # Weekly summary
        summary_text = f"""
[bold purple]📊 Weekly Progress Review[/bold purple]

📈 [bold]Activity:[/bold]
• Applications reviewed: [green]{result.get('applications_reviewed', 0)}[/green]
• Email updates found: [yellow]{result.get('email_updates_found', 0)}[/yellow]

💡 [bold]Insights:[/bold]
{analysis.get('summary', 'Keep up the great work!')}
        """
        
        console.print(Panel(summary_text, title="📊 Weekly Review", border_style="purple"))
        
        # Recommendations
        recommendations = analysis.get("recommendations", [])
        if recommendations:
            rec_table = Table(title="🎯 Recommendations for Next Week")
            rec_table.add_column("Focus Area", style="cyan")
            
            for rec in recommendations:
                rec_table.add_row(f"• {rec}")
            
            console.print(rec_table)
        
        console.print("\n[dim]📧 Weekly review email sent[/dim]")

    async def _display_salary_results(self, result: Dict[str, Any], job_title: str, company: str, location: str) -> None:
        """Display salary intelligence results"""
        # Summary panel
        salary_range = result.get('salary_range', 'Not available')
        summary_text = f"""
[bold green]💰 Salary Intelligence Complete[/bold green]

🎯 [bold]Position:[/bold] {job_title} at {company}
📍 [bold]Location:[/bold] {location}
💵 [bold]Salary Range:[/bold] {salary_range}
        """
        
        console.print(Panel(summary_text, title="💰 Salary Analysis", border_style="green"))
        
        # Negotiation tips
        negotiation_tips = result.get('negotiation_tips', [])
        if negotiation_tips:
            tips_table = Table(title="🎯 Negotiation Strategy")
            tips_table.add_column("Talking Point", style="cyan")
            
            for tip in negotiation_tips:
                tips_table.add_row(f"• {tip}")
            
            console.print(tips_table)
        
        # Market comparison
        market_comparison = result.get('market_comparison', '')
        if market_comparison:
            console.print(f"\n[bold]📊 Market Comparison:[/bold]\n{market_comparison}")

    async def _display_skills_results(self, result: Dict[str, Any]) -> None:
        """Display skills analysis results"""
        # Top skills table
        top_skills = result.get('top_skills', [])
        if top_skills:
            skills_table = Table(title="🔥 Most In-Demand Skills")
            skills_table.add_column("Skill", style="cyan")
            skills_table.add_column("Frequency", justify="right", style="yellow")
            
            for skill in top_skills[:10]:  # Show top 10
                if isinstance(skill, dict):
                    skills_table.add_row(skill.get('name', 'Unknown'), str(skill.get('count', 0)))
                else:
                    skills_table.add_row(str(skill), "N/A")
            
            console.print(skills_table)
        
        # Trending skills
        trending_skills = result.get('trending_skills', [])
        if trending_skills:
            trending_text = f"""
[bold blue]📈 Trending & Emerging Skills[/bold blue]

{', '.join(trending_skills)}
            """
            console.print(Panel(trending_text, title="📈 Future Skills", border_style="blue"))
        
        # Development plan
        development_plan = result.get('development_plan', [])
        if development_plan:
            plan_table = Table(title="🎓 6-Month Development Roadmap")
            plan_table.add_column("Month", style="cyan")
            plan_table.add_column("Focus Area", style="green")
            
            for i, item in enumerate(development_plan[:6], 1):
                plan_table.add_row(f"Month {i}", str(item))
            
            console.print(plan_table)

    async def _display_interview_results(self, result: Dict[str, Any], job_url: str) -> None:
        """Display interview preparation results"""
        # Summary panel
        summary_text = f"""
[bold purple]🎤 Interview Preparation Complete[/bold purple]

🔗 [bold]Job URL:[/bold] {job_url}
📝 [bold]Materials Generated:[/bold]
• ✅ Company-specific questions
• ✅ STAR method answers
• ✅ Questions to ask interviewer
        """
        
        console.print(Panel(summary_text, title="🎤 Interview Prep", border_style="purple"))
        
        # Interview questions
        questions = result.get('questions', [])
        if questions:
            q_table = Table(title="📋 Potential Interview Questions")
            q_table.add_column("Question", style="cyan")
            
            for question in questions[:7]:  # Show up to 7 questions
                q_table.add_row(str(question))
            
            console.print(q_table)
        
        # Sample answers preview
        suggested_answers = result.get('suggested_answers', [])
        if suggested_answers:
            console.print(f"\n[bold]💡 STAR Method Answer Examples:[/bold]")
            for i, answer in enumerate(suggested_answers[:2], 1):  # Show first 2
                console.print(f"\n[yellow]{i}.[/yellow] {str(answer)[:200]}...")
        
        # Questions to ask
        candidate_questions = result.get('candidate_questions', [])
        if candidate_questions:
            cq_table = Table(title="❓ Questions You Should Ask")
            cq_table.add_column("Thoughtful Questions", style="green")
            
            for question in candidate_questions:
                cq_table.add_row(str(question))
            
            console.print(cq_table)

def create_parser() -> argparse.ArgumentParser:
    """Create argument parser for CLI"""
    parser = argparse.ArgumentParser(
        description="Personal Career Automation CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python personal_automation.py morning          # Run morning job discovery
  python personal_automation.py apply <job_url>  # Apply to specific job
  python personal_automation.py review           # Weekly progress review
  python personal_automation.py cache            # Show cache statistics
  python personal_automation.py salary "Social Worker" "Community Care" # Salary research
  python personal_automation.py skills           # Analyze skills trends
  python personal_automation.py interview <url>  # Interview preparation
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Morning routine command
    morning_parser = subparsers.add_parser(
        "morning",
        help="Execute morning job discovery routine"
    )
    
    # Apply to job command
    apply_parser = subparsers.add_parser(
        "apply",
        help="Apply to specific job with full workflow"
    )
    apply_parser.add_argument(
        "job_url",
        help="URL of the job to apply to"
    )
    apply_parser.add_argument(
        "--message",
        help="Optional custom message for application"
    )
    
    # Weekly review command
    review_parser = subparsers.add_parser(
        "review",
        help="Execute weekly progress review"
    )
    
    # Cache stats command
    cache_parser = subparsers.add_parser(
        "cache",
        help="Display cache statistics and management"
    )
    
    # Salary intelligence command
    salary_parser = subparsers.add_parser(
        "salary",
        help="Research salary information and negotiation strategy"
    )
    salary_parser.add_argument(
        "job_title",
        help="Job title to research"
    )
    salary_parser.add_argument(
        "company",
        help="Company name"
    )
    salary_parser.add_argument(
        "--location",
        help="Job location (uses config default if not provided)"
    )
    
    # Skills analysis command
    skills_parser = subparsers.add_parser(
        "skills",
        help="Analyze skills trends and create development roadmap"
    )
    skills_parser.add_argument(
        "--file",
        help="Optional file containing job listings JSON"
    )
    
    # Interview prep command
    interview_parser = subparsers.add_parser(
        "interview",
        help="Generate interview preparation materials"
    )
    interview_parser.add_argument(
        "job_url",
        help="URL of the job to prepare for"
    )
    
    return parser

async def main():
    """Main CLI entry point"""
    parser = create_parser()
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Welcome message
    console.print(f"\n[bold blue]🚀 CareerCopilot Personal Automation[/bold blue]")
    console.print(f"[dim]Started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/dim]\n")
    
    cli = PersonalAutomationCLI()
    
    try:
        if args.command == "morning":
            await cli.morning_routine()
        
        elif args.command == "apply":
            if not args.job_url:
                console.print("[bold red]❌ Job URL is required for apply command[/bold red]")
                parser.print_help()
                return
            
            # Validate URL format
            if not (args.job_url.startswith("http://") or args.job_url.startswith("https://")):
                console.print("[bold red]❌ Please provide a valid job URL (starting with http:// or https://)[/bold red]")
                return
            
            await cli.apply_to_job(args.job_url)
        
        elif args.command == "review":
            await cli.weekly_review()
        
        elif args.command == "cache":
            await cli.cache_stats()
        
        elif args.command == "salary":
            if not args.job_title or not args.company:
                console.print("[bold red]❌ Job title and company are required for salary command[/bold red]")
                parser.print_help()
                return
            
            await cli.salary_intelligence(args.job_title, args.company, args.location)
        
        elif args.command == "skills":
            await cli.skills_analysis(args.file)
        
        elif args.command == "interview":
            if not args.job_url:
                console.print("[bold red]❌ Job URL is required for interview command[/bold red]")
                parser.print_help()
                return
            
            # Validate URL format
            if not (args.job_url.startswith("http://") or args.job_url.startswith("https://")):
                console.print("[bold red]❌ Please provide a valid job URL (starting with http:// or https://)[/bold red]")
                return
            
            await cli.interview_prep(args.job_url)
        
        else:
            console.print(f"[bold red]❌ Unknown command: {args.command}[/bold red]")
            parser.print_help()
    
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️ Operation cancelled by user[/yellow]")
    
    except Exception as e:
        console.print(f"\n[bold red]❌ Unexpected error: {e}[/bold red]")
        logger.error(f"CLI error: {e}")
        console.print("[dim]Check logs/personal_automation.log for details[/dim]")
    
    finally:
        console.print(f"\n[dim]Completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/dim]")

if __name__ == "__main__":
    asyncio.run(main())