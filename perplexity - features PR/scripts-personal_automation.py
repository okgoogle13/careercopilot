#!/usr/bin/env python3
"""
Personal Career Automation Script
Command-line interface for all personal CareerCopilot automation
"""

import asyncio
import sys
import os
import argparse
import logging
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, TaskID

# Add project root to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.backend.personal_workflow import PersonalCareerWorkflow
from config.personal_config import get_personal_config

console = Console()
logger = logging.getLogger(__name__)

class PersonalAutomation:
    """Personal automation interface for CareerCopilot"""

    def __init__(self):
        self.workflow = PersonalCareerWorkflow()
        self.config = get_personal_config()

    async def morning_routine(self) -> None:
        """Run the complete morning job discovery routine"""

        console.print(Panel.fit(
            "🌅 Starting Morning Career Routine",
            style="bold blue"
        ))

        try:
            with Progress() as progress:
                task = progress.add_task("[cyan]Discovering new jobs...", total=100)

                # Update progress through different steps
                progress.update(task, advance=20)
                console.print("🔍 Scanning job boards...")

                progress.update(task, advance=30)
                console.print("🤖 Analyzing job matches...")

                progress.update(task, advance=30)
                console.print("📄 Generating application materials...")

                progress.update(task, advance=20)
                console.print("📧 Sending daily summary...")

                # Execute the actual workflow
                results = await self.workflow.daily_job_discovery()

            # Display results
            self._display_morning_results(results)

        except Exception as e:
            console.print(f"❌ Morning routine failed: {str(e)}", style="bold red")
            logger.error(f"Morning routine error: {e}")

    async def apply_to_job(self, job_url: str, message: str = None) -> None:
        """Apply to a specific job with full automation"""

        console.print(Panel.fit(
            f"📝 Preparing Application\n{job_url}",
            style="bold green"
        ))

        try:
            with Progress() as progress:
                task = progress.add_task("[green]Preparing application...", total=100)

                progress.update(task, advance=25)
                console.print("🔍 Researching company...")

                progress.update(task, advance=25)
                console.print("📄 Generating tailored resume...")

                progress.update(task, advance=25)
                console.print("✍️ Creating cover letter...")

                progress.update(task, advance=25)
                console.print("🎯 Optimizing for ATS...")

                # Execute application preparation
                results = await self.workflow.apply_to_job(job_url, message)

            # Display results
            self._display_application_results(results)

        except Exception as e:
            console.print(f"❌ Application preparation failed: {str(e)}", style="bold red")
            logger.error(f"Application error: {e}")

    async def weekly_review(self) -> None:
        """Run weekly application review and progress summary"""

        console.print(Panel.fit(
            "📊 Weekly Career Review",
            style="bold magenta"
        ))

        try:
            with Progress() as progress:
                task = progress.add_task("[magenta]Reviewing applications...", total=100)

                progress.update(task, advance=33)
                console.print("📧 Checking email for responses...")

                progress.update(task, advance=33)
                console.print("📈 Analyzing progress...")

                progress.update(task, advance=34)
                console.print("🎯 Generating insights...")

                # Execute weekly review
                results = await self.workflow.weekly_review()

            # Display results
            self._display_weekly_results(results)

        except Exception as e:
            console.print(f"❌ Weekly review failed: {str(e)}", style="bold red")
            logger.error(f"Weekly review error: {e}")

    async def quick_research(self, job_url: str) -> None:
        """Quick company research for a job URL"""

        console.print(Panel.fit(
            f"🏢 Quick Company Research\n{job_url}",
            style="bold cyan"
        ))

        try:
            with Progress() as progress:
                task = progress.add_task("[cyan]Researching company...", total=100)

                progress.update(task, advance=50)
                console.print("🔍 Extracting company information...")

                progress.update(task, advance=50)
                console.print("💡 Generating talking points...")

                # Execute company research
                research = await self.workflow.quick_company_research(job_url)

            # Display research results
            self._display_research_results(research)

        except Exception as e:
            console.print(f"❌ Company research failed: {str(e)}", style="bold red")
            logger.error(f"Research error: {e}")

    def _display_morning_results(self, results: dict) -> None:
        """Display morning routine results in a nice format"""

        table = Table(title="🌅 Morning Job Discovery Results")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="bold green")

        table.add_row("Total Jobs Found", str(results["total_jobs_found"]))
        table.add_row("Promising Jobs", str(results["promising_jobs"]))
        table.add_row("Materials Prepared", str(results["materials_prepared"]))

        console.print(table)

        if results.get("summary"):
            console.print(Panel(
                results["summary"],
                title="📋 Daily Summary",
                style="green"
            ))

        if results.get("jobs"):
            console.print("\n🎯 Top Opportunities:")
            for i, job in enumerate(results["jobs"][:5], 1):
                console.print(f"{i}. {job['title']} at {job['company']} "
                            f"(Match: {job['match_score']:.1%})")

    def _display_application_results(self, results: dict) -> None:
        """Display application preparation results"""

        if results.get("status") == "success":
            console.print("✅ Application materials ready!", style="bold green")

            table = Table(title="📄 Application Summary")
            table.add_column("Field", style="cyan")
            table.add_column("Value", style="green")

            table.add_row("Job Title", results["job_title"])
            table.add_row("Company", results["company"])
            table.add_row("Materials Generated", "✅ Yes" if results["materials_generated"] else "❌ No")
            table.add_row("Research Completed", "✅ Yes" if results["research_completed"] else "❌ No")
            table.add_row("Application Tracked", "✅ Yes" if results["application_tracked"] else "❌ No")

            console.print(table)
            console.print("\n📧 Check your email for detailed materials and talking points!")
        else:
            console.print("❌ Application preparation failed", style="bold red")

    def _display_weekly_results(self, results: dict) -> None:
        """Display weekly review results"""

        table = Table(title="📊 Weekly Progress Summary")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="bold magenta")

        table.add_row("Applications Reviewed", str(results["applications_reviewed"]))
        table.add_row("Email Updates Found", str(results["email_updates_found"]))

        console.print(table)

        if results.get("summary"):
            console.print(Panel(
                results["summary"],
                title="📈 Weekly Insights",
                style="magenta"
            ))

        if results.get("skills_analysis"):
            console.print(Panel(
                results["skills_analysis"]["recommendations"],
                title="🎯 Skills Development Focus",
                style="yellow"
            ))

    def _display_research_results(self, research: dict) -> None:
        """Display company research results"""

        console.print(f"\n🏢 **{research['company']}**", style="bold blue")

        if research.get("talking_points"):
            console.print(Panel(
                research["talking_points"][:500] + "...",
                title="💬 Key Talking Points",
                style="green"
            ))

        if research.get("application_strategy"):
            console.print(Panel(
                research["application_strategy"][:500] + "...",
                title="🎯 Application Strategy",
                style="cyan"
            ))

        console.print("\n📝 Full research details saved to your dashboard!")

