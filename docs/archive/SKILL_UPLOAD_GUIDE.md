# Skill Upload Guide - Quick Reference

## ✅ Your Skill is Ready!

**File Location:** `dist/audit-agent.skill` (1.6 KB)
**Status:** Validated and packaged ✅

---

## 🚀 Upload to Claude Web Interface

### Step-by-Step Upload Process

#### 1. Access Claude Web Interface

- Go to **https://claude.ai**
- Log in to your account

#### 2. Navigate to Skills Settings

- Click your **profile icon** (bottom-left corner)
- Select **"Settings"**
- Click on the **"Skills"** tab

#### 3. Upload Your Skill

- Look for **"Upload Custom Skill"** or **"Add Skill"** button
- Click to open file upload dialog
- Select: `dist/audit-agent.skill`
- Wait for upload and validation (usually 5-10 seconds)
- You should see a confirmation message

#### 4. Verify Installation

- Your skill should appear in **"My Skills"** list
- It will show:
  - **Name:** audit-agent
  - **Description:** "Performs comprehensive security and code quality audits..."
  - **Version:** 1.0.0
  - **Tags:** security, audit, quality, scanning

#### 5. Test Your Skill

Open a new chat and try:

```
"Run a security audit on my backend code"
```

Claude will automatically invoke your `audit-agent` skill!

---

## 📋 Skill Details

### What's Included

- ✅ `SKILL.md` - Main skill definition with YAML frontmatter
- ✅ Complete audit workflow documentation
- ✅ Usage examples and triggers
- ✅ Report format templates

### When It's Invoked

The skill activates when you ask:

- "Run a security audit"
- "Check for vulnerabilities"
- "Audit the codebase"
- "Scan for security issues"
- "Check code quality"

### What It Does

1. **Security Scan** - Checks for hardcoded secrets, SQL injection, XSS
2. **Dependency Audit** - Scans for vulnerable dependencies
3. **Code Quality** - Identifies code smells and complexity
4. **Report Generation** - Creates detailed findings with severity levels

---

## 🔄 Updating Your Skill

If you need to make changes:

```bash
# 1. Edit the skill
nano .claude/skills/audit-agent/SKILL.md

# 2. Validate changes
python3 .claude/scripts/package-skill.py .claude/skills/audit-agent --validate-only

# 3. Re-package
python3 .claude/scripts/package-skill.py .claude/skills/audit-agent dist/

# 4. Re-upload to claude.ai (overwrites previous version)
```

---

## 🛠️ Creating Additional Skills

### Quick Start Template

```bash
# 1. Initialize new skill
python3 .claude/scripts/init-skill.py my-new-skill

# 2. Edit SKILL.md
nano .claude/skills/my-new-skill/SKILL.md

# 3. Validate
python3 .claude/scripts/package-skill.py .claude/skills/my-new-skill --validate-only

# 4. Package
python3 .claude/scripts/package-skill.py .claude/skills/my-new-skill dist/

# 5. Upload to claude.ai
```

### Minimum SKILL.md Template

```yaml
---
name: my-new-skill
description: "Brief description. Use when asked to 'do something specific'."
version: 1.0.0
tags:
  - category
---

# My New Skill

## Features
- Feature 1
- Feature 2

## Usage
When invoked, this skill will:
1. Step 1
2. Step 2

## Example
User: "Do something"
Agent: [Uses my-new-skill]
```

---

## 📦 All Your Packaged Skills

To package all existing skills for backup or sharing:

```bash
# Package all skills at once
for skill in .claude/skills/*/; do
  python3 .claude/scripts/package-skill.py "$skill" dist/
done

# Result: dist/*.skill files for all skills
```

---

## 🔍 Troubleshooting

### Upload Fails

- **Check file size**: Skills should be under 10 MB
- **Verify ZIP format**: Run `file dist/audit-agent.skill` (should show "Zip archive")
- **Re-validate**: Run validation command to catch errors

### Skill Not Appearing in Chats

- **Refresh page**: Hard reload (Ctrl+Shift+R or Cmd+Shift+R)
- **New chat**: Start a fresh conversation
- **Check Settings**: Verify skill is enabled in Settings → Skills

### Skill Not Triggering

- **Check description**: Ensure description has "Use when..." triggers
- **Be explicit**: Use exact phrases from description
- **Manual invoke**: You can explicitly say "Use the audit-agent skill to..."

---

## 📚 Additional Resources

### Your Project Documentation

- **CLAUDE.md** - Complete project commands and skills reference
- **Skill Guidelines Audit** - `.claude/docs/SKILL_GUIDELINES_AUDIT.md`
- **Example Skills** - `.claude/skills/example-skill/`

### Anthropic Official Docs

- **Skill Creator Guide**: https://github.com/anthropics/skills/blob/main/skill-creator/SKILL.md
- **Claude Code Documentation**: https://docs.anthropic.com/claude-code

---

## ✨ Your Next Steps

1. ✅ **Upload** `dist/audit-agent.skill` to claude.ai → Settings → Skills
2. ✅ **Test** in a new chat: "Run a security audit on my code"
3. ✅ **Customize** the skill based on your specific needs
4. ✅ **Create more skills** using the template above

**Your packaged skill is ready at:**

```
/home/user/careercopilot/dist/audit-agent.skill
```

**Happy auditing! 🎉**
