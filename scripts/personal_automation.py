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

from app.personal_workflow import PersonalCareerWorkflow, PersonalCareerConfig
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