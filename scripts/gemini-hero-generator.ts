import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Polyfill for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const PROMPTS_PATH = path.resolve(__dirname, 'gemini-prompts/hero-composer.json');
const REGISTRY_PATH = path.resolve(__dirname, '../frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json');
const MANIFEST_PATH = path.resolve(__dirname, '../frontend/public/assets/kerala-rage-kr-solidarity-manifest.json');

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

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from markdown code blocks if necessary
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }
    
    const heroData = JSON.parse(jsonMatch[0]);
    return heroData;
  } catch (error) {
    console.error('Gemini generation failed:', error);
    throw error;
  }
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
