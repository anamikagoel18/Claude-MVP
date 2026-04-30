/**
 * Workflow Detection Utility
 * 
 * BOTH conditions must be present simultaneously:
 * 1. Sequential structure (first/then/next/after that/finally + multiple action verbs)
 * 2. Final deliverable (PDF/report/brief/summary/doc/share/format output)
 */

// Sequential structure keywords
const SEQUENTIAL_KEYWORDS = [
  'first', 'then', 'next', 'after that', 'finally', 'step 1', 'step 2',
  'following that', 'once done', 'afterwards', 'subsequently'
];

// Final deliverable keywords
const DELIVERABLE_KEYWORDS = [
  'as a pdf', 'as a brief', 'as a report', 'as a summary', 'as a doc',
  'as a document', 'share with my team', 'format the output', 'format it as',
  'export as', 'save as', 'compile it', 'generate a report', 'generate a brief',
  'generate a summary', 'create a report', 'create a brief', 'create a summary',
  'produce a report', 'produce a brief', 'write up a report', 'into a report',
  'into a brief', 'into a summary', 'into a document', 'formatted report',
  'formatted brief', 'formatted summary', 'output as', 'deliver as'
];

// Rule 1 — competitor / product / roadmap / benchmarking keywords
const RULE1_KEYWORDS = [
  'competitor', 'competitive', 'competition', 'benchmark', 'benchmarking',
  'product comparison', 'compare products', 'market analysis', 'landscape analysis',
  'roadmap review', 'feature comparison', 'feature benchmark', 'market research',
  'market landscape', 'compare features', 'compare tools', 'compare platforms',
  'compare software', 'rival', 'industry analysis'
];

// Rule 2 — sprint retro / team review / action items keywords
const RULE2_KEYWORDS = [
  'sprint retrospective', 'sprint retro', 'retrospective', 'what went well',
  'what didn\'t go well', 'blockers', 'action items', 'team review',
  'team feedback', 'gather feedback', 'sprint review', 'iteration review',
  'lessons learned', 'post-mortem', 'postmortem', 'went wrong', 'improvements',
  'sprint goals', 'velocity', 'scrum retro'
];

/**
 * Checks if prompt has sequential structure
 */
function hasSequentialStructure(text) {
  const lower = text.toLowerCase();
  // Check for explicit sequential keywords
  const hasKeyword = SEQUENTIAL_KEYWORDS.some(kw => lower.includes(kw));
  if (hasKeyword) return true;

  // Check for multiple action verbs chained (heuristic: 3+ action-like words + comma or "and")
  const actionVerbs = ['research', 'analyze', 'analyse', 'gather', 'collect', 'compile',
    'compare', 'review', 'summarize', 'summarise', 'write', 'draft', 'create', 'build',
    'generate', 'format', 'extract', 'identify', 'document', 'prepare', 'pull', 'find',
    'search', 'check', 'scan', 'look up', 'upload', 'download', 'send', 'share'];
  const matches = actionVerbs.filter(v => lower.includes(v));
  return matches.length >= 2;
}

/**
 * Checks if prompt mentions a final deliverable
 */
