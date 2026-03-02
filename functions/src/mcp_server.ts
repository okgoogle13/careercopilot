import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
<<<<<<< HEAD
import {extractJobListing} from "./index";
=======
import {extractJobListing, findSimilarListings} from "./index";
>>>>>>> restoration-KR-Rage-Figma-v2.0

// Create server instance
const server = new McpServer({
  name: "genkit-server",
  version: "1.0.0",
});

// Helper to get flow metadata
const flows = {
<<<<<<< HEAD
  "extractJobListing": extractJobListing,
  // "findSimilarListings": findSimilarListings // Temporarily disabled - vector search not implemented
=======
  extractJobListing: extractJobListing,
  findSimilarListings: findSimilarListings,
>>>>>>> restoration-KR-Rage-Figma-v2.0
};

/**
 * Tool: list_genkit_flows
 * Returns a list of available Genkit flows exposed by this server.
 */
<<<<<<< HEAD
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
=======
server.tool("list_genkit_flows", {}, async () => {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(Object.keys(flows), null, 2),
      },
    ],
  };
});
>>>>>>> restoration-KR-Rage-Figma-v2.0

/**
 * Tool: run_genkit_flow
 * Executes a Genkit flow with the provided JSON input.
 */
server.tool(
  "run_genkit_flow",
  {
    flowName: z.string().describe("Name of the flow to run (e.g. 'extractJobListing')"),
<<<<<<< HEAD
    input: z.string().describe("JSON string representing the input data for the flow")
  },
  async ({flowName, input}) => {
    const flow = flows[flowName as keyof typeof flows];
    
    if (!flow) {
      return {
        content: [{
          type: "text",
          text: `Error: Flow '${flowName}' not found. Available flows: ${Object.keys(flows).join(", ")}`
        }],
        isError: true
=======
    input: z.string().describe("JSON string representing the input data for the flow"),
  },
  async ({flowName, input}) => {
    const flow = flows[flowName as keyof typeof flows];

    if (!flow) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Flow '${flowName}' not found. Available flows: ${Object.keys(flows).join(", ")}`,
          },
        ],
        isError: true,
>>>>>>> restoration-KR-Rage-Figma-v2.0
      };
    }

    try {
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch (e) {
        return {
<<<<<<< HEAD
          content: [{
            type: "text",
            text: `Error: Input must be valid JSON string. ${e}`
          }],
          isError: true
=======
          content: [
            {
              type: "text",
              text: `Error: Input must be valid JSON string. ${e}`,
            },
          ],
          isError: true,
>>>>>>> restoration-KR-Rage-Figma-v2.0
        };
      }

      // Execute the flow
      console.error(`Running flow ${flowName}...`); // Log to stderr (ignored by MCP stdio)
      const result = await flow(parsedInput);
<<<<<<< HEAD
      
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
=======

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing flow: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
