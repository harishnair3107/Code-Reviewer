import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CodeEditor from '../pages/CodeEditor';
import Documentation from '../pages/Documentation';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<CodeEditor />} />
            <Route path="/docs" element={<Documentation />} />
        </Routes>
    );
};

export default AppRoutes;
