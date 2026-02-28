import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CodeEditor from '../pages/CodeEditor';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<CodeEditor />} />
        </Routes>
    );
};

export default AppRoutes;
