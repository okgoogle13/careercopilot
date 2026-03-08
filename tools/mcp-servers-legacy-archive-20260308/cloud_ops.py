#!/usr/bin/env python3
"""
MCP Cloud Ops - Budget Aware
"""
import json, sys, subprocess, logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [CloudOps] - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-cloud-ops.log')]
)
logger = logging.getLogger("CloudOps")

class CloudOpsServer:
    def _run_cmd(self, cmd):
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0: return f"Error: {result.stderr.strip()}"
            try: return json.loads(result.stdout)
            except: return result.stdout.strip()
        except Exception as e: return f"Error: {str(e)}"

    def check_auth(self):
        auth = self._run_cmd(["gcloud", "auth", "list", "--format=json"])
        project = self._run_cmd(["gcloud", "config", "get-value", "project"])
        return {"status": "success", "active_project": project}

    def configure_budget_cap(self, amount_usd=2.00):
        project_id = self._run_cmd(["gcloud", "config", "get-value", "project"])
        billing_info = self._run_cmd(["gcloud", "beta", "billing", "projects", "describe", str(project_id), "--format=json"])
        if isinstance(billing_info, str) and "Error" in billing_info: return billing_info
        acc_id = billing_info.get("billingAccountName", "").split("/")[-1]
        cmd = ["gcloud", "billing", "budgets", "create", "--billing-account", acc_id, "--display-name", f"Safety Cap - {project_id}", "--budget-amount", f"{amount_usd}USD", "--threshold-rule", "percent=1.0"]
        return self._run_cmd(cmd)

    def deploy_service(self, service_name, region="us-central1"):
        cmd = ["gcloud", "run", "deploy", service_name, "--source", ".", "--region", region, "--min-instances", "0"]
        return self._run_cmd(cmd)

    def firebase_deploy_hosting(self):
        """Deploy only hosting assets via firebase-tools."""
        return self._run_cmd(["npx", "firebase-tools", "deploy", "--only", "hosting", "--json"])

    def list_tools(self):
        return [
            {"name": "cloud_check_auth", "description": "Check GCP and Firebase Auth status.", "inputSchema": {"type": "object"}},
            {"name": "configure_budget_cap", "description": "Set safety budget for GCP.", "inputSchema": {"type": "object", "properties": {"amount_usd": {"type": "number"}}}},
            {"name": "deploy_service", "description": "Deploy to Cloud Run (Scale-to-Zero).", "inputSchema": {"type": "object", "properties": {"service_name": {"type": "string"}}, "required": ["service_name"]}},
            {"name": "firebase_deploy_hosting", "description": "Deploy Firebase Hosting assets.", "inputSchema": {"type": "object"}}
        ]

    def call_tool(self, name, args):
        if name == "cloud_check_auth": return [{"type": "text", "text": str(self.check_auth())}]
        elif name == "configure_budget_cap": return [{"type": "text", "text": str(self.configure_budget_cap(args.get("amount_usd", 2.00)))}]
        elif name == "deploy_service": return [{"type": "text", "text": str(self.deploy_service(args.get("service_name")))}]
        elif name == "firebase_deploy_hosting": return [{"type": "text", "text": str(self.firebase_deploy_hosting())}]
        return []

def handle_request(server, line):
    try:
        req = json.loads(line)
        method = req.get("method")
        req_id = req.get("id")

        resp = {"jsonrpc": "2.0", "id": req_id}

        if method == "initialize":
            resp["result"] = {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "cloud-ops", "version": "1.3.0"}
            }
        elif method == "tools/list":
            resp["result"] = {"tools": server.list_tools()}
        elif method == "tools/call":
            resp["result"] = {"content": server.call_tool(req["params"]["name"], req["params"]["arguments"])}
        else:
            return None

        return resp
    except: return None

if __name__ == "__main__":
    server = CloudOpsServer()
    while True:
        try:
            line = sys.stdin.readline()
            if not line: break
            resp = handle_request(server, line)
            if resp:
                print(json.dumps(resp))
                sys.stdout.flush()
        except: break
