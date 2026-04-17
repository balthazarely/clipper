# Experience Design Principles

Experience Design capability-specific AI delivery principles belong here.

---

## How to Contribute

Use this format:

```
**XD-[NUMBER]: [Short title]**
[1-3 sentence description of the principle and why it matters.]
```

Examples of principles that may belong here include workshop facilitation, research synthesis, prototyping, design-to-development handoff, or other Experience Design workflows changed by AI.

---

# Design Engineering Principles

Design Engineering capability-specific AI delivery principles belong here.

---

## Current Principles

### Core Philosophy

**XD-01: AI is a Force Multiplier, Not a Replacement for Engineering Judgment**
AI should accelerate quality work and genuine productivity, not create the illusion of productivity. The goal is recognizing when AI saves time and when it costs you more than it would take to do it yourself—AI can make you look productive before you are productive.

**XD-02: Build Engineering Judgment, Not Just Ship Code**
The long-term goal is developing the judgment that makes you a strong engineer for the next decade, not shipping more code faster. The engineers who thrive long-term are the ones who use AI to accelerate their learning, not bypass it.

**XD-03: Own Your Code**
If you can't explain your code, you don't own it. You won't be able to debug it, extend it, or defend it in a review—so only accept AI output you can fully understand and reason through.

---

### When to Use AI

**XD-04: Use AI for First Drafts and Boilerplate**
Leverage AI when you need a first draft of a component, test, or config, or when writing boilerplate (types, mocks, unit test shells). AI excels at generating starting points and reducing setup overhead so you can focus on refinement and architecture.

