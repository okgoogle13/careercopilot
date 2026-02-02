# BULK_SKILL_UPLOAD_INSTRUCTIONS.md

## Complete Upload Guide for All 24 Skills

This guide provides step-by-step instructions for uploading all packaged Claude skills to your Claude.ai account.

---

## 📦 Current Skills Status

### Packaged Skills Available (24 total)

```
✅ api-contract-validator.skill (2.1 KB)
✅ api-integration-test-scaffolder.skill (1.6 KB)
✅ audit-agent.skill (1.6 KB)
✅ careercopilot-agent-scaffolder.skill (0.4 KB)
✅ careercopilot-tool-creator.skill (0.4 KB)
✅ component-builder.skill (2.7 KB)
✅ deployment-manager.skill (0.9 KB)
✅ example-skill.skill (1.3 KB)
✅ example-zip.skill (0.5 KB)
✅ fastapi-endpoint-scaffolder.skill (1.1 KB)
✅ figma-to-component.skill (0.8 KB)
✅ figma-to-page.skill (1.1 KB)
✅ frontend-backend-mapper.skill (2.2 KB)
✅ fullstack-flow-mapper.skill (0.4 KB)
✅ jest-test-scaffolder.skill (2.6 KB)
✅ mcp-configuration-skill.skill (1.6 KB)
✅ mcp-documentation-skill.skill (1.3 KB)
✅ mcp-genkit-flows-skill.skill (2.1 KB)
✅ mcp-routing-specialist.skill (6.8 KB)
✅ project-health-checker.skill (0.4 KB)
✅ pydantic-model-scaffolder.skill (1.4 KB)
✅ react-component-scaffolder.skill (1.0 KB)
✅ react-page-scaffolder.skill (1.0 KB)
✅ storybook-scaffolder.skill (0.4 KB)
✅ task-delegator.skill (4.6 KB)
✅ webapp-testing.skill (1.0 KB)
```

**Location**: `/Applications/careercopilot/dist/skills/`

---

## 🚀 Bulk Upload Process

### Option 1: Individual Upload (Recommended)

Upload skills in priority order based on utility:

#### Tier 1: Core Development Skills (High Priority)

1. **audit-agent.skill** - Security and code quality auditing
2. **task-delegator.skill** - Task management and delegation
3. **component-builder.skill** - React component creation
4. **mcp-routing-specialist.skill** - MCP routing configuration

#### Tier 2: Testing & Quality (Medium Priority)

5. **jest-test-scaffolder.skill** - Jest test generation
6. **webapp-testing.skill** - Web application testing
7. **api-contract-validator.skill** - API contract validation
8. **project-health-checker.skill** - Project health assessment

#### Tier 3: Scaffolding & Generation (Medium Priority)

9. **react-component-scaffolder.skill** - React component templates
10. **react-page-scaffolder.skill** - React page templates
11. **fastapi-endpoint-scaffolder.skill** - FastAPI endpoint creation
12. **pydantic-model-scaffolder.skill** - Pydantic model generation
13. **storybook-scaffolder.skill** - Storybook setup

#### Tier 4: Integration & Tools (Lower Priority)

14. **figma-to-component.skill** - Figma to React conversion
15. **figma-to-page.skill** - Figma to page conversion
16. **frontend-backend-mapper.skill** - Frontend-backend mapping
17. **fullstack-flow-mapper.skill** - Fullstack workflow mapping
18. **api-integration-test-scaffolder.skill** - API integration testing

#### Tier 5: MCP & Configuration (Specialized)

19. **mcp-genkit-flows-skill.skill** - MCP Genkit flows
20. **mcp-configuration-skill.skill** - MCP configuration
21. **mcp-documentation-skill.skill** - MCP documentation
22. **deployment-manager.skill** - Deployment management

#### Tier 6: CareerCopilot Specific (Niche)

23. **careercopilot-agent-scaffolder.skill** - CareerCopilot agents
24. **careercopilot-tool-creator.skill** - CareerCopilot tools

### Option 2: Batch Upload Script

Create a script for bulk upload (future enhancement):

