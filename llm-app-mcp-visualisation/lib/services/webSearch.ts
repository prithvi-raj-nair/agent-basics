// Simulated web search - returns dummy results
export function simulateWebSearch(query: string): string {
  const dummyResults = [
    `Based on a web search for "${query}":`,
    '',
    '1. Wikipedia: This topic is widely covered in various sources...',
    '2. News Article: Recent developments show interesting trends...',
    '3. Academic Paper: Research indicates multiple perspectives...',
    '',
    'Summary: The search returned several relevant results about the topic.',
  ].join('\n')

  return dummyResults
}