function hasFinalDeliverable(text) {
  const lower = text.toLowerCase();
  return DELIVERABLE_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Determines which rule applies to this prompt
 */
function getRuleKey(text) {
  const lower = text.toLowerCase();
  if (RULE1_KEYWORDS.some(kw => lower.includes(kw))) return 'rule1';
  if (RULE2_KEYWORDS.some(kw => lower.includes(kw))) return 'rule2';
  return 'rule3';
}

/**
 * Generates custom Rule 3 steps from the actual prompt content
 */
function generateCustomSteps(text) {
  const lower = text.toLowerCase();

  // Extract meaningful action phrases from the prompt
  // Split by sequential connectors to get individual step descriptions
  const connectorPattern = /(?:first[,\s]+|then[,\s]+|next[,\s]+|after that[,\s]+|finally[,\s]+|,\s*(?:and\s+)?)/gi;
  const parts = text.split(connectorPattern)
    .map(p => p.trim())
    .filter(p => p.length > 5 && p.length < 80);

  // Build 4 meaningful steps
  let steps = [];

  if (parts.length >= 4) {
    // Use first 4 parts, capitalize and truncate
    steps = parts.slice(0, 4).map(p => {
      const cleaned = p.replace(/[.!?]+$/, '').trim();
      return capitalize(cleaned.length > 50 ? cleaned.slice(0, 50) + '...' : cleaned);
    });
  } else if (parts.length === 3) {
    steps = [
      capitalize(parts[0].slice(0, 50)),
      capitalize(parts[1].slice(0, 50)),
      capitalize(parts[2].slice(0, 50)),
      'Format and export final output'
    ];
  } else if (parts.length === 2) {
    steps = [
      capitalize(parts[0].slice(0, 50)),
      'Research and gather supporting data',
      capitalize(parts[1].slice(0, 50)),
      'Format and export final output'
    ];
  } else {
    // Fallback: derive from topic keywords
    steps = deriveStepsFromTopic(lower);
  }

  return steps;
}

/**
 * Derives generic but contextual steps from topic keywords
 */
function deriveStepsFromTopic(lower) {
  if (lower.includes('email') || lower.includes('inbox')) {
    return ['Collect and filter emails', 'Categorize and prioritize messages', 'Draft response templates', 'Format as email summary report'];
  }
  if (lower.includes('survey') || lower.includes('feedback')) {
    return ['Collect survey responses', 'Analyze patterns and trends', 'Identify key insights', 'Format as insights report'];
  }
  if (lower.includes('content') || lower.includes('blog') || lower.includes('article')) {
    return ['Research topic and gather sources', 'Outline key sections', 'Draft content body', 'Format and finalize document'];
  }
  if (lower.includes('data') || lower.includes('report') || lower.includes('metric')) {
    return ['Collect and clean data', 'Run analysis and find patterns', 'Create visualizations', 'Format as final report'];
  }
  if (lower.includes('user') || lower.includes('customer') || lower.includes('interview')) {
    return ['Gather user feedback data', 'Identify patterns and themes', 'Synthesize key findings', 'Format as research report'];
  }
  if (lower.includes('social') || lower.includes('post') || lower.includes('campaign')) {
    return ['Research audience and trends', 'Plan content calendar', 'Draft posts and copy', 'Format as campaign brief'];
  }
  if (lower.includes('code') || lower.includes('technical') || lower.includes('api')) {
    return ['Review existing codebase', 'Identify issues and improvements', 'Implement changes', 'Document and format as tech brief'];
  }
  // Universal fallback
  return [
    'Gather and organize relevant information',
    'Analyze and identify key patterns',
    'Process and refine the output',
    'Format and export final deliverable'
  ];
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns workflow name based on rule
 */
function getWorkflowName(ruleKey, promptText) {
  if (ruleKey === 'rule1') return 'Competitor Brief workflow';
  if (ruleKey === 'rule2') return 'Sprint Retro workflow';

  // Rule 3: derive name from prompt topic
  const lower = promptText.toLowerCase();
  if (lower.includes('email') || lower.includes('inbox')) return 'Email Summary workflow';
  if (lower.includes('survey') || lower.includes('feedback')) return 'Feedback Analysis workflow';
  if (lower.includes('content') || lower.includes('blog') || lower.includes('article')) return 'Content Pipeline workflow';
  if (lower.includes('data') || lower.includes('metric')) return 'Data Report workflow';
  if (lower.includes('social') || lower.includes('campaign')) return 'Campaign Brief workflow';
  if (lower.includes('user') || lower.includes('customer')) return 'User Research workflow';
  if (lower.includes('code') || lower.includes('technical')) return 'Tech Review workflow';
  if (lower.includes('research')) return 'Research Pipeline workflow';
  return 'Custom workflow';
}

/**
 * Main function: takes prompt text, returns steps + metadata
 * Called separately for each individual workflow instance
 */
export function getStepsForWorkflow(promptText) {
  const ruleKey = getRuleKey(promptText);
  let steps;

  if (ruleKey === 'rule1') {
    steps = [
      'Upload doc + extract key info',
      'Web search — landscape analysis',
      'Compare and analyze gaps',
      'Format output as final brief'
    ];
  } else if (ruleKey === 'rule2') {
    steps = [
      'Gather team feedback',
      "Identify what went well and what didn't",
      'Document blockers and action items',
      'Format as retro summary doc'
    ];
  } else {
    steps = generateCustomSteps(promptText);
  }

  return {
    steps,
    ruleKey,
    workflowName: getWorkflowName(ruleKey, promptText)
  };
}

/**
 * Detects whether a prompt is a workflow.
 * Returns WorkflowInstance or null.
 * BOTH conditions required: sequential structure AND final deliverable.
 */
export function detectWorkflow(promptText) {
  if (!promptText || promptText.trim().length < 15) return null;

  const sequential = hasSequentialStructure(promptText);
  const deliverable = hasFinalDeliverable(promptText);

  if (!sequential || !deliverable) return null;

  const { steps, ruleKey, workflowName } = getStepsForWorkflow(promptText);

  return {
    id: crypto.randomUUID(),
    promptText,
    steps,
    ruleKey,
    workflowName
  };
}

/**
 * Generate session title from first user prompt (first 8-10 words)
 */
export function generateSessionTitle(promptText) {
  const words = promptText.trim().split(/\s+/);
  const titleWords = words.slice(0, 9);
  let title = titleWords.join(' ');
  if (words.length > 9) title += '...';
  return title;
}
