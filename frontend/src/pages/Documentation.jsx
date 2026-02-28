import React from 'react';
import { Book, Key, Globe, HelpCircle, Shield, Zap, Sparkles, Terminal } from 'lucide-react';
import '../styles/Documentation.css';

const Documentation = () => {
    const [activeSection, setActiveSection] = React.useState('intro');

    React.useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll('.doc-section');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const sections = [
        // ... (sections content remains the same)
    ];

    // Note: I need to redefine the sections because I'm using activeSection state
    // To keep it simple, I'll just keep the sections array outside if possible or redefine it
    // Actually, I'll just use the sections content directly in the JSX for better state integration
    const sectionData = [
        {
            id: 'intro',
            title: 'Introduction',
            icon: <Book size={24} />,
            content: (
                <>
                    <p>Welcome to <strong>CodeSage</strong>, your intelligent AI-powered code reviewer. We help developers write better, cleaner, and more secure code by leveraging the power of Google's Gemini AI.</p>
                    <p>CodeSage analyzes your code for bugs, performance bottlenecks, security vulnerabilities, and stylistic inconsistencies, providing actionable feedback in seconds.</p>
                </>
            )
        },
        {
            id: 'api-key',
            title: 'Getting Your Gemini API Key',
            icon: <Key size={24} />,
            content: (
                <>
                    <p>To use CodeSage, you'll need a Google Gemini API Key. Follow these steps to get one for free:</p>
                    <ol>
                        <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.</li>
                        <li>Sign in with your Google Account.</li>
                        <li>Click on <strong>"Get API key"</strong> in the sidebar.</li>
                        <li>Click <strong>"Create API key"</strong> (select a project or create a new one).</li>
                        <li>Copy your key and paste it into the <strong>API</strong> modal in the CodeSage Navbar.</li>
                    </ol>
                    <div className="info-box">
                        <Shield size={18} />
                        <span>Your API key is stored locally in your browser and is never sent to our servers.</span>
                    </div>
                </>
            )
        },
        {
            id: 'features',
            title: 'Core Features',
            icon: <Sparkles size={24} />,
            content: (
                <div className="feature-grid">
                    <div className="feature-mini-card">
                        <Zap size={20} />
                        <h4>Instant Review</h4>
                        <p>Get feedback on your code in milliseconds using Gemini Flash models.</p>
                    </div>
                    <div className="feature-mini-card">
                        <Terminal size={20} />
                        <h4>Syntax Highlighting</h4>
                        <p>Built-in support for multiple languages with a sleek, themed editor.</p>
                    </div>
                    <div className="feature-mini-card">
                        <Shield size={20} />
                        <h4>Security Audit</h4>
                        <p>Automatically detects potential security risks and vulnerabilities.</p>
                    </div>
                    <div className="feature-mini-card">
                        <Globe size={20} />
                        <h4>Multi-Model Fallback</h4>
                        <p>Smartly rotates through different Gemini models if one is busy.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'languages',
            title: 'Supported Languages',
            icon: <Globe size={24} />,
            content: (
                <>
                    <p>CodeSage supports a wide range of popular programming languages:</p>
                    <div className="lang-tags">
                        {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'HTML', 'CSS'].map(lang => (
                            <span key={lang} className="lang-tag">{lang}</span>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'faq',
            title: 'FAQ',
            icon: <HelpCircle size={24} />,
            content: (
                <div className="faq-list">
                    <div className="faq-item">
                        <h4>Is it really free?</h4>
                        <p>Yes! By using your own Gemini API key (Free Tier), you can use CodeSage for free up to the limits provided by Google.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Why do I get a "Quota Exceeded" error?</h4>
                        <p>The Gemini API Free Tier has rate limits. If you hit this, simply wait about 60 seconds and try again. Our auto-fallback system tries to mitigate this by switching models.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Where is my code stored?</h4>
                        <p>Nowhere. Your code is processed in-memory for the review and is never saved to any database or external server by CodeSage.</p>
                    </div>
                </div>
            )
        }
    ];

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="docs-container">
            <aside className="docs-sidebar">
                <div className="sidebar-header">
                    <Book className="primary-icon" />
                    <span>Documentation</span>
                </div>
                <nav>
                    {sectionData.map(s => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className={`sidebar-link ${activeSection === s.id ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, s.id)}
                        >
                            {s.icon}
                            {s.title}
                        </a>
                    ))}
                </nav>
            </aside>

            <main className="docs-content">
                <header className="docs-hero">
                    <h1>CodeSage Documentation</h1>
                    <p>Everything you need to know about setting up and using CodeSage for intelligent code reviews.</p>
                </header>

                <div className="docs-sections">
                    {sectionData.map(section => (
                        <section
                            id={section.id}
                            key={section.id}
                            className={`doc-section ${activeSection === section.id ? 'focused' : ''}`}
                        >
                            <div className="section-header">
                                <span className="section-icon">{section.icon}</span>
                                <h2>{section.title}</h2>
                            </div>
                            <div className="section-body">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Documentation;
