import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
console.log('CWD:', process.cwd());
console.log('API Key present:', !!process.env.GEMINI_API_KEY);
console.log('API Key length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

// Initialize Gemini API
const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const genAI = new GoogleGenerativeAI(apiKey);

// GitHub Models Configuration
const githubToken = process.env.GITHUB_TOKEN || process.env.GH_PAT;
const GITHUB_MODELS_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

// Model Tiers (March 2026)
const MODEL_TIERS: Record<string, string> = {
  Frontier: 'gemini-3.1-pro',
  Performance: 'gemini-3.1-flash',
  Utility: 'gemini-3.1-flash-lite',
  LTS: 'gemini-1.5-pro'
};

const MODEL_CANDIDATES = [
  { provider: 'google', model: MODEL_TIERS.Frontier, tier: 'Frontier' },
  { provider: 'google', model: MODEL_TIERS.Performance, tier: 'Performance' },
  { provider: 'google', model: MODEL_TIERS.Utility, tier: 'Utility' },
  { provider: 'google', model: MODEL_TIERS.LTS, tier: 'LTS' },
  { provider: 'github', model: 'gpt-4o', tier: 'External-Fallback' },
  { provider: 'github', model: 'Meta-Llama-3-70B-Instruct', tier: 'External-Fallback' }
];

// Path resolution based on process.cwd() (Project Root)
const PROJECT_ROOT = process.cwd();

const PROMPTS_PATH = path.resolve(PROJECT_ROOT, 'scripts/gemini-prompts/hero-composer.json');
const REGISTRY_PATH = path.resolve(PROJECT_ROOT, 'frontend/public/assets/kr-solidarity-hero-registry.json');
const MANIFEST_PATH = path.resolve(PROJECT_ROOT, 'frontend/public/assets/kr-solidarity-manifest.json');

async function generateHero(promptId: string, context = '') {
  const promptsData = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf-8'));
  const template = promptsData.templates.find((t: any) => t.id === promptId);

  if (!template) {
    throw new Error(`Prompt template not found: ${promptId}`);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  const fullPrompt = `
    ${template.prompt}

    CONTEXT: ${context || template.register_context}

    AVAILABLE ASSETS:
    ${JSON.stringify(manifest.assets.map((a: any) => ({ id: a.id, name: a.name, layer: a.layer })), null, 2)}
  `;

  let lastError;

  for (const candidate of MODEL_CANDIDATES) {
    console.log(`🤖 Attempting generation with ${candidate.provider}:${candidate.model}...`);

    try {
      let text = '';

      if (candidate.provider === 'google') {
        const MAX_RETRIES = 5;
        let retries = 0;

        while (retries < MAX_RETRIES) {
            try {
                const model = genAI.getGenerativeModel({
                    model: candidate.model,
                    generationConfig: { responseMimeType: 'application/json' }
                });
                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                text = response.text();
                break; // Success
            } catch (err: any) {
                if (err.status === 429) {
                    let delay = 30000;
                    const message = err.message || '';
                    const match = message.match(/retry in ([0-9.]+)s/);
                    if (match && match[1]) delay = Math.ceil(parseFloat(match[1]) * 1000) + 1000;

                    console.log(`⏳ ${candidate.model} rate limited. Waiting ${delay/1000}s (Retry ${retries + 1}/${MAX_RETRIES})...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries++;
                } else {
                    throw err; // Non-retriable, throw to outer catch
                }
            }
        }
        if (!text) throw new Error(`Failed to generate with ${candidate.model} after ${MAX_RETRIES} retries.`);

      } else if (candidate.provider === 'github') {
        if (!githubToken) {
            console.log('⚠️ Skipping GitHub Model (no token)');
            continue;
        }

        const response = await fetch(GITHUB_MODELS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a JSON-only generator. Output raw JSON without markdown." },
                    { role: "user", content: fullPrompt }
                ],
                model: candidate.model,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub Models API Error: ${response.status} ${response.statusText}`);
        }

        const data: any = await response.json(); // Type as any to avoid TS strictness without types
        text = data.choices[0]?.message?.content || '';
      }

      // Validate JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
         throw new Error('No JSON found in response');
      }

      const heroData = JSON.parse(jsonMatch[0]);
      console.log(`✅ Success with ${candidate.model}`);
      return heroData;

    } catch (error: any) {
      console.warn(`❌ Failed with ${candidate.model}: ${error.message}`);
      lastError = error;
      // Continue to next candidate
    }
  }

  throw new Error(`All model candidates failed. Last error: ${lastError?.message}`);
}

async function updateRegistry(newHero: any) {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

  // Check for duplicates
  const index = registry.compositions.findIndex((c: any) => c.id === newHero.id);
  if (index !== -1) {
    registry.compositions[index] = newHero;
  } else {
    registry.compositions.push(newHero);
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

async function main() {
  const args = process.argv.slice(2);
  const promptId = args[0] || 'deterministic-layered-hero';
  const customContext = args[1] || '';

  console.log(`🚀 Starting Gemini Hero Generation with template: ${promptId}`);

  try {
    const hero = await generateHero(promptId, customContext);
    console.log(`✅ Generated Hero: ${hero.name} (${hero.id})`);

    await updateRegistry(hero);
    console.log(`💾 Registry updated at: ${REGISTRY_PATH}`);
  } catch (error) {
    console.error('❌ Generator failed:', error);
    process.exit(1);
  }
}

main();
