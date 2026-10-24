import { useState, useRef, useEffect, useCallback } from 'react';
import PageTitle from '../components/PageTitle';
import { useWelfora } from '../context/WelforaContext';
import { sendChatMessage } from '../services/chatService';

const SUGGESTIONS = [
  { label: '🎓 Education & Scholarships', text: 'What scholarship and education loan schemes are available for students in India?' },
  { label: '🌱 Farmer & Agriculture Support', text: 'What benefits does PM-KISAN provide and who is eligible?' },
  { label: '🩺 Healthcare & Ayushman Bharat', text: 'How do I check eligibility and apply for Ayushman Bharat PM-JAY?' },
  { label: '🏠 Housing Support (PMAY)', text: 'What are the eligibility requirements for PM Awas Yojana (PMAY)?' },
  { label: '💼 Employment & Mudra Loans', text: 'How does Pradhan Mantri Mudra Yojana work for small business entrepreneurs?' },
  { label: '👩‍👧 Women & Child Schemes', text: 'What schemes are available for women and girl children like Sukanya Samriddhi Yojana?' },
  { label: '🧓 Senior Citizen Pensions', text: 'What pension schemes exist for senior citizens under NSAP?' },
  { label: '📑 Required Documents Guide', text: 'What common documents are required when applying for Indian government welfare schemes?' },
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Namaste! I'm your Welfora Citizen Assistant. I'm here to help you navigate India's central and state welfare schemes with complete clarity.\n\nYou can ask me about eligibility criteria, financial benefits, required documents, or step-by-step application guidance. What would you like to explore today?",
};

/**
 * Format markdown text with bolding, lists, and line breaks safely in JSX.
 */
function FormattedMessage({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="bubble-text-inner">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="bubble-spacer" />;
        }

        // Bullet point formatting
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const cleanLine = isBullet ? trimmed.replace(/^(\*|-|•)\s+/, '') : line;

        // Parse **bold** parts
        const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
        const parsedContent = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="bubble-bullet-item">
              <span className="bullet-dot">•</span>
              <span>{parsedContent}</span>
            </div>
          );
        }

        return <div key={lineIdx} className="bubble-line">{parsedContent}</div>;
      })}
    </div>
  );
}

export default function AssistantPage() {
  const { schemes, notify } = useWelfora();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState('');

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLastUserMessage(userText);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const reply = await sendChatMessage(newMessages, schemes);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setError(null);
    } catch (err) {
      console.error('[AssistantPage Error]:', err);

      let errorMsg = 'Unable to connect to Welfora Assistant.';
      if (err.code === 'MISSING_API_KEY') {
        errorMsg = 'Unable to connect to Welfora Assistant: GEMINI_API_KEY is not configured on the server. Please add your Gemini API key to .env or .env.local.';
      } else if (err.code === 'INVALID_API_KEY') {
        errorMsg = 'Unable to connect to Welfora Assistant: The configured GEMINI_API_KEY is invalid. Please check your API key from Google AI Studio.';
      } else if (err.code === 'RATE_LIMIT') {
        errorMsg = 'Unable to connect to Welfora Assistant: Gemini API rate limit or quota exceeded. Please wait a moment and click Retry.';
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT') {
        errorMsg = 'Unable to connect to Welfora Assistant: Network connection error. Please verify your connection and click Retry.';
      } else if (err.message) {
        errorMsg = `Unable to connect to Welfora Assistant: ${err.message}`;
      }

      setError(errorMsg);
      notify?.('Unable to connect to Welfora Assistant', 'error');
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, schemes, notify]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleNewChat() {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setLastUserMessage('');
    setInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  function handleRetry() {
    if (!lastUserMessage) return;
    setError(null);
    sendMessage(lastUserMessage);
  }

  return (
    <section className="page-content">
      <PageTitle
        eyebrow="AI CITIZEN ASSISTANT"
        title="Welfora Assistant"
        subtitle="Intelligent assistance grounded in India's welfare schemes. Real-time guidance on eligibility, benefits, documents, and application steps."
      />

      <div className="chat-outer panel">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="assistant-orb">✦</div>
            <div>
              <h2>Welfora Assistant</h2>
              <p>Grounded in verified government scheme data</p>
            </div>
          </div>
          <div className="chat-header-right">
            <span className="online-dot online">
              ● Active Assistant
            </span>
            <button
              className="outline-btn small"
              onClick={handleNewChat}
              title="Start a fresh conversation"
            >
              ✦ New Conversation
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            <p className="suggestions-label">Try asking about any scheme category:</p>
            <div className="suggestions-grid">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.label}
                  className="suggestion-chip"
                  onClick={() => sendMessage(s.text)}
                  disabled={loading}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages" aria-live="polite" aria-label="Conversation">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}
            >
              {msg.role === 'assistant' && (
                <div className="bubble-avatar">✦</div>
              )}
              <div className="bubble-content">
                <div className="bubble-text">
                  <FormattedMessage content={msg.content} />
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="bubble-avatar user-avatar">U</div>
              )}
            </div>
          ))}

          {/* Loading / Thinking indicator */}
          {loading && (
            <div className="chat-bubble assistant-bubble">
              <div className="bubble-avatar">✦</div>
              <div className="bubble-content">
                <div className="typing-indicator" aria-label="Thinking">
                  <span className="thinking-label">Thinking...</span>
                  <span className="thinking-dot" /><span className="thinking-dot" /><span className="thinking-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Error state with Retry button */}
          {error && (
            <div className="chat-error-block" role="alert">
              <div className="chat-error-message">
                <span className="chat-error-icon">⚠</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                className="outline-btn small chat-retry-btn"
                onClick={handleRetry}
              >
                ↻ Retry
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          className="chat-input-form"
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
        >
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Indian government schemes, eligibility, documents, or benefits… (Enter to send)"
            rows={2}
            disabled={loading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            className="primary-btn chat-send-btn"
            disabled={loading || !input.trim()}
          >
            {loading ? 'Thinking...' : 'Send →'}
          </button>
        </form>

        <p className="chat-disclaimer">
          Welfora Assistant is powered by Google Gemini API and grounded in government welfare scheme data. Please verify official details on government portals before applying.
        </p>
      </div>
    </section>
  );
}