```bash
#!/bin/bash
# bulk_upload_skills.sh

SKILLS_DIR="/Applications/careercopilot/dist/skills"
UPLOAD_ORDER=(
    "audit-agent.skill"
    "task-delegator.skill"
    "component-builder.skill"
    "mcp-routing-specialist.skill"
    # ... add all skills in preferred order
)

echo "Starting bulk skill upload..."
echo "Please upload each skill manually to claude.ai -> Settings -> Skills"
echo ""

for skill in "${UPLOAD_ORDER[@]}"; do
    echo "📤 Ready to upload: $skill"
    echo "   File: $SKILLS_DIR/$skill"
    echo "   Size: $(du -h "$SKILLS_DIR/$skill" | cut -f1)"
    echo ""
    echo "Press ENTER when ready to upload next skill, or 'q' to quit:"
    read -r input
    if [[ $input == "q" ]]; then
        echo "Upload stopped by user"
        exit 0
    fi
done

echo "✅ Bulk upload complete!"
```

---

## 📋 Step-by-Step Upload Instructions

### For Each Skill:

1. **Access Claude Web Interface**
   - Go to **https://claude.ai**
   - Log in to your account

2. **Navigate to Skills Settings**
   - Click your **profile icon** (bottom-left corner)
   - Select **"Settings"**
   - Click on the **"Skills"** tab

3. **Upload Skill**
   - Look for **"Upload Custom Skill"** or **"Add Skill"** button
   - Click to open file upload dialog
   - Select the skill file from `/Applications/careercopilot/dist/skills/`
   - Wait for upload and validation (usually 5-10 seconds)
   - You should see a confirmation message

4. **Verify Installation**
   - The skill should appear in **"My Skills"** list
   - Check that the name and description match expectations
   - Ensure the skill is enabled (toggle switch)

5. **Test the Skill**
   - Open a new chat
   - Use a trigger phrase specific to the skill
   - Verify Claude invokes the skill correctly

---

## 🎯 Skill Testing Guide

### Test Each Skill with These Prompts:

#### audit-agent.skill

```
"Run a security audit on my backend code"
"Check for vulnerabilities in this repository"
"Scan for security issues"
```

#### task-delegator.skill

```
"Help me organize these development tasks"
"Create a task breakdown for this feature"
"Delegate these tasks to team members"
```

#### component-builder.skill

```
"Create a React component for a user profile card"
"Build a form component with validation"
"Generate a reusable button component"
```

#### jest-test-scaffolder.skill

```
"Generate Jest tests for this React component"
"Create test cases for this API endpoint"
"Set up testing for this utility function"
```

#### api-contract-validator.skill

```
"Validate API contracts between frontend and backend"
"Check for type mismatches in my API"
"Analyze TypeScript interfaces vs Pydantic models"
```

=======

# 📦 Bulk Skill Upload Instructions

## ✅ Packaging Complete!

I've successfully packaged **24 skills** from your project. All packaged skills are validated and ready to upload to claude.ai.

---

## 📊 Packaging Summary

- **✅ Successfully Packaged:** 24 skills (58 KB total)
- **❌ Failed Validation:** 1 skill (mcp-routing-specialist - missing YAML frontmatter)
- **⚠️ Skipped:** 4 skills (no SKILL.md file)
  - design-skills
  - document-skills
  - frontend-migration
  - theme-factory

---

## 📁 Packaged Skills Ready to Upload

All packaged skills are located in:

```
/home/user/careercopilot/dist/skills-ready-to-upload/
```

### Complete Skill List (24 skills)

