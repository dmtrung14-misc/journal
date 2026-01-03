/**
 * Strips markdown syntax from text to get plain text
 */
export function stripMarkdown(markdown: string): string {
  let text = markdown

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '')
  
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '')
  
  // Remove headers
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1')
  
  // Remove bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  
  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
  
  // Remove LaTeX math
  text = text.replace(/\$([^$]+)\$/g, '') // inline math
  text = text.replace(/\$\$([^$]+)\$\$/g, '') // block math
  
  // Remove horizontal rules
  text = text.replace(/^---+$/gm, '')
  
  // Remove blockquotes
  text = text.replace(/^>\s+(.+)$/gm, '$1')
  
  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1')
  text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, '$1')
  
  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.trim()

  return text
}

