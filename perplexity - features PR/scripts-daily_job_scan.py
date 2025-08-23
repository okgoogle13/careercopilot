#!/usr/bin/env python3
"""
Daily Job Scan Script
Automated morning job discovery for personal use
Can be run manually or scheduled with cron
"""

import asyncio
import sys
import os
import logging
from datetime import datetime
from typing import List, Dict, Any

# Add project root to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.backend.personal_workflow import PersonalCareerWorkflow
from config.personal_config import get_personal_config

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/daily_job_scan.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class DailyJobScanner:
    """Personal daily job scanning system"""
    
    def __init__(self):
        self.config = get_personal_config()
        self.workflow = PersonalCareerWorkflow()
        
    async def run_daily_scan(self) -> Dict[str, Any]:
        """Execute complete daily job scanning routine"""
        
        logger.info("=== Starting Daily Job Scan ===")
        logger.info(f"User: {self.config.name}")
        logger.info(f"Location: {self.config.location}")
        logger.info(f"Target roles: {', '.join(self.config.target_roles[:3])}...")
        
        try:
            # Run the main workflow
            results = await self.workflow.daily_job_discovery()
            
            # Log summary
            logger.info(f"Scan completed successfully:")
            logger.info(f"  - Total jobs found: {results['total_jobs_found']}")
            logger.info(f"  - Promising matches: {results['promising_jobs']}")
            logger.info(f"  - Materials prepared: {results['materials_prepared']}")
            
            if self.config.email_notifications:
                logger.info("  - Daily summary email sent")
            
            return results
            
        except Exception as e:
            logger.error(f"Daily scan failed: {str(e)}")
            
            # Send error notification if email is enabled
            if self.config.email_notifications:
                await self._send_error_notification(str(e))
            
            raise
    
    async def _send_error_notification(self, error_message: str) -> None:
        """Send email notification about scan failure"""
        
        try:
            from src.backend.agents.email_agent import EmailIntegrationAgent
            
            email_agent = EmailIntegrationAgent()
            
            await email_agent.send({
                "action": "send",
                "recipient": self.config.email,
                "subject": "❌ Daily Job Scan Failed",
                "body": f"""
Hi {self.config.name},

Your daily job scan encountered an error:

Error: {error_message}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Please check the logs and try running the scan manually:
python scripts/daily_job_scan.py

Best regards,
CareerCopilot System
                """
            })
            
        except Exception as e:
            logger.error(f"Failed to send error notification: {e}")
    
    def print_summary(self, results: Dict[str, Any]) -> None:
        """Print human-readable summary to console"""
        
        print("\n" + "="*50)
        print("📊 DAILY JOB SCAN SUMMARY")
        print("="*50)
        
        print(f"📅 Date: {datetime.now().strftime('%A, %B %d, %Y')}")
        print(f"👤 User: {self.config.name}")
        print(f"📍 Location: {self.config.location}")
        
        print(f"\n🔍 RESULTS:")
        print(f"  Total Jobs Found: {results['total_jobs_found']}")
        print(f"  Promising Matches: {results['promising_jobs']}")
        print(f"  Application Materials Prepared: {results['materials_prepared']}")
        
        if results.get('jobs'):
            print(f"\n🎯 TOP OPPORTUNITIES:")
            for i, job in enumerate(results['jobs'][:5], 1):
                match_score = job.get('match_score', 0)
                print(f"  {i}. {job['title']}")
                print(f"     Company: {job['company']}")
                print(f"     Match: {match_score:.1%}")
                print(f"     Location: {job.get('location', 'Not specified')}")
                print()
        
        print(f"📧 Email Summary: {'Sent' if self.config.email_notifications else 'Disabled'}")
        print(f"📝 Logs: logs/daily_job_scan.log")
        print("="*50)

async def main():
    """Main entry point for daily job scan"""
    
    scanner = DailyJobScanner()
    
    try:
        # Run the daily scan
        results = await scanner.run_daily_scan()
        
        # Print summary to console
        scanner.print_summary(results)
        
        print("\n✅ Daily job scan completed successfully!")
        print("📧 Check your email for detailed opportunities and materials.")
        
    except KeyboardInterrupt:
        print("\n⚠️ Daily scan cancelled by user")
        logger.warning("Daily scan cancelled by user")
        sys.exit(1)
        
    except Exception as e:
        print(f"\n❌ Daily scan failed: {str(e)}")
        logger.error(f"Daily scan failed: {e}")
        sys.exit(1)

def setup_cron_job():
    """Helper function to set up cron job for daily scanning"""
    
    config = get_personal_config()
    scan_time = config.morning_scan_time  # e.g., "09:00"
    hour, minute = scan_time.split(':')
    
    script_path = os.path.abspath(__file__)
    python_path = sys.executable
    log_file = os.path.join(os.path.dirname(script_path), '..', 'logs', 'cron.log')
    
    cron_command = f"{minute} {hour} * * * {python_path} {script_path} >> {log_file} 2>&1"
    
    print("To set up automated daily scanning, add this to your crontab:")
    print(f"(Run 'crontab -e' and add the following line)")
    print()
    print(cron_command)
    print()
    print(f"This will run daily at {scan_time} and log to {log_file}")

if __name__ == "__main__":
    # Check if user wants to see cron setup
    if len(sys.argv) > 1 and sys.argv[1] == "--setup-cron":
        setup_cron_job()
    else:
        # Run the actual daily scan
        asyncio.run(main())