| #   | Skill Name                      | Size | Description                                                       |
| --- | ------------------------------- | ---- | ----------------------------------------------------------------- |
| 1   | api-contract-validator          | 2.1K | Validates type contracts between TypeScript and Pydantic          |
| 2   | api-integration-test-scaffolder | 4.0K | Generates integration tests for frontend → backend → Genkit flows |
| 3   | audit-agent                     | 1.6K | Performs comprehensive security and code quality audits           |
| 4   | careercopilot-agent-scaffolder  | 922B | Scaffolds new Python agent files                                  |
| 5   | careercopilot-tool-creator      | 965B | Scaffolds new Python tool files                                   |
| 6   | component-builder               | 2.7K | Generates M3-compliant React components                           |
| 7   | deployment-manager              | 985B | Deploys to staging or production                                  |
| 8   | example-skill                   | 1.4K | Example skill demonstrating best practices                        |
| 9   | fastapi-endpoint-scaffolder     | 4.0K | Scaffolds FastAPI endpoints with tests                            |
| 10  | figma-to-component              | 910B | Vision-based Figma component workflow                             |
| 11  | figma-to-page                   | 1.2K | Generates React pages from Figma                                  |
| 12  | frontend-backend-mapper         | 2.2K | Maps frontend API calls to backend endpoints                      |
| 13  | fullstack-flow-mapper           | 417B | Traces data flows across all layers                               |
| 14  | jest-test-scaffolder            | 8.2K | Generates React component and hook tests                          |
| 15  | mcp-configuration-skill         | 1.7K | Manages automation scripts via MCP                                |
| 16  | mcp-documentation-skill         | 1.3K | Accesses cached codebase docs via MCP                             |
| 17  | mcp-genkit-flows-skill          | 2.1K | Executes Genkit AI flows via MCP                                  |
| 18  | project-health-checker          | 458B | Runs project health checks                                        |
| 19  | pydantic-model-scaffolder       | 2.7K | Creates type-safe Pydantic models                                 |
| 20  | react-component-scaffolder      | 1.1K | Scaffolds React component directories                             |
| 21  | react-page-scaffolder           | 1.1K | Scaffolds React page directories                                  |
| 22  | storybook-scaffolder            | 845B | Generates Storybook files                                         |
| 23  | task-delegator                  | 4.5K | Delegates tasks to specialized agents                             |
| 24  | webapp-testing                  | 1.1K | Runs/writes Playwright tests                                      |

---

## 🚀 Upload Instructions

Since I cannot directly access the claude.ai web interface, **you'll need to upload these manually**. Here's how:

### Method 1: Individual Upload (Recommended for Testing)

**Steps:**

1. Go to **https://claude.ai**
2. Click **profile icon** (bottom-left) → **Settings** → **Skills**
3. Click **"Upload Custom Skill"** or **"Add Skill"**
4. Select one `.skill` file from `dist/skills-ready-to-upload/`
5. Wait for validation and confirmation (~5-10 seconds)
6. Repeat for each skill

**Recommended upload order (most useful first):**

1. `audit-agent.skill` - Security audits
2. `jest-test-scaffolder.skill` - Test generation
3. `fastapi-endpoint-scaffolder.skill` - Backend scaffolding
4. `component-builder.skill` - Frontend components
5. `task-delegator.skill` - Task orchestration
6. `project-health-checker.skill` - Health checks
7. (Continue with remaining skills as needed)

### Method 2: Bulk Upload (If Supported)

If claude.ai supports bulk upload:

1. Go to **https://claude.ai** → **Settings** → **Skills**
2. Look for **"Bulk Upload"** or **"Upload Multiple"** option
3. Select **all 24 `.skill` files** from `dist/skills-ready-to-upload/`
4. Upload and wait for validation

---

## 📋 What Each Skill Does

### Backend Development (6 skills)

- **fastapi-endpoint-scaffolder** - Create new FastAPI endpoints
- **pydantic-model-scaffolder** - Create Pydantic data models
- **api-integration-test-scaffolder** - Generate integration tests
- **api-contract-validator** - Validate TypeScript ↔ Pydantic contracts
- **careercopilot-agent-scaffolder** - Create Python agent files
- **careercopilot-tool-creator** - Create Python tool files

### Frontend Development (6 skills)

- **component-builder** - Generate M3-compliant React components
- **react-component-scaffolder** - Scaffold component directories
- **react-page-scaffolder** - Scaffold page directories
- **jest-test-scaffolder** - Generate Jest tests
- **storybook-scaffolder** - Generate Storybook stories
- **figma-to-component** - Vision-based Figma workflows
- **figma-to-page** - Generate pages from Figma

### Full-Stack Integration (2 skills)

- **frontend-backend-mapper** - Map frontend ↔ backend integrations
- **fullstack-flow-mapper** - Trace data flows across layers

### Testing & Quality (3 skills)

- **audit-agent** - Security and code quality audits
- **webapp-testing** - Playwright E2E tests
- **project-health-checker** - Project health validation

### Deployment & Operations (1 skill)

- **deployment-manager** - Deploy to staging/production

### MCP Integration (3 skills)

- **mcp-configuration-skill** - Manage automation scripts
- **mcp-documentation-skill** - Access cached documentation
- **mcp-genkit-flows-skill** - Execute Genkit AI flows

### Task Orchestration (1 skill)

- **task-delegator** - Coordinate multi-agent workflows