**XD-05: Use AI for Debugging and Diagnosis**
Use AI to debug unfamiliar errors, trace complex logic, or understand runtime issues when you provide complete context (full error message, relevant code block, what you expected vs. what happened, what you've already tried). The more context you provide, the faster it can isolate the issue.

**XD-06: Use AI to Understand Unfamiliar Codebases**
Use AI to accelerate onboarding and comprehension of unfamiliar code. Ask it to explain what a file does, summarize data flow, identify key files you need to read, or articulate the patterns in use. AI should always be working from existing code as a reference, not building from scratch.

**XD-07: Use AI to Document Code You've Written**
Ask AI to generate JSDoc comments for exported functions, document non-obvious decisions as inline comments, and draft PR descriptions and commit messages. Well-documented code is especially important in an AI-assisted workflow because future AI sessions will use your comments as context.

**XD-08: Use AI for Plan Creation Before Code Generation**
Paste your spec into AI and ask it to produce a step-by-step implementation plan before asking for code. Review and edit that plan—this is where your engineering judgment shapes the output. Use the approved plan as the prompt scaffold for actual code generation.

**XD-09: Use AI to Learn Design System and Project Patterns**
Ask @workspace questions like "what's the closest existing component to what I'm about to build?" or "how does state management work in this project?" Copilot will scan your codebase and give you a grounded answer rather than a generic one, helping you continue in the right pattern.

---

### When to Be Cautious

**XD-10: Question AI on Project-Specific Knowledge**
Be cautious when context is too project-specific for AI to have meaningful knowledge—deeply custom CMS schemas, proprietary APIs, or architectural decisions with long-term implications. AI optimizes locally, not systemically, so these decisions must involve human judgment.

**XD-11: Don't Use AI With Undefined Requirements**
AI will confidently build the wrong thing when requirements are unclear or early-stage. Define the spec and acceptance criteria first, then use AI to validate and refine solutions—never use AI to define the problem.

**XD-12: Avoid Re-Prompting Rabbit Holes**
If you've already spent more time re-prompting and revising AI output than it would've taken to write it yourself, stop and write it yourself. Recognize when iteration with AI is no longer efficient and trust your own expertise.

**XD-13: Always Human-Review Security-Sensitive Logic**
Never rely on AI-generated auth, data handling, or permissions code. Always human-review security-sensitive logic before accepting it—AI can make plausible-sounding mistakes that have real consequences.

**XD-14: AI Cannot Validate Rendered Output**
AI cannot see the rendered output in a browser. Final visual QA against Figma designs, design token validation, responsive behavior, interaction timing, and animation feel are always human responsibilities. Use Chrome MCP to show AI the rendered state, but validate visual decisions yourself.

**XD-15: AI Cannot Make Architectural Decisions**
Architectural questions and anything touching established team patterns should always involve a human. AI answers "how do I do this"—a senior engineer answers "should I do this, and how does it fit here."

---

### Building Core Engineering Skills

**XD-16: Learn Fundamentals by Doing**
TypeScript, component architecture, state management, and testing patterns need to be learned through hands-on practice, not by accepting AI-generated output. Build these foundations first, then use AI to refine your work.

**XD-17: Write Code First, Use AI to Review Second**
Solve the problem yourself first, even briefly (10-15 minutes of attempting the problem is enough), then use AI to review and improve it. This produces better prompts, deeper understanding, and genuine expertise—starting with AI and trying to understand it after is a slower path to mastery.

**XD-18: Practice Without AI to Build Debugging Skills**
If you can't reason through a TypeScript error or trace through code without AI, that's a signal to practice without it. Juniors who lean too heavily on AI output miss the debugging, pattern recognition, and architectural thinking that come from wrestling with problems directly.

**XD-19: Read Every Line Before Accepting It**
If you can't explain what the code does, you don't own it yet. Take time to understand before accepting—this is where real learning happens and where you catch mistakes AI makes.

**XD-20: Ask AI to Explain, Not Just Produce**
"Write this function and explain why you structured it this way" is far more valuable than "write this function." When Copilot generates something you don't understand, ask it to explain. Use the output as a learning moment.

**XD-21: Ask for Alternatives and Reasoning**
Ask AI "what's another way to approach this?" and "why did you make this choice?" Building pattern recognition faster than accepting the first solution deepens expertise and helps you evaluate quality.

---

### When to Ask Humans

**XD-22: Escalate Architectural Questions to Your Team**
When questions involve long-term implications, established patterns, or fit within the broader system, ask a senior engineer. When re-prompting isn't working, ask a teammate, not a different AI tool.

**XD-23: Always Have a Human Review Before Shipping**
Peer review catches problems, validates architectural decisions, ensures work meets standards, and confirms that AI output aligns with your codebase patterns. Never ship AI-assisted work without a human review.

**XD-24: Ask Humans for Context-Rich Feedback**
Humans answer strategic questions like "how does this fit into the 2-year roadmap?" or "is there a better pattern we established six months ago?" AI doesn't have that institutional knowledge.

---

### Spec Driven Development

**XD-25: Start With a Spec, Not a Prompt**
Write a detailed specification before any code—even AI-assisted code. A good spec includes: the component/feature goal in plain English, acceptance criteria, known constraints (patterns, CMS structure, Redux shape, design tokens), and links to Figma designs or existing components. AI output quality is directly proportional to spec clarity.

**XD-26: Use Figma MCP to Extract Design Context**
Start with the Figma design and use Figma MCP to extract layout, spacing, and token references directly into your prompt. This reduces manual translation from design to code and ensures AI output respects your design system.

**XD-27: Reference Existing Code Patterns**
Before asking AI to build something, identify the closest existing equivalent in your codebase and use it as a reference pattern. Ask AI to describe the pattern in plain English before generating anything—if it can articulate the pattern correctly, it will follow it correctly.

**XD-28: Validate Against Design Specs, Not Just Code**
After AI generates a component, validate it in the browser against Figma designs. Check design tokens, spacing systems, responsive behavior, interaction timing, animation feel, focus states, and scroll behavior. Use Chrome MCP to show Copilot the rendered output and ask it to compare against your design specs.

---

### Component Development Workflow

**XD-29: Follow the Component Development Workflow**
Start with Figma spec and extract tokens via MCP → identify closest reference component → generate component shell (props, structure, placeholder logic) → layer in logic in focused follow-up prompts. This ensures AI output stays grounded in your codebase patterns and design intent.

**XD-30: Keep Prompts Small and Purposeful**
The more you ask AI to do in a single pass, the harder it becomes to review all the changes and the greater the chance something gets missed. AI tends to produce lower-quality output when given too broad a scope at once. Scope requests tightly.

**XD-31: What Still Needs Human Judgment in Components**
Humans must decide: how the component fits into the broader component hierarchy, performance considerations (memoization, lazy loading decisions), that it follows team naming and file structure conventions, and that it's accurate to designs and architecturally sound.

**XD-32: TypeScript Errors and Type Safety**
AI is particularly good at resolving TypeScript errors—paste the error and relevant type definitions together. For complex generic type errors, ask AI to explain the type chain before asking for a fix. Watch out for AI "fixing" TypeScript errors by widening types to `any`—always push back.

---

### Testing with AI

**XD-33: AI Handles Test Boilerplate, Humans Decide What Matters**
AI excels at generating test variations, writing setup and teardown, and suggesting edge cases—but humans must decide what's actually worth testing vs. implementation detail. Ask AI to list what it plans to test before writing tests, then review and add or remove cases.

**XD-34: Generate Tests After Component Review**
Ask AI to generate test cases after the component is written and reviewed (not before). Include the component code, props interface, and relevant context in the prompt. This ensures tests validate your actual implementation, not an AI-generated hypothetical.

**XD-35: Always Validate Test Mocks**
When AI generates mocks for tests, verify they accurately represent real data shapes. AI mocks tend to be overly simplified, which can make tests pass for the wrong reasons or hide integration issues. Run tests against real data to validate.

**XD-36: Ensure Tests Reflect Real User Behavior**
After AI generates tests, review them to ensure they validate real user behavior and scenarios, not just code coverage. Accessibility, form submission, error states—these need to reflect how users actually interact with your component.

---

### Prompting Effectively

**XD-37: The Anatomy of a Good Prompt**
Strong prompts include: **Role** (what kind of engineer is AI acting as?), **Context** (what exists, what patterns are in use), **Task** (what specifically you need), **Constraints** (what AI should not do), and **Output format** (what you want to receive). The more specific and detailed your prompt, the better the output.

**XD-38: Include Constraints in Every Prompt**
Tell AI what NOT to do: "don't introduce new dependencies", "follow the existing Redux pattern", "match the naming convention in this file", "don't use any". Constraints are often more valuable than guidance.

**XD-39: Use Continuing Chat for Iteration, New Chat for New Tasks**
Use a continuing chat when iterating on a single component or problem—accumulated context improves results. Start a new chat when switching to a different feature or problem; stale context from a different task actively hurts output quality.

**XD-40: Use @workspace for Codebase-Aware Answers**
Always use @workspace when asking questions—answers come from your actual codebase, not generic knowledge. Use #file to reference specific files, #selection to reference highlighted code.

---

### Using Agent Mode and Chat Effectively

**XD-41: Use Agent Mode for Multi-File Tasks**
Agent mode reads files, makes multi-file edits, runs terminal commands, and self-corrects based on output. Best for scaffolding component folders, cross-file refactors, diagnosing broken code. Always review the diff before accepting—agent mode moves fast.

**XD-42: Use "Propose But Don't Apply" Language**
When asking AI to make significant changes, use language like "propose but don't apply" to understand a change before committing to it. Review the diff carefully before accepting.

**XD-43: Slash Commands and Chat Features**
Use slash commands: /explain, /fix, /tests, /doc, /new to quickly frame your request. Use Chat to draft PR descriptions (what was built, key decisions, what reviewers should focus on), explain complex code, or review diffs for patterns.

---

### Understanding Unfamiliar Codebases

**XD-44: Ask AI to Explain File Purpose and Patterns**
Ask Copilot to explain what a file does, what patterns it uses, and how it fits into the broader system. This compresses the time it takes to get oriented without skipping your own understanding.

**XD-45: Summarize Data Flow Through Features**
Ask AI to summarize the data flow through a feature—from the CMS or API layer down to the rendered component. This reveals how the feature actually works and where assumptions might be wrong.

**XD-46: Ask AI to Identify Key Files to Read First**
"I need to add a feature to the checkout flow—what files should I read first?" AI can help you prioritize your learning path instead of wandering through the codebase.

**XD-47: Compare New Code Against Reference Files**
After generating code, ask AI to compare its output against the reference file and flag any deviations in naming, structure, or convention. This ensures consistency without manual checking.

---

### Configuration and Documentation

**XD-48: Create a .github/copilot-instructions.md File**
Add a persistent system prompt Copilot reads automatically across your entire repo. Include: tech stack, naming conventions, folder structure, patterns to follow, and a "what NOT to do" section. Commit it once and the whole team benefits immediately.

**XD-49: Treat Instructions as Living Documentation**
Assign an owner and keep the instructions file updated. A stale instructions file actively misleads Copilot. Review and update it whenever your team changes a pattern or convention.

**XD-50: Configure .vscode/mcp.json for Team Consistency**
Set up MCP (Model Context Protocol) integrations at the workspace level so the whole team shares the same integrations. Configure Figma MCP, Jira MCP, and Chrome MCP so every engineer has consistent access to design specs, requirements, and browser context.

**XD-51: Use Global VS Code Settings for Personal Preferences**
Set global custom instructions for your personal preferences (always use TypeScript, preferred test block structure, output formatting). These combine with repo-level instructions—repo settings take precedence when they conflict.

---

### Git and Code Review

**XD-52: Use AI to Draft Commit Messages**
Use the sparkle icon in VS Code's Source Control panel to generate commit messages from staged changes. AI describes what changed—always add a line explaining why if it isn't obvious.

**XD-53: Use AI to Draft PR Descriptions**
Use Copilot Chat to draft PR descriptions: what was built, key decisions, what reviewers should focus on, and how to test. Always review and refine before submitting—AI-generated descriptions should be edited, not posted verbatim.

**XD-54: Use Chrome MCP for Real-Time Code Review**
Point Chrome MCP at a live browser tab to pull runtime context (console errors, rendered output, network requests) into your code review prompts. This removes the translation layer and gives Copilot the actual state instead of a description.

**XD-55: Paste Diffs and Ask for Pattern Analysis**
During code review, paste a diff into Chat and ask if it follows existing patterns, has unhandled edge cases, or introduces technical debt. This helps reviewers spot issues faster and catches AI mistakes before merge.

---

### Chrome MCP Workflows

**XD-56: Use Chrome MCP to Debug Visual Issues**
Open the failing state in your browser, point Chrome MCP at the tab, and ask Copilot to explain what's causing the issue. This is especially useful for runtime-only problems: misapplied tokens, broken transitions, scroll or focus behavior that only manifests in a live environment.

**Proposed XD-56: Use Chrome MCP to Give AI Access to Live Runtime Context**
AI tools operate on source files by default — they cannot see what the browser actually rendered, what errors the console threw, or what network requests fired. Chrome MCP closes that gap by exposing the live runtime state directly to Copilot. Use it whenever the problem you're diagnosing only exists at runtime: rendered output, dynamic state, CMS-hydrated content, console errors, or network behavior.

**XD-57: Validate Accessibility and Interaction State**
Use Chrome MCP to inspect ARIA attributes, focus order, and role assignments on the rendered page, then ask Copilot to flag anything that doesn't meet expected standards. Particularly useful for interactive components where accessibility depends on runtime state.

**XD-58: Compare Rendered Output Against Design Specs**
With the rendered component in the browser, ask Copilot to compare computed styles against your design token values or Figma specs. Combine Chrome MCP with Figma MCP for a closed loop: design spec on one side, rendered output on the other.

**XD-59: Diagnose CMS and Dynamic Content Issues**
When components render differently based on CMS data, use Chrome MCP to let Copilot inspect the actual output and explain how the rendered DOM differs from the expected component structure and where in the data pipeline the mismatch originates.

**Proposed XD-59: Never Run Chrome MCP Against Production or Authenticated User Sessions**
Chrome MCP has full visibility into everything the browser holds — cookies, auth tokens, session data, local storage, and any user data rendered on screen. All of this is passed to the AI model as context. Never run a Chrome MCP session against a production environment, a page with real user data, or any authenticated session using real credentials. Always use local dev servers, Storybook, or staging with test accounts. This is a hard constraint, not a preference — the consequences of getting it wrong are not recoverable.

---

### Fostering Junior Developer Growth

**XD-60: Juniors: Try It Yourself First**
Even if just for 10-15 minutes, attempt the problem before asking AI. You'll write a better prompt, understand the solution when it comes back, and build the fundamentals you need to evaluate quality. This is the difference between shipping and learning.

**XD-61: Use AI as a Rubber Duck and Thinking Partner**
Describe your approach to AI and ask if there's a better one, rather than skipping straight to asking it to execute. "What's another way to approach this?" builds pattern recognition faster than accepting the first solution.

**XD-62: Go Deeper on Unfamiliar Patterns**
When AI uses something you don't recognize, ask it to explain the concept, then read about it elsewhere too. Building deep understanding, not just accepting outputs, is what creates strong practitioners.

**XD-63: Read All Generated Code Before Committing**
If you can't explain what the code does, you don't own it yet. Younger engineers especially should spend time understanding AI output rather than just trusting it compiles and tests pass.

**XD-64: The Cost of Skipping Fundamentals**
AI can produce working code without the engineer understanding why it works—which is fine until something breaks. Practitioners who thrive long-term are the ones who use AI to accelerate learning, not bypass it. The debugging, pattern recognition, and architectural thinking that come from struggling with problems directly cannot be outsourced.

---

### Integration with Design

**XD-65: Figma MCP is Part of Your Spec Workflow**
Use Figma MCP to pull exact token values and layout specs during component development. This ensures AI-generated components respect your design system from the start, not after-the-fact adjustments.

**XD-66: Collaborate with Design During Component Development**
Work closely with design to validate interaction timing, animation feel, focus states, and scroll behavior. These are sensory judgments AI cannot make. Use Chrome MCP to show design the rendered component in real-time.

**XD-67: Validate Design-to-Code Fidelity Throughout Development**
Don't wait until the component is shipped to check pixel-perfect accuracy. Regularly compare rendered output against designs using Chrome MCP. This catches visual drift early, particularly after refactors or dependency updates that can silently shift spacing, color, or type.

---

### Performance and Long-Term Maintainability

**XD-68: AI Optimizes Locally, Humans Think Systemically**
AI-generated code can be locally correct but architecturally problematic—it doesn't know your 2-year roadmap. Human review prevents the codebase from becoming a collection of clever one-offs that no one can maintain.

**XD-69: Strong Patterns Enable Faster Future Development**
Consistent patterns now mean future AI sessions (and future engineers) can work faster and more reliably. Every time you normalize a pattern, establish a naming convention, or document a decision, you're making AI more effective and your codebase more maintainable.

**XD-70: Documentation Compounds AI Quality**
The more your codebase is documented, the better Copilot's inline suggestions become. Documentation and AI quality compound each other—invest in both.
