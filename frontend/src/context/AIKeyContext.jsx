import React, { createContext, useContext, useState, useEffect } from 'react';

const AIKeyContext = createContext();

export const AIKeyProvider = ({ children }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('ai_key') || '');

    const saveApiKey = (key) => {
        setApiKey(key);
        localStorage.setItem('ai_key', key);
    };

    return (
        <AIKeyContext.Provider value={{ apiKey, saveApiKey }}>
            {children}
        </AIKeyContext.Provider>
    );
};

export const useAIKey = () => useContext(AIKeyContext);
