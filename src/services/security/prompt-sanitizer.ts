/**
 * Prompt Injection & Untrusted Data Sanitizer
 * Neutralizes prompt jailbreak attempts and XML delimiter injection.
 */
export function sanitizeStudyMaterial(rawText: string): string {
  if (!rawText) return "";

  let sanitized = rawText;

  // 1. Strip NULL bytes and binary control characters (except tab and newlines)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 2. Neutralize closing untrusted XML sandbox tags to prevent delimiter escape
  sanitized = sanitized.replace(/<\/?untrusted_study_material[^>]*>/gi, "[study_material_tag_neutralized]");

  // 3. Neutralize common LLM meta-instruction jailbreak tokens
  sanitized = sanitized.replace(/\[\/?INST\]/gi, "[instruction_token_neutralized]");
  sanitized = sanitized.replace(/<<SYS>>/gi, "[system_token_neutralized]");
  sanitized = sanitized.replace(/<\/<?SYS>>/gi, "[system_token_neutralized]");
  sanitized = sanitized.replace(/<\|im_start\|>/gi, "[chatml_neutralized]");
  sanitized = sanitized.replace(/<\|im_end\|>/gi, "[chatml_neutralized]");
  sanitized = sanitized.replace(/<\|endoftext\|>/gi, "[endoftext_neutralized]");

  // 4. Strip ANSI terminal escape sequences
  sanitized = sanitized.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");

  return sanitized;
}
