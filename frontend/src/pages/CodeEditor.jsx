import React, { useState, useRef, useEffect } from "react";
import { useAIKey } from "../context/AIKeyContext";
import { X, Layout, FileText, Play } from "lucide-react";
import "../styles/CodeEditor.css";

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust", "css", "html"];
const FALLBACK_MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash",
    "gemini-pro"
];

const SAMPLE_CODE = `function fibonacci(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// Test the function
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`;

function formatContent(text) {
    return text
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/^[-*]\s+(.+)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.)/m, '<p>$1')
        .replace(/([^>])$/, '$1</p>');
}

function parseReview(text) {
    const sections = [];
    const lines = text.split('\n');
    let current = { type: 'info', content: '', lines: [] };

    const sectionPatterns = [
        { regex: /^#{1,3}\s*(.*summary.*|overview)/i, type: 'summary', icon: '📋' },
        { regex: /^#{1,3}\s*(.*issue|.*bug|.*error|.*problem)/i, type: 'issue', icon: '🐛' },
        { regex: /^#{1,3}\s*(.*suggest|.*improve|.*recommend|.*enhance)/i, type: 'suggestion', icon: '💡' },
        { regex: /^#{1,3}\s*(.*good|.*strength|.*positive|.*well)/i, type: 'positive', icon: '✅' },
        { regex: /^#{1,3}\s*(.*security|.*vulnerab)/i, type: 'security', icon: '🔒' },
        { regex: /^#{1,3}\s*(.*performance|.*optim)/i, type: 'perf', icon: '⚡' },
        { regex: /^#{1,3}\s*(.*style|.*format|.*convention)/i, type: 'style', icon: '🎨' },
        { regex: /^#{1,3}/i, type: 'info', icon: '📝' },
    ];

    lines.forEach(line => {
        let matched = false;
        for (const pattern of sectionPatterns) {
            if (pattern.regex.test(line)) {
                if (current.lines.length > 0) {
                    current.content = formatContent(current.lines.join('\n'));
                    sections.push(current);
                }
                const title = line.replace(/^#{1,3}\s*/, '');
                current = { type: pattern.type, icon: pattern.icon, title, lines: [], content: '' };
                matched = true;
                break;
            }
        }
        if (!matched) current.lines.push(line);
    });

    if (current.lines.length > 0) {
        current.content = formatContent(current.lines.join('\n'));
        if (sections.length === 0) {
            sections.push({ type: 'info', icon: '📝', content: current.content });
        } else {
            sections.push(current);
        }
    }

    return sections.filter(s => s.content.trim());
}

function ReviewPanel({ review, loading, error }) {
    if (loading) {
        return (
            <div className="review-loading">
                <div className="pulse-ring" />
                <div className="pulse-ring delay-1" />
                <div className="pulse-ring delay-2" />
                <p className="loading-text">Analyzing your code...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="review-error">
                <span className="error-icon">⚠</span>
                <p>{error}</p>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="review-empty">
                <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <p className="empty-title">Ready to Review</p>
                <p className="empty-sub">Write or paste your code, then hit <kbd>Review Code</kbd></p>
            </div>
        );
    }

    const sections = parseReview(review);

    return (
        <div className="review-content">
            {sections.map((section, i) => (
                <div key={i} className={`review-section ${section.type}`} style={{ animationDelay: `${i * 0.08}s` }}>
                    {section.icon && <span className="section-icon">{section.icon}</span>}
                    <div className="section-body">
                        {section.title && <h4 className="section-title">{section.title}</h4>}
                        <div className="section-text" dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

const CodeEditor = () => {
    const { apiKey } = useAIKey();
    const [code, setCode] = useState(SAMPLE_CODE);
    const [language, setLanguage] = useState("javascript");
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [error, setError] = useState(null);
    const [lineCount, setLineCount] = useState(0);
    const textareaRef = useRef(null);
    const gutterRef = useRef(null);

    useEffect(() => {
        setLineCount(code.split('\n').length);
    }, [code]);

    const syncScroll = (e) => {
        if (gutterRef.current) {
            gutterRef.current.scrollTop = e.target.scrollTop;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newCode = code.substring(0, start) + '  ' + code.substring(end);
            setCode(newCode);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 2;
            }, 0);
        }
    };

    const reviewCode = async () => {
        if (!code.trim()) return;
        if (!apiKey) {
            setError("Please set your Gemini API Key in the Navbar first.");
            return;
        }

        setLoading(true);
        setShowReview(true);
        setError(null);
        setReview(null);

        for (let i = 0; i < FALLBACK_MODELS.length; i++) {
            const modelId = FALLBACK_MODELS[i];
            try {
                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `You are an expert code reviewer. Review the following ${language} code thoroughly. Structure your review with these sections using markdown headers (##):

## Summary
Brief overview of what the code does and overall quality.

## Strengths
What's done well.

## Issues & Bugs
Any bugs, errors, or potential problems.

## Suggestions
Specific improvements with examples where helpful.

## Performance
Performance considerations if applicable.

## Security
Security concerns if applicable.

Keep your response focused and actionable. Use inline code backticks for code references.

\`\`\`${language}
${code}
\`\`\`
`
                                }]
                            }],
                            generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
                        })
                    }
                );

                // Fallback on Rate Limit (429), Not Found (404), Forbidden (403), or Bad Request (400)
                if ((res.status === 429 || res.status === 404 || res.status === 403 || res.status === 400) && i < FALLBACK_MODELS.length - 1) {
                    console.warn(`Model ${modelId} failed (${res.status}). Trying next fallback...`);
                    continue;
                }

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error?.message || `API Error: ${res.status}`);
                }

                const data = await res.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) throw new Error("No response from Gemini");
                setReview(text);
                return; // Success!
            } catch (err) {
                if (i === FALLBACK_MODELS.length - 1) {
                    setError(err.message);
                }
            }
        }
        setLoading(false);
    };

    const clearCode = () => { setCode(''); setReview(null); setError(null); };
    const copyCode = () => navigator.clipboard.writeText(code);

    return (
        <div className="code-editor-container">
            {/* Split view */}
            <div className={`main-split ${showReview ? 'show-review' : ''}`}>
                {/* Editor */}
                <div className="editor-side-panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <div className="panel-title-dot" />
                            Editor
                        </div>
                        <div className="header-right">
                            <button
                                className={`btn btn-ghost ${showReview ? 'active' : ''}`}
                                onClick={() => setShowReview(!showReview)}
                                title="Toggle Review Panel"
                            >
                                <Layout size={16} />
                                <span>Panel</span>
                            </button>
                            <select
                                className="lang-select"
                                value={language}
                                onChange={e => setLanguage(e.target.value)}
                            >
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <button className="btn btn-ghost" onClick={copyCode}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                                Copy
                            </button>
                            <button className="btn btn-ghost" onClick={clearCode}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                </svg>
                                Clear
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={reviewCode}
                                disabled={loading || !code.trim()}
                            >
                                {loading ? (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                                        </svg>
                                        Reviewing...
                                    </>
                                ) : (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Review Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="editor-body">
                        <div className="line-gutter" ref={gutterRef}>
                            <div className="gutter-inner">
                                {Array.from({ length: lineCount }, (_, i) => (
                                    <span key={i} className="gutter-line">{i + 1}</span>
                                ))}
                            </div>
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="code-textarea"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            onScroll={syncScroll}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            placeholder={`// Write your ${language} code here...`}
                        />
                    </div>
                    <div className="status-bar">
                        <span className="status-item active">{language.toUpperCase()}</span>
                        <span className="status-item">{code.length} chars</span>
                        <span className="status-item">{lineCount} lines</span>
                    </div>
                </div>

                {/* Review */}
                <div className={`review-panel ${!showReview ? 'collapsed' : ''}`}>
                    <div className="panel-header">
                        <div className="panel-title">
                            <div className="panel-title-dot" style={{ background: 'var(--accent-color)', boxShadow: '0 0 6px var(--accent-color)' }} />
                            Gemini Review
                        </div>
                        <div className="header-right">
                            {review && !loading && (
                                <button className="btn btn-ghost" onClick={reviewCode} style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                                    Re-analyze
                                </button>
                            )}
                            <button className="close-panel-btn" onClick={() => setShowReview(false)}>
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="review-body">
                        <ReviewPanel review={review} loading={loading} error={error} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;