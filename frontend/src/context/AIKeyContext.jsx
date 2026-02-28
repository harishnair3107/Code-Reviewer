import React, { createContext, useContext, useState, useEffect } from 'react';

const AIKeyContext = createContext();

export const AIKeyProvider = ({ children }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('ai_key') || '');

    const saveApiKey = (key) => {
        const trimmedKey = key.trim();
        setApiKey(trimmedKey);
        localStorage.setItem('ai_key', trimmedKey);
    };

    return (
        <AIKeyContext.Provider value={{ apiKey, saveApiKey }}>
            {children}
        </AIKeyContext.Provider>
    );
};

export const useAIKey = () => useContext(AIKeyContext);
