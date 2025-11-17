---
name: storybook-scaffolder
description: "Scaffolds a new Storybook file (*.stories.tsx) for an existing component. Use when asked to 'create a story' or 'add to storybook'."
---
# Storybook Scaffolder Workflow

1.  Ask for the *full path* to the component to create a story for (e.g., `src/components/Common/MyButton/MyButton.tsx`).
2.  From the path, determine:
    * `{{COMPONENT_NAME}}` (e.g., `MyButton`)
    * `{{COMPONENT_PATH}}` (e.g., `./MyButton`)
    * `{{STORY_TITLE}}` (e.g., `Common/MyButton`)
3.  Read the template: `cat .claude/skills/storybook-scaffolder/templates/story.tsx.tpl`
4.  Replace the placeholders.
5.  Determine the new file path (e.g., `src/components/Common/MyButton/MyButton.stories.tsx`).
6.  Write the new `.stories.tsx` file.
7.  Report success and advise the user to fill in the `args` for the story.
