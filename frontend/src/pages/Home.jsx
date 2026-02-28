import React from 'react';
import { ArrowRight, Code, Shield, Terminal } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content">
                    <div className="badge">AI-Powered Code Analysis</div>
                    <h1>Ship Better Code <span className="gradient-text">Faster</span></h1>
                    <p>
                        Experience the next generation of code reviews.
                        CodeSage uses advanced AI to identify bugs, suggest optimizations,
                        and ensure your codebase stays pristine.
                    </p>
                    <div className="hero-actions">
                        <button className="cta-primary" onClick={() => { navigate('/editor') }}>
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button className="cta-secondary" onClick={() => navigate('/docs')}>Documentation</button>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="code-card">
                        <div className="card-header">
                            <div className="dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="file-name">Reviewer.js</span>
                        </div>
                        <div className="card-body">
                            <pre>
                                <code>{`function optimize(code) {
  // Analyzing for patterns...
  const suggestions = AI.analyze(code);
  return suggestions;
}`}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <Shield className="feature-icon" size={32} />
                    <h3>Security First</h3>
                    <p>Identify vulnerabilities before they reach production.</p>
                </div>
                <div className="feature-card">
                    <Terminal className="feature-icon" size={32} />
                    <h3>Deep Analysis</h3>
                    <p>Understanding context, not just syntax.</p>
                </div>
                <div className="feature-card">
                    <Code className="feature-icon" size={32} />
                    <h3>Best Practices</h3>
                    <p>Enforce style guides and modern patterns automatically.</p>
                </div>
            </section>

            <section className="gemini-guide">
                <div className="guide-header">
                    <h2>Get Your Free <span className="gradient-text">Gemini Key</span></h2>
                    <p>Start reviewing your code with AI in less than 2 minutes.</p>
                </div>

                <div className="guide-steps">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h4>Visit AI Studio</h4>
                        <p>Head over to Google AI Studio, the developer platform for Gemini.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h4>Sign In</h4>
                        <p>Log in with your standard Google Account to access the dashboard.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h4>Generate Key</h4>
                        <p>Click "Get API Key" and create a new project key in one click.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h4>Paste & Run</h4>
                        <p>Copy your key and paste it into the "API Keys" section in CodeSage.</p>
                    </div>
                </div>

                <div className="guide-cta">
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                    >
                        Get Your Key Now <ExternalLink size={18} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Home;
