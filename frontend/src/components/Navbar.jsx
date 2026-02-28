import React, { useState } from 'react';
import { Moon, Sun, Key, Cpu, X, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAIKey } from '../context/AIKeyContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { apiKey, saveApiKey } = useAIKey();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey);

    const handleSave = () => {
        saveApiKey(tempKey);
        setIsModalOpen(false);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
                <Cpu className="brand-icon" size={28} />
                <span className="brand-name">CodeSage</span>
            </Link>

            <div className="navbar-links">
                <Link to="/editor" className="nav-link">
                    <Code size={20} />
                    <span>Reviewer</span>
                </Link>
            </div>

            <div className="navbar-actions">
                <button
                    className="api-btn"
                    onClick={() => setIsModalOpen(true)}
                    title="Set API Key"
                >
                    <Key size={20} />
                    <span>API</span>
                </button>

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Enter Your AI API Key</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Your key is saved locally and will be used for AI responses.</p>
                            <input
                                type="password"
                                value={tempKey}
                                onChange={(e) => setTempKey(e.target.value)}
                                placeholder="Paste your API key here..."
                                autoFocus
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="save-btn" onClick={handleSave}>Save Key</button>
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Navbar;
