import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { X, User, Mail, ShieldCheck, ArrowRight, Lock, UserPlus } from 'lucide-react';
import { apiFetch, saveSession, clearSession } from '../lib/api.js';
export const AuthModal = ({ isOpen, onClose, currentUserEmail, onLogin, onLogout }) => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isOpen)
            return;
        setEmail(currentUserEmail || '');
        setPassword('');
        setError('');
        if (currentUserEmail)
            return;
        fetch('/api/health').catch(() => { });
    }, [isOpen, currentUserEmail]);
    useEffect(() => {
        if (!isOpen || currentUserEmail)
            return;
        apiFetch('/api/admins').then(async (r) => {
            if (r.ok) {
                const data = await r.json();
                if (data.success)
                    setAdmins(data.admins || []);
            }
        }).catch(() => { });
    }, [isOpen, currentUserEmail]);
    if (!isOpen)
        return null;
    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = mode === 'login' ? { email: email.trim(), password } : { name, email: email.trim(), password };
            const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok || !data.success)
                throw new Error(data.message || 'Authentication failed.');
            saveSession(data.token, data.user);
            onLogin(data.user);
            onClose();
        }
        catch (err) {
            setError(err.message || 'Unable to sign in.');
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        clearSession();
        onLogout();
        onClose();
    };
    return (_jsx("div", { id: "auth-modal-backdrop", className: "fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { id: "auth-modal", className: "bg-[#FAF8F5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#D5C6AC] relative", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 rounded-full bg-white text-[#2D2A26] hover:bg-black hover:text-white transition-all shadow-sm", children: _jsx(X, { className: "w-5 h-5" }) }), currentUserEmail ? (_jsxs("div", { className: "text-center py-5 space-y-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-[#EDE5D5] mx-auto flex items-center justify-center", children: _jsx(User, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-serif font-bold", children: "Signed In" }), _jsx("p", { className: "text-xs font-mono text-[#C28236] mt-1", children: currentUserEmail })] }), _jsx("button", { onClick: logout, className: "w-full py-3 rounded-xl bg-white border border-[#D5C6AC] text-red-600 font-semibold text-xs", children: "Sign Out" })] })) : (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-mono font-bold text-[#C28236] uppercase tracking-wider mb-1", children: [_jsx(User, { className: "w-3.5 h-3.5" }), " Account Portal"] }), _jsx("h3", { className: "text-2xl font-serif font-bold text-[#2D2A26]", children: mode === 'login' ? 'Sign In to BranPlate' : 'Create BranPlate Account' }), _jsx("p", { className: "text-xs text-[#7A6E5E] mt-1", children: "Use your email and password. Administrator access is verified on the server." })] }), admins.length > 0 && (_jsxs("div", { className: "p-3.5 rounded-2xl bg-[#2D2A26] text-white space-y-2", children: [_jsxs("div", { className: "flex items-center gap-1 text-xs text-[#E8C58C] font-semibold", children: [_jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-[#10B981]" }), " Administrator accounts"] }), admins.map(a => (_jsxs("div", { className: "rounded-xl bg-[#1C1A17] border border-[#443E38] px-3 py-2 text-xs flex justify-between", children: [_jsx("span", { children: a.name }), _jsx("span", { className: "text-[#E8C58C]", children: a.role?.replace('_', ' ') })] }, a.id || a._id)))] })), _jsxs("form", { onSubmit: submit, className: "space-y-3", children: [mode === 'register' && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Name" }), _jsx("input", { required: true, value: name, onChange: e => setName(e.target.value), className: "w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs" })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }), _jsx("input", { type: "email", required: true, value: email, onChange: e => setEmail(e.target.value), className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }), _jsx("input", { type: "password", minLength: 6, required: true, value: password, onChange: e => setPassword(e.target.value), className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs" })] })] }), error && _jsx("div", { className: "text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5", children: error }), _jsxs("button", { disabled: loading, className: "w-full py-3.5 rounded-xl bg-[#2D2A26] text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60", children: [loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account', " ", _jsx(ArrowRight, { className: "w-4 h-4 text-[#E8C58C]" })] })] }), _jsxs("button", { type: "button", onClick: () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }, className: "w-full text-xs font-semibold text-[#C28236] hover:underline flex items-center justify-center gap-1", children: [_jsx(UserPlus, { className: "w-3.5 h-3.5" }), " ", mode === 'login' ? 'Create a new customer account' : 'Already have an account? Sign in'] })] }))] }) }));
};
