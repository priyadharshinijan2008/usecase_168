// Nexus Resolution - Shared Utilities and Global Config
window.API_BASE = '/api';

// Protect React from DOM mutations by external libraries (such as Lucide replacing <i> elements)
(function() {
    if (typeof Node !== 'undefined' && Node.prototype) {
        const origRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function(child) {
            if (child && child.parentNode !== this) {
                return child;
            }
            return origRemoveChild.apply(this, arguments);
        };

        const origInsertBefore = Node.prototype.insertBefore;
        Node.prototype.insertBefore = function(newNode, referenceNode) {
            if (referenceNode && referenceNode.parentNode !== this) {
                return this.appendChild(newNode);
            }
            return origInsertBefore.apply(this, arguments);
        };
    }
})();

window.apiCall = async function(endpoint, options = {}) {
    try {
        const res = await fetch((window.API_BASE || '/api') + endpoint, {
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            ...options
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Request failed');
        }
        return await res.json();
    } catch (err) {
        console.warn("API error:", err.message);
        throw err;
    }
};

window.CHANNEL_META = {
    EMAIL: { label: 'Email Inbound', icon: 'mail', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    WEB_PORTAL: { label: 'Web Portal', icon: 'globe', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    PHONE: { label: 'Phone / Helpline', icon: 'phone-call', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    LIVE_CHAT: { label: 'Live Chat', icon: 'message-square', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    MOBILE_APP: { label: 'Mobile App', icon: 'smartphone', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    SOCIAL_MEDIA: { label: 'Social & WhatsApp', icon: 'share-2', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
    IN_PERSON: { label: 'Branch Desk', icon: 'map-pin', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' }
};

window.getChannel = function(ch) {
    return (window.CHANNEL_META && window.CHANNEL_META[ch]) || (window.CHANNEL_META && window.CHANNEL_META.WEB_PORTAL) || {
        label: ch || 'Portal',
        icon: 'globe',
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-200'
    };
};

window.formatINR = function(val) {
    if (!val) return '—';
    if (String(val).startsWith('₹')) return val;
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return val;
    return '₹' + num.toLocaleString('en-IN');
};
