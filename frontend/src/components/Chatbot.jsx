import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const SYSTEM_PROMPT = `You are a helpful, kind, student-friendly Class 10 Maths and Science tutor. Explain clearly with examples and step-by-step thought process. Keep answers concise but supportive. Always remind students that "Practice makes perfect" and include one short learning tip.`;

const initialMessages = [
  {
    id: 'welcome-1',
    role: 'assistant',
    text: '👋 Hi there! I am SkillWeave Tutor Bot. Ask me any Class 10 Maths or Science question and I will explain it gently. Start with a question when you are ready!',
  },
];

function getGroqApiKey() {
  return window?.__env?.REACT_APP_GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY || '';
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  // error shown only in console, do not display on UI
  const [error, setError] = useState('');

  useEffect(() => {
    const key = getGroqApiKey();
    setApiKey(key);
  }, []);

  const canSend = useMemo(
    () => draft.trim().length > 0 && !isTyping && apiKey.trim().length > 0,
    [draft, isTyping, apiKey]
  );


  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const sendAsk = async () => {
    const question = draft.trim();
    if (!question) return;

    setError('');
    addMessage({ id: `u-${Date.now()}`, role: 'user', text: question });
    setDraft('');
    setIsTyping(true);

    const key = apiKey.trim();
    if (!key) {
      setError('API key is not set. Please configure REACT_APP_GROQ_API_KEY in your environment and reload.');
      setIsTyping(false);
      return;
    }

    try {
      const payload = {
        model: 'groq-base',
        input: `${SYSTEM_PROMPT}\n\nStudent question: ${question}`,
        max_output_tokens: 300,
        temperature: 0.75,
      };

      const response = await fetch('https://api.groq.ai/v1/llm/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Groq API error ${response.status}: ${text}`);
      }

      const data = await response.json();
      const gotText =
        String(data?.output || data?.result || '') ||
        String(data?.choices?.[0]?.text || '') ||
        String(data?.outputs?.[0]?.text || data?.outputs?.[0]?.content?.[0]?.text || '');
      const finalText = gotText.trim() || 'Sorry, I could not generate an answer. Please try again.';

      addMessage({ id: `a-${Date.now()}`, role: 'assistant', text: finalText });
    } catch (err) {
      console.error('Groq llm error', err);
      addMessage({ id: `a-${Date.now()}`, role: 'assistant', text: 'Oops! An error happened while connecting to Groq API. Please check your key and network.' });
      setError(err.message || 'Unable to ask Groq API.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && canSend) {
      event.preventDefault();
      sendAsk();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div
        className={`w-80 max-h-[75vh] rounded-2xl bg-white shadow-[0_0_30px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-5'}`}
        style={{ transformOrigin: 'bottom right' }}
      >
        <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white">
            <MessageSquare size={16} />
            <div>
              <div className="font-bold">Tutor Bot</div>
              <div className="text-xs text-indigo-100">Class 10 Maths & Science</div>
            </div>
          </div>
          <button
            aria-label="Close chatbot"
            className="rounded-full bg-white/20 p-1 hover:bg-white/40 transition"
            onClick={() => setOpen(false)}
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="p-3 space-y-2 h-[340px] overflow-y-auto bg-gradient-to-b from-white via-slate-50 to-slate-100">
          <div className="rounded p-2 border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
            Tip: Ask questions like "Explain photosynthesis with a diagram idea" or "Solve 12x-3=21 step-by-step".
          </div>

          <div className="space-y-2">
            {messages.map((msg) => {
              const isStudent = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-2 text-sm leading-relaxed ${isStudent ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl p-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-75" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-150" />
                    <span className="ml-1 text-xs text-slate-400">Tutor is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 p-2 bg-white">
          {error && (
            <div className="mb-2 text-xs text-red-600 border border-red-100 rounded px-2 py-1 bg-red-50">{error}</div>
          )}
          <div className="flex gap-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here..."
              className="h-16 resize-none rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={sendAsk}
              disabled={!canSend}
              className={`p-3 rounded-lg bg-indigo-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700`}
              aria-label="Send question"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="mt-2 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95 focus:outline-none flex items-center justify-center text-white"
        aria-label="Toggle Chatbot"
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
};

export default Chatbot;