def create_parser() -> argparse.ArgumentParser:
    """Create command line argument parser"""

    parser = argparse.ArgumentParser(
        description="Personal CareerCopilot Automation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s morning                    # Run morning job discovery
  %(prog)s apply "https://job.com"    # Apply to specific job
  %(prog)s review                     # Weekly review
  %(prog)s research "https://job.com" # Research company
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Morning routine
    morning_parser = subparsers.add_parser("morning", help="Run morning job discovery")

    # Apply to job
    apply_parser = subparsers.add_parser("apply", help="Apply to specific job")
    apply_parser.add_argument("url", help="Job URL to apply to")
    apply_parser.add_argument("-m", "--message", help="Custom message/notes")

    # Weekly review
    review_parser = subparsers.add_parser("review", help="Run weekly review")

    # Company research
    research_parser = subparsers.add_parser("research", help="Research company from job URL")
    research_parser.add_argument("url", help="Job URL to research")

    # Configuration
    config_parser = subparsers.add_parser("config", help="Show current configuration")

    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    parser.add_argument("--log-file", help="Log file path")

    return parser

async def main():
    """Main entry point for personal automation"""

    parser = create_parser()
    args = parser.parse_args()

    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

    if args.log_file:
        logging.basicConfig(
            level=log_level,
            format=log_format,
            filename=args.log_file
        )
    else:
        logging.basicConfig(level=log_level, format=log_format)

    if not args.command:
        parser.print_help()
        return

    # Initialize automation
    automation = PersonalAutomation()

    try:
        if args.command == "morning":
            await automation.morning_routine()

        elif args.command == "apply":
            await automation.apply_to_job(args.url, args.message)

        elif args.command == "review":
            await automation.weekly_review()

        elif args.command == "research":
            await automation.quick_research(args.url)

        elif args.command == "config":
            config = get_personal_config()

            console.print(Panel.fit(
                "⚙️ Personal Configuration",
                style="bold blue"
            ))

            table = Table(title="Current Settings")
            table.add_column("Setting", style="cyan")
            table.add_column("Value", style="green")

            table.add_row("Name", config.name)
            table.add_row("Email", config.email)
            table.add_row("Location", config.location)
            table.add_row("Career Transition", f"{config.career_transition_from} → {config.career_transition_to}")
            table.add_row("Target Roles", ", ".join(config.target_roles[:3]) + "...")
            table.add_row("Daily Automation", "✅ Enabled" if config.daily_job_scan else "❌ Disabled")

            console.print(table)

    except KeyboardInterrupt:
        console.print("\n👋 Automation cancelled by user", style="yellow")

    except Exception as e:
        console.print(f"\n❌ Automation failed: {str(e)}", style="bold red")
        if args.verbose:
            console.print_exception()
        sys.exit(1)

if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())