### Reference (1 skill)

- **example-skill** - Best practices reference

---

## ✨ After Upload

Once uploaded, these skills will be **persistent across all your Claude chats**!

### How to Use Them

Skills are automatically invoked based on your requests:

**Example 1: Backend Development**

```
You: "Create a new FastAPI endpoint for user notifications"
Claude: [Invokes fastapi-endpoint-scaffolder automatically]
```

**Example 2: Security Audit**

```
You: "Run a security audit on the backend"
Claude: [Invokes audit-agent automatically]
```

**Example 3: Testing**

```
You: "Generate tests for the Button component"
Claude: [Invokes jest-test-scaffolder automatically]
```

### Verification

To verify skills are uploaded:

1. Go to **Settings** → **Skills**
2. You should see all 24 skills in **"My Skills"** list
3. Each skill shows its name, description, and version
   > > > > > > > 80ddfb98258a37caccbd77cdd727370b845334a3

---

## 🔧 Troubleshooting

<<<<<<< HEAD

### Upload Issues

**Problem**: Upload fails or file not accepted
**Solution**:

- Check file size (should be under 10 MB)
- Verify file format: `file dist/skill-name.skill` (should show "Zip archive")
- Re-package the skill if needed

**Problem**: Skill appears but doesn't trigger
**Solution**:

- Refresh the Claude.ai page (Ctrl+Shift+R or Cmd+Shift+R)
- Start a new chat conversation
- Check skill description for proper trigger phrases
- Try explicit invocation: "Use the [skill-name] skill to..."

**Problem**: Too many skills cluttering the interface
**Solution**:

- Disable unused skills in Settings → Skills
- Prioritize core skills for daily use
- Remove skills that overlap in functionality

### Performance Issues

**Problem**: Skills take too long to respond
**Solution**:

- Check your internet connection
- Try again with a simpler request
- Report issues to Anthropic support

---

## 📊 Upload Progress Tracker

Use this checklist to track your uploads:

````
[ ] audit-agent.skill - Security auditing
[ ] task-delegator.skill - Task management
[ ] component-builder.skill - React components
[ ] mcp-routing-specialist.skill - MCP routing
[ ] jest-test-scaffolder.skill - Jest testing
[ ] webapp-testing.skill - Web app testing
[ ] api-contract-validator.skill - API validation
[ ] project-health-checker.skill - Health checks
[ ] react-component-scaffolder.skill - React templates
[ ] react-page-scaffolder.skill - Page templates
[ ] fastapi-endpoint-scaffolder.skill - FastAPI endpoints
[ ] pydantic-model-scaffolder.skill - Pydantic models
[ ] storybook-scaffolder.skill - Storybook setup
[ ] figma-to-component.skill - Figma conversion
[ ] figma-to-page.skill - Figma pages
[ ] frontend-backend-mapper.skill - FE/BE mapping
[ ] fullstack-flow-mapper.skill - Fullstack flows
[ ] api-integration-test-scaffolder.skill - API testing
[ ] mcp-genkit-flows-skill.skill - MCP Genkit
[ ] mcp-configuration-skill.skill - MCP config
[ ] mcp-documentation-skill.skill - MCP docs
[ ] deployment-manager.skill - Deployment
[ ] careercopilot-agent-scaffolder.skill - CP agents
[ ] careercopilot-tool-creator.skill - CP tools
=======
### Skill Upload Fails
- **Check file size**: All skills are under 10 MB (largest is 8.2 KB)
- **Verify ZIP format**: All `.skill` files are valid ZIP archives
- **Re-download**: If corrupted, re-package locally

### Skill Not Appearing
- **Refresh browser**: Hard reload (Ctrl+Shift+R / Cmd+Shift+R)
- **New chat**: Start fresh conversation
- **Check enabled**: Verify skill is enabled in Settings

### Skill Not Triggering
- **Use trigger phrases**: Check skill description for exact phrases
- **Be explicit**: Say "Use the [skill-name] skill to..."
- **Manual invoke**: Explicitly request the skill by name

---

## 📝 Failed Skills

### mcp-routing-specialist (Failed Validation)

**Error:** Missing YAML frontmatter

