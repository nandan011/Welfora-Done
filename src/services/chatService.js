/**
 * Welfora Assistant Client Chat Service
 *
 * Architecture:
 * React Chat UI -> /api/chat -> Gemini API (@google/genai) -> Gemini response -> React Chat UI
 *
 * Security Note:
 * NO API keys are kept in client-side code. All calls pass through the secure /api/chat endpoint.
 */

const ENDPOINT = '/api/chat';

/**
 * Send chat message history to backend /api/chat endpoint.
 *
 * @param {Array<{role: string, content: string}>} messages Full session history
 * @param {Array} schemes Active schemes from Welfora context for grounding
 * @returns {Promise<string>} Gemini response text
 */
export async function sendChatMessage(messages, schemes = []) {
  let response;

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        schemes,
      }),
      signal: AbortSignal.timeout(45000), // 45-second timeout
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      const error = new Error('The request timed out. Please try again.');
      error.code = 'TIMEOUT';
      throw error;
    }
    const error = new Error('Network error: Unable to reach Welfora Assistant server.');
    error.code = 'NETWORK_ERROR';
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    const error = new Error(`Server returned invalid response (status ${response.status}).`);
    error.code = 'INVALID_RESPONSE';
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Assistant request failed with status ${response.status}`);
    error.code = data?.error || 'REQUEST_FAILED';
    error.status = response.status;
    throw error;
  }

  if (!data?.reply || typeof data.reply !== 'string') {
    const error = new Error('Assistant returned an empty response. Please try asking again.');
    error.code = 'EMPTY_RESPONSE';
    throw error;
  }

  return data.reply;
}
