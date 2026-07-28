export type NavItem = {
  title: string;
  path: string;
};

export type NavGroup = NavItem & {
  children?: NavItem[];
};

export const workshopTitle = "AI-Powered SDLC with Claude Code";

export const navGroups: NavGroup[] = [
  { title: "Introduction", path: "/introduction" },
  {
    title: "Getting Started",
    path: "/getting-started",
    children: [
      { title: "Environment Setup", path: "/getting-started/environment-setup" },
      { title: "TaskFlow Setup", path: "/getting-started/explore-taskflow" },
      { title: "Meet Claude Code", path: "/getting-started/meet-claude-code" },
    ],
  },
  {
    title: "Claude Code Foundation",
    path: "/claude-code-foundation",
    children: [
      { title: "The Mindset Shift", path: "/claude-code-foundation/mindset-shift" },
      { title: "Context and Tools", path: "/claude-code-foundation/context-window" },
      { title: "Sub-Agents", path: "/claude-code-foundation/sub-agents" },
      { title: "Plan Mode and Power Features", path: "/claude-code-foundation/plan-mode" },
      { title: "Best Practices (Optional)", path: "/claude-code-foundation/golden-rules" },
    ],
  },
  {
    title: "Claude Code Configuration",
    path: "/claude-code-configuration",
    children: [
      { title: "CLAUDE.md", path: "/claude-code-configuration/claude-md" },
      { title: "Settings", path: "/claude-code-configuration/settings" },
      { title: "Rules", path: "/claude-code-configuration/rules" },
      { title: "Auto Memory", path: "/claude-code-configuration/auto-memory" },
    ],
  },
  {
    title: "Claude Code Extensions",
    path: "/claude-code-extensions",
    children: [
      { title: "Skills", path: "/claude-code-extensions/skills" },
      { title: "Custom Agents", path: "/claude-code-extensions/agents" },
      { title: "Hooks", path: "/claude-code-extensions/hooks" },
      { title: "MCP", path: "/claude-code-extensions/mcp" },
      { title: "Agent Teams", path: "/claude-code-extensions/agent-teams" },
      { title: "Recap", path: "/claude-code-extensions/composition" },
    ],
  },
  {
    title: "SDLC 1: Requirements",
    path: "/phase-1-requirements",
    children: [
      { title: "Synthesize Raw Input", path: "/phase-1-requirements/synthesize-input" },
      { title: "Prioritize Requirements", path: "/phase-1-requirements/prioritize-requirements" },
      { title: "User Stories", path: "/phase-1-requirements/user-stories" },
      { title: "Decompose Into Backlog", path: "/phase-1-requirements/backlog" },
    ],
  },
  {
    title: "SDLC 2: Design",
    path: "/phase-2-design",
    children: [
      { title: "Write and Validate the Spec", path: "/phase-2-design/spec-and-validate" },
      { title: "Architecture Plan", path: "/phase-2-design/explore-codebase" },
      { title: "CLAUDE.md and ADR", path: "/phase-2-design/architecture-and-adr" },
      { title: "Design Review Gate", path: "/phase-2-design/design-review" },
    ],
  },
  {
    title: "SDLC 3: Implementation",
    path: "/phase-3-implementation",
    children: [
      { title: "TDD with Claude", path: "/phase-3-implementation/tdd-with-claude" },
      { title: "Review, Commit, Advance", path: "/phase-3-implementation/plan-review-execute" },
      { title: "Pre-Built Workflow Plugins", path: "/phase-3-implementation/smoke-test" },
    ],
  },
  {
    title: "SDLC 4: Ralph Wiggum Loop",
    path: "/phase-4-ralph-loop",
    children: [
      { title: "The Pattern", path: "/phase-4-ralph-loop/concept-and-setup" },
      { title: "The Pipeline Files", path: "/phase-4-ralph-loop/four-prompt-files" },
      { title: "Run the Pipeline", path: "/phase-4-ralph-loop/run-ralph" },
    ],
  },
  { title: "Conclusion", path: "/conclusion" },
];

export const lessonOrder = [
  "/",
  ...navGroups.flatMap((group) => [
    group.path,
    ...(group.children?.map((item) => item.path) ?? []),
  ]),
];

export function getBreadcrumbs(path: string, title: string): NavItem[] {
  const group = navGroups.find(
    (item) => path === item.path || item.children?.some((child) => child.path === path),
  );

  if (!group || path === group.path) {
    return [{ title, path }];
  }

  return [
    { title: group.title, path: group.path },
    { title, path },
  ];
}