**To fix and package:**
```bash
# 1. Add YAML frontmatter to SKILL.md
nano .claude/skills/mcp-routing-specialist/SKILL.md

# 2. Validate
python3 .claude/scripts/package-skill.py .claude/skills/mcp-routing-specialist --validate-only

# 3. Package
python3 .claude/scripts/package-skill.py .claude/skills/mcp-routing-specialist dist/skills-ready-to-upload/
>>>>>>> 80ddfb98258a37caccbd77cdd727370b845334a3
````

---

<<<<<<< HEAD

## 🔄 Maintenance

### Updating Skills

If you need to update a skill:

1. **Edit the source**: Modify `.claude/skills/skill-name/SKILL.md`
2. **Re-package**: Run `python3 scripts/package_claude_skills.py .claude/skills`
3. **Re-upload**: Upload to Claude.ai (will overwrite previous version)
4. **Test**: Verify the updated functionality

### Removing Skills

To remove a skill from your Claude.ai account:

1. Go to Claude.ai → Settings → Skills
2. Find the skill in "My Skills"
3. Click the three-dot menu next to the skill
4. Select "Remove" or "Delete"
5. Confirm the removal

---

## 📈 Optimization Tips

### Best Practices

1. **Start with Core Skills**: Upload audit-agent, task-delegator, and component-builder first
2. **Test Thoroughly**: Verify each skill works before uploading the next
3. **Organize by Priority**: Disable skills you don't use regularly
4. **Monitor Performance**: Keep track of which skills are most useful
5. **Regular Updates**: Re-package skills when source code changes

### Storage Management

- **Total Skills**: 24 skills (~35 MB total)
- **Recommended Active Skills**: 10-15 core skills
- **Archive Unused**: Remove skills that overlap or aren't needed
- **Backup**: Keep the `dist/skills/` directory as a backup

---

## ✅ Success Criteria

You're all set when:

- ✅ Core skills (audit-agent, task-delegator, component-builder) are uploaded and working
- ✅ Testing skills (jest-test-scaffolder, webapp-testing) are functional
- ✅ At least 10 skills are actively used in your workflow
- ✅ Skills trigger correctly with their designated phrases
- ✅ No upload errors or validation issues

---

## 🎉 Next Steps

After uploading all skills:

1. **Create Skill Workflows**: Combine skills for complex tasks
2. **Document Usage**: Keep notes on which skills work best for specific tasks
3. **Share with Team**: Upload useful skills to team accounts
4. **Provide Feedback**: Report issues or improvement suggestions
5. **Stay Updated**: Check for skill updates and improvements

---

**📁 All Skills Location**: `/Applications/careercopilot/dist/skills/`

**📄 This Guide**: `/Applications/careercopilot/BULK_SKILL_UPLOAD_INSTRUCTIONS.md`

**🔧 Packaging Script**: `/Applications/careercopilot/scripts/package_claude_skills.py`

# **Happy coding with your new Claude skills! 🚀**

## 🔄 Re-packaging Skills

If you make changes to any skill:

```bash
# Re-package a single skill
python3 .claude/scripts/package-skill.py .claude/skills/[skill-name] dist/skills-ready-to-upload/

# Re-package all skills
for skill_dir in .claude/skills/*/; do
  if [ -f "$skill_dir/SKILL.md" ]; then
    python3 .claude/scripts/package-skill.py "$skill_dir" dist/skills-ready-to-upload/
  fi
done
```

---

## 📦 Download Skills

All packaged skills are ready at:

```
/home/user/careercopilot/dist/skills-ready-to-upload/
```

**To download:**

1. Navigate to the directory
2. Download all 24 `.skill` files to your local machine
3. Upload to claude.ai following the instructions above

---

## 🎯 Next Steps

1. ✅ **Download** all `.skill` files from `dist/skills-ready-to-upload/`
2. ✅ **Upload** to claude.ai → Settings → Skills (24 files)
3. ✅ **Verify** all skills appear in "My Skills" list
4. ✅ **Test** by requesting features that trigger the skills
5. ✅ **Enjoy** persistent skills across all Claude chats!

---

## 📊 Quick Stats

**📁 All Skills Location**: `/Applications/careercopilot/dist/skills/`

**📄 This Guide**: `/Applications/careercopilot/BULK_SKILL_UPLOAD_INSTRUCTIONS.md`

**🔧 Packaging Script**: `/Applications/careercopilot/scripts/package_claude_skills.py`

**Happy coding with your new Claude skills! 🚀**
