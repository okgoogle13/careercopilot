import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { extractJobListing } from "./index";

// Create server instance
const server = new McpServer({
  name: "genkit-server",
  version: "1.0.0",
});

// Helper to get flow metadata
const flows = {
  "extractJobListing": extractJobListing,
  // "findSimilarListings": findSimilarListings // Temporarily disabled - vector search not implemented
};

/**
 * Tool: list_genkit_flows
 * Returns a list of available Genkit flows exposed by this server.
 */
server.tool(
  "list_genkit_flows",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(Object.keys(flows), null, 2)
      }]
    };
  }
);

/**
 * Tool: run_genkit_flow
 * Executes a Genkit flow with the provided JSON input.
 */
server.tool(
  "run_genkit_flow",
  {
    flowName: z.string().describe("Name of the flow to run (e.g. 'extractJobListing')"),
    input: z.string().describe("JSON string representing the input data for the flow")
  },
  async ({ flowName, input }) => {
    const flow = flows[flowName as keyof typeof flows];
    
    if (!flow) {
      return {
        content: [{
          type: "text",
          text: `Error: Flow '${flowName}' not found. Available flows: ${Object.keys(flows).join(", ")}`
        }],
        isError: true
      };
    }

    try {
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch (e) {
        return {
          content: [{
            type: "text",
            text: `Error: Input must be valid JSON string. ${e}`
          }],
          isError: true
        };
      }

      // Execute the flow
      console.error(`Running flow ${flowName}...`); // Log to stderr (ignored by MCP stdio)
      const result = await flow(parsedInput);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };

    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `Error executing flow: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Genkit MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
