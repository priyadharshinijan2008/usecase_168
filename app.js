// Nexus Resolution - Omnichannel Complaint Management & Service Quality Platform
const { useState, useEffect, useRef } = React;

const API_BASE = '/api';

async function apiCall(endpoint, options = {}) {
    try {
        const res = await fetch(API_BASE + endpoint, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
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
}

// Preset Quick-Login Users (Support Team & Customers)
const QUICK_USERS = [
    { id: 1, employeeId: 'HR-1001', role: 'HR', name: 'Priya', title: 'Chief Grievance Officer', dept: 'Customer Success & Ops' },
    { id: 2, employeeId: 'HR-1002', role: 'HR', name: 'Rajesh Narayanan', title: 'Senior Billing Lead', dept: 'Billing & Invoicing' },
    { id: 101, employeeId: 'EMP-2001', role: 'EMPLOYEE', name: 'Karthik Ramanathan', title: 'VP Infrastructure (TechNova)', dept: 'Enterprise VIP' },
    { id: 102, employeeId: 'EMP-2002', role: 'EMPLOYEE', name: 'Ananya Sundaram', title: 'Head of CX (Horizon)', dept: 'Corporate Client' },
    { id: 103, employeeId: 'EMP-2003', role: 'EMPLOYEE', name: 'Vignesh Bala', title: 'SRE Lead (CloudScale)', dept: 'Corporate Client' }
];

// Helper to get channel meta
const CHANNEL_META = {
    EMAIL: { label: 'Email Inbound', icon: 'mail', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    WEB_PORTAL: { label: 'Web Portal', icon: 'globe', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    PHONE: { label: 'Phone / Helpline', icon: 'phone-call', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    LIVE_CHAT: { label: 'Live Chat', icon: 'message-square', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    MOBILE_APP: { label: 'Mobile App', icon: 'smartphone', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    SOCIAL_MEDIA: { label: 'Social & WhatsApp', icon: 'share-2', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
    IN_PERSON: { label: 'Branch Desk', icon: 'map-pin', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' }
};

function getChannel(ch) {
    return CHANNEL_META[ch] || CHANNEL_META.WEB_PORTAL;
}

// Format currency
function formatINR(val) {
    if (!val) return '—';
    if (String(val).startsWith('₹')) return val;
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return val;
    return '₹' + num.toLocaleString('en-IN');
}

// ==========================================
// ROOT APP COMPONENT
// ==========================================
function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('nexus_auth_user');
            return saved ? JSON.parse(saved) : {
                id: 1,
                employeeId: 'HR-1001',
                fullName: 'Priya',
                role: 'HR',
                designation: 'Head of Operations & Chief Grievance Officer',
                email: 'priya@nexusres.com',
                departmentName: 'Customer Success & Operations',
                avatar: 'PR'
            };
        } catch {
            return null;
        }
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [channels, setChannels] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [channelFilter, setChannelFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modals
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [assignModalTicket, setAssignModalTicket] = useState(null);
    const [escalateModalTicket, setEscalateModalTicket] = useState(null);
    const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
    const [actionModalTicket, setActionModalTicket] = useState(null);
    const [adjustModalTicket, setAdjustModalTicket] = useState(null);
    const [compensationModalTicket, setCompensationModalTicket] = useState(null);
    const [downloadSlipTicket, setDownloadSlipTicket] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const loadData = async () => {
        try {
            const [st, list, ch, depts, usrs, fbs] = await Promise.all([
                apiCall('/dashboard/statistics'),
                apiCall('/complaints'),
                apiCall('/channels'),
                apiCall('/departments'),
                apiCall('/users'),
                apiCall('/feedback')
            ]);
            setStats(st);
            setComplaints(list || []);
            setChannels(ch || []);
            setDepartments(depts || []);
            setUsers(usrs || []);
            setFeedbacks(fbs || []);
        } catch (e) {
            console.error("Failed to load platform data", e);
        }
    };

    useEffect(() => {
        loadData();
        const timer = setInterval(loadData, 10000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
        }, 50);
        return () => clearTimeout(timeout);
    }, [activeTab, sidebarOpen, complaints, selectedTicket, assignModalTicket, escalateModalTicket, feedbackModalTicket, actionModalTicket, adjustModalTicket, compensationModalTicket, downloadSlipTicket]);

    const handleSwitchUser = (u) => {
        const fullUser = users.find(x => x.employeeId === u.employeeId) || {
            ...u,
            fullName: u.name,
            email: `${u.name.toLowerCase().replace(' ', '.')}@nexusres.com`,
            avatar: u.name.substring(0, 2).toUpperCase()
        };
        setCurrentUser(fullUser);
        try {
            localStorage.setItem('nexus_auth_user', JSON.stringify(fullUser));
        } catch {}
        showToast(`Switched active view to ${fullUser.fullName} (${fullUser.role === 'HR' ? 'Operations' : 'Customer'})`);
    };

    // Filtered complaints for search and channel
    const filteredComplaints = complaints.filter(c => {
        if (channelFilter !== 'ALL' && c.channel !== channelFilter) return false;
        if (statusFilter !== 'ALL') {
            if (statusFilter === 'ESCALATED' && !c.escalated && c.status !== 'ESCALATED') return false;
            if (statusFilter === 'BREACHED' && !c.slaBreached) return false;
            if (statusFilter !== 'ESCALATED' && statusFilter !== 'BREACHED' && c.status !== statusFilter) return false;
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                c.ticketNumber.toLowerCase().includes(q) ||
                (c.customerName && c.customerName.toLowerCase().includes(q)) ||
                (c.subject && c.subject.toLowerCase().includes(q)) ||
                (c.channel && c.channel.toLowerCase().includes(q)) ||
                (c.companyName && c.companyName.toLowerCase().includes(q))
            );
        }
        return true;
    });

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="Toggle Navigation Menu"
                    >
                        <i data-lucide="menu" className="w-5 h-5"></i>
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black shadow-xs">
                            <i data-lucide="layers" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm font-black text-slate-900 tracking-tight">NEXUS RESOLUTION</h1>
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    Omnichannel Platform
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 hidden sm:block">
                                Centralized Multi-Channel Complaint & SLA Management
                            </p>
                        </div>
                    </div>
                </div>

                {/* Central Channel Tracker Badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>7 Ingestion Channels Active</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-blue-700 font-bold">{stats ? `${stats.totalTickets} Complaints Tracked` : 'Live'}</span>
                </div>

                {/* Quick Persona Switcher & Current User */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                        <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Switch Persona:</span>
                        {QUICK_USERS.slice(0, 3).map(u => (
                            <button
                                key={u.id}
                                onClick={() => handleSwitchUser(u)}
                                className={`px-2.5 py-1 rounded-lg font-medium text-xs transition ${
                                    currentUser && currentUser.employeeId === u.employeeId
                                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                            >
                                {u.name.split(' ')[0]} ({u.role === 'HR' ? 'Ops' : 'Client'})
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {currentUser ? currentUser.fullName.substring(0, 2).toUpperCase() : 'OP'}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.fullName}</p>
                            <p className="text-[10px] text-slate-500">{currentUser?.role === 'HR' ? 'Operations Staff' : 'Customer Account'}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Application Container with Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Collapsible Left Navigation */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0 select-none z-20`}>
                    <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-1">
                        <NavButton
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                            icon="layout-dashboard"
                            label="Operations Dashboard"
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'inbox'}
                            onClick={() => setActiveTab('inbox')}
                            icon="inbox"
                            label="Omnichannel Inbox"
                            badge={complaints.length}
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'register'}
                            onClick={() => setActiveTab('register')}
                            icon="plus-circle"
                            label="Register Complaint"
                            highlight
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'sla'}
                            onClick={() => setActiveTab('sla')}
                            icon="clock"
                            label="SLA Monitor"
                            badge={stats?.slaBreachedTickets > 0 ? `${stats.slaBreachedTickets} Breached` : null}
                            badgeColor="rose"
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'escalations'}
                            onClick={() => setActiveTab('escalations')}
                            icon="alert-octagon"
                            label="Escalation Workflows"
                            badge={stats?.escalatedTickets}
                            badgeColor="amber"
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'feedback'}
                            onClick={() => setActiveTab('feedback')}
                            icon="star"
                            label="Customer Feedback (CSAT)"
                            badge={stats?.avgCsat ? `${stats.avgCsat} ★` : null}
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'channels'}
                            onClick={() => setActiveTab('channels')}
                            icon="radio"
                            label="Channel Matrix"
                            sidebarOpen={sidebarOpen}
                        />
                        <NavButton
                            active={activeTab === 'my-tickets'}
                            onClick={() => setActiveTab('my-tickets')}
                            icon="user-check"
                            label={currentUser?.role === 'HR' ? 'Assigned to Me' : 'My Filed Tickets'}
                            sidebarOpen={sidebarOpen}
                        />
                    </div>

                    {/* Sidebar Footer Live Status */}
                    {sidebarOpen && (
                        <div className="p-3 m-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">SLA Compliance</span>
                                <span className="font-bold text-emerald-700">{stats?.slaComplianceRate || 94}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${stats?.slaComplianceRate || 94}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-400">Target: 4h Critical • 24h High</p>
                        </div>
                    )}
                </aside>

                {/* Primary Content View Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                    {activeTab === 'dashboard' && (
                        <DashboardView
                            stats={stats}
                            complaints={complaints}
                            channels={channels}
                            onSelectTicket={setSelectedTicket}
                            onRegister={() => setActiveTab('register')}
                            onGoInbox={() => setActiveTab('inbox')}
                        />
                    )}

                    {activeTab === 'inbox' && (
                        <OmnichannelInboxView
                            complaints={filteredComplaints}
                            allComplaints={complaints}
                            channelFilter={channelFilter}
                            setChannelFilter={setChannelFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onSelectTicket={setSelectedTicket}
                            onAssignTicket={setAssignModalTicket}
                            onEscalateTicket={setEscalateModalTicket}
                            onFeedbackTicket={setFeedbackModalTicket}
                            onActionTicket={setActionModalTicket}
                            onAdjustTicket={setAdjustModalTicket}
                            onCompensateTicket={setCompensationModalTicket}
                            onDownloadSlip={setDownloadSlipTicket}
                        />
                    )}

                    {activeTab === 'register' && (
                        <RegisterComplaintView
                            departments={departments}
                            currentUser={currentUser}
                            onSuccess={(newTkt) => {
                                showToast(`Complaint ${newTkt.ticketNumber} successfully registered across centralized channels.`);
                                loadData();
                                setSelectedTicket(newTkt);
                                setActiveTab('inbox');
                            }}
                            onCancel={() => setActiveTab('inbox')}
                        />
                    )}

                    {activeTab === 'sla' && (
                        <SLAMonitorView
                            complaints={complaints}
                            stats={stats}
                            onSelectTicket={setSelectedTicket}
                            onEscalateTicket={setEscalateModalTicket}
                        />
                    )}

                    {activeTab === 'escalations' && (
                        <EscalationsView
                            complaints={complaints.filter(c => c.escalated || c.status === 'ESCALATED')}
                            onSelectTicket={setSelectedTicket}
                            onEscalateTicket={setEscalateModalTicket}
                            onActionTicket={setActionModalTicket}
                        />
                    )}

                    {activeTab === 'feedback' && (
                        <CustomerFeedbackView
                            feedbacks={feedbacks}
                            stats={stats}
                            complaints={complaints}
                            onSelectTicket={setSelectedTicket}
                            onOpenFeedbackModal={setFeedbackModalTicket}
                        />
                    )}

                    {activeTab === 'channels' && (
                        <ChannelMatrixView
                            channels={channels}
                            stats={stats}
                            onFilterChannel={(ch) => {
                                setChannelFilter(ch);
                                setActiveTab('inbox');
                            }}
                        />
                    )}

                    {activeTab === 'my-tickets' && (
                        <OmnichannelInboxView
                            complaints={complaints.filter(c => 
                                currentUser?.role === 'HR' 
                                    ? c.assignedAgentId === currentUser.id 
                                    : (c.employeeId === currentUser?.employeeId || c.customerId === currentUser?.customerId)
                            )}
                            allComplaints={complaints}
                            channelFilter={channelFilter}
                            setChannelFilter={setChannelFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onSelectTicket={setSelectedTicket}
                            onAssignTicket={setAssignModalTicket}
                            onEscalateTicket={setEscalateModalTicket}
                            onFeedbackTicket={setFeedbackModalTicket}
                            onActionTicket={setActionModalTicket}
                            onAdjustTicket={setAdjustModalTicket}
                            onCompensateTicket={setCompensationModalTicket}
                            onDownloadSlip={setDownloadSlipTicket}
                            customTitle={currentUser?.role === 'HR' ? 'Tickets Assigned to My Queue' : 'My Filed Complaints & Inquiries'}
                        />
                    )}
                </main>
            </div>

            {/* Modals */}
            {selectedTicket && (
                <TicketDetailModal
                    ticket={selectedTicket}
                    currentUser={currentUser}
                    onClose={() => setSelectedTicket(null)}
                    onAssign={setAssignModalTicket}
                    onEscalate={setEscalateModalTicket}
                    onFeedback={setFeedbackModalTicket}
                    onAction={setActionModalTicket}
                    onAdjust={setAdjustModalTicket}
                    onCompensate={setCompensationModalTicket}
                    onDownload={setDownloadSlipTicket}
                    onRefresh={() => {
                        loadData();
                        apiCall(`/complaints/${selectedTicket.id}`).then(res => {
                            if (res && res.ticket) setSelectedTicket(res.ticket);
                        });
                    }}
                    showToast={showToast}
                />
            )}

            {assignModalTicket && (
                <AssignTicketModal
                    ticket={assignModalTicket}
                    departments={departments}
                    users={users}
                    currentUser={currentUser}
                    onClose={() => setAssignModalTicket(null)}
                    onSuccess={(updated) => {
                        showToast(`Ticket ${updated.ticketNumber} assigned to ${updated.assignedAgentName}`);
                        setAssignModalTicket(null);
                        loadData();
                        if (selectedTicket && selectedTicket.id === updated.id) setSelectedTicket(updated);
                    }}
                    showToast={showToast}
                />
            )}

            {escalateModalTicket && (
                <EscalateTicketModal
                    ticket={escalateModalTicket}
                    currentUser={currentUser}
                    onClose={() => setEscalateModalTicket(null)}
                    onSuccess={(updated) => {
                        showToast(`Ticket ${updated.ticketNumber} escalated to ${updated.escalationTier}`, 'warning');
                        setEscalateModalTicket(null);
                        loadData();
                        if (selectedTicket && selectedTicket.id === updated.id) setSelectedTicket(updated);
                    }}
                    showToast={showToast}
                />
            )}

            {feedbackModalTicket && (
                <CustomerFeedbackModal
                    ticket={feedbackModalTicket}
                    currentUser={currentUser}
                    onClose={() => setFeedbackModalTicket(null)}
                    onSuccess={(fb) => {
                        showToast(`Customer feedback of ${fb.rating}★ recorded successfully!`);
                        setFeedbackModalTicket(null);
                        loadData();
                    }}
                    showToast={showToast}
                />
            )}

            {actionModalTicket && (
                <TakeActionModal
                    ticket={actionModalTicket}
                    currentUser={currentUser}
                    onClose={() => setActionModalTicket(null)}
                    onSuccess={(updated) => {
                        showToast(`Action recorded on ${updated.ticketNumber}`);
                        setActionModalTicket(null);
                        loadData();
                        if (selectedTicket && selectedTicket.id === updated.id) setSelectedTicket(updated);
                    }}
                    showToast={showToast}
                />
            )}

            {adjustModalTicket && (
                <AdjustCompensationModal
                    ticket={adjustModalTicket}
                    hrUser={currentUser}
                    onClose={() => setAdjustModalTicket(null)}
                    onSuccess={(updated) => {
                        showToast(`Amount for ${updated.ticketNumber} adjusted to ${updated.hrApprovedAmount}`);
                        setAdjustModalTicket(null);
                        loadData();
                        if (selectedTicket && selectedTicket.id === updated.id) setSelectedTicket(updated);
                    }}
                    onProceedToDisburse={(updated) => {
                        setAdjustModalTicket(null);
                        setCompensationModalTicket(updated);
                        loadData();
                    }}
                    showToast={showToast}
                />
            )}

            {compensationModalTicket && (
                <CompensationPaymentModal
                    ticket={compensationModalTicket}
                    hrUser={currentUser}
                    onClose={() => setCompensationModalTicket(null)}
                    onSuccess={(updated) => {
                        showToast(`Monetary compensation of ${updated.resolvedAmount} disbursed! Ticket RESOLVED.`);
                        setCompensationModalTicket(null);
                        loadData();
                        if (selectedTicket && selectedTicket.id === updated.id) setSelectedTicket(updated);
                    }}
                    showToast={showToast}
                />
            )}

            {downloadSlipTicket && (
                <DownloadSlipModal
                    ticket={downloadSlipTicket}
                    onClose={() => setDownloadSlipTicket(null)}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-bold transition transform animate-bounce ${
                    toast.type === 'error' ? 'bg-rose-900 text-white border-rose-800' :
                    toast.type === 'warning' ? 'bg-amber-900 text-white border-amber-800' :
                    'bg-slate-900 text-white border-slate-800'
                }`}>
                    <i data-lucide={toast.type === 'error' ? 'alert-circle' : toast.type === 'warning' ? 'alert-triangle' : 'check-circle-2'} className="w-4 h-4"></i>
                    <span>{toast.msg}</span>
                </div>
            )}
        </div>
    );
}

// ==========================================
// NAVIGATION BUTTON COMPONENT
// ==========================================
function NavButton({ active, onClick, icon, label, badge, badgeColor = 'blue', highlight, sidebarOpen }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition relative group ${
                active 
                    ? 'bg-blue-50 text-blue-800 border border-blue-200/60 shadow-xs' 
                    : highlight
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={label}
        >
            <i data-lucide={icon} className="w-4 h-4 shrink-0"></i>
            {sidebarOpen && <span className="truncate flex-1 text-left">{label}</span>}
            {sidebarOpen && badge && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    badgeColor === 'rose' ? 'bg-rose-100 text-rose-800' :
                    badgeColor === 'amber' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {badge}
                </span>
            )}
        </button>
    );
}

// ==========================================
// 1. DASHBOARD VIEW
// ==========================================
function DashboardView({ stats, complaints, channels, onSelectTicket, onRegister, onGoInbox }) {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Hero / Strategic Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="relative z-10 max-w-3xl space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                            Omnichannel Central Command
                        </span>
                        <span className="text-xs text-slate-300">| Unified Tracking Engine</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Centralized Customer Complaint Resolution Platform</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Eliminating multi-channel blind spots across Email, Web, Phone, Live Chat, Mobile App, and Social inquiries with automated ticket routing, SLA monitoring, escalation workflows, and customer feedback.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2.5">
                        <button
                            onClick={onRegister}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                        >
                            <i data-lucide="plus-circle" className="w-4 h-4"></i>
                            Register Inbound Complaint
                        </button>
                        <button
                            onClick={onGoInbox}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-1.5"
                        >
                            <i data-lucide="inbox" className="w-4 h-4"></i>
                            View Omnichannel Queue ({complaints.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Core KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <KPICard
                    title="Total Tracked"
                    value={stats?.totalTickets || 0}
                    sub="Across 7 channels"
                    icon="layers"
                    color="blue"
                />
                <KPICard
                    title="SLA Compliance"
                    value={`${stats?.slaComplianceRate || 94}%`}
                    sub="Target: >90%"
                    icon="shield-check"
                    color="emerald"
                />
                <KPICard
                    title="Active Escalations"
                    value={stats?.escalatedTickets || 0}
                    sub="Tier 2-4 Supervision"
                    icon="alert-octagon"
                    color="amber"
                />
                <KPICard
                    title="SLA Breached"
                    value={stats?.slaBreachedTickets || 0}
                    sub="Immediate Priority"
                    icon="clock"
                    color="rose"
                />
                <KPICard
                    title="Avg CSAT Score"
                    value={`${stats?.avgCsat || 4.8} / 5`}
                    sub="Customer Satisfaction"
                    icon="star"
                    color="indigo"
                />
                <KPICard
                    title="Net Promoter"
                    value={`+${stats?.npsScore || 75}`}
                    sub="NPS Index"
                    icon="trending-up"
                    color="purple"
                />
            </div>

            {/* Omnichannel Ingestion Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Multi-Channel Ingestion Distribution</h3>
                        <p className="text-xs text-slate-500">Centralized tracking of complaints arriving without silos</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">7 Connected Gateways</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {(stats?.channels || channels).map(ch => {
                        const meta = getChannel(ch.id);
                        return (
                            <div key={ch.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`w-8 h-8 rounded-lg ${meta.bg} ${meta.text} flex items-center justify-center`}>
                                        <i data-lucide={meta.icon} className="w-4 h-4"></i>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 font-mono">{ch.count || 0}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 truncate">{meta.label}</p>
                                    <p className="text-[10px] text-slate-500">{ch.percentage || 0}% of volume</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Live Queue & Escalation Alert Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Complaints requiring attention */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <i data-lucide="inbox" className="w-4 h-4 text-blue-700"></i>
                            <h3 className="text-sm font-bold text-slate-900">Active Omnichannel Queue</h3>
                        </div>
                        <button
                            onClick={onGoInbox}
                            className="text-xs font-bold text-blue-700 hover:text-blue-800"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {complaints.slice(0, 5).map(ticket => {
                            const meta = getChannel(ticket.channel);
                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => onSelectTicket(ticket)}
                                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl cursor-pointer transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-8 h-8 rounded-lg ${meta.bg} ${meta.text} flex items-center justify-center shrink-0`}>
                                            <i data-lucide={meta.icon} className="w-4 h-4"></i>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-900">{ticket.ticketNumber}</span>
                                                {ticket.escalated && (
                                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                                                        Escalated
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                                    ticket.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                                                    ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 truncate mt-0.5">{ticket.subject}</p>
                                            <p className="text-[10px] text-slate-400">{ticket.customerName} • {ticket.companyName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                                            ticket.status === 'ESCALATED' ? 'bg-amber-100 text-amber-800' :
                                            ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1">{ticket.assignedAgentName?.split(' ')[0]}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Escalation & SLA Risk Watch */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <i data-lucide="alert-octagon" className="w-4 h-4 text-amber-600"></i>
                            <h3 className="text-sm font-bold text-slate-900">Escalations & SLA Alerts</h3>
                        </div>
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                            {complaints.filter(c => c.slaBreached || c.escalated).length} Alerts
                        </span>
                    </div>

                    <div className="space-y-3">
                        {complaints.filter(c => c.slaBreached || c.escalated).slice(0, 4).map(t => (
                            <div
                                key={t.id}
                                onClick={() => onSelectTicket(t)}
                                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 cursor-pointer transition"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-900">{t.ticketNumber}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        t.slaBreached ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {t.slaBreached ? 'SLA BREACHED' : 'TIER ESCALATED'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-800 font-medium line-clamp-1">{t.subject}</p>
                                <p className="text-[10px] text-slate-500 mt-1">
                                    Assigned: {t.assignedAgentName} • {t.departmentName}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// KPI Card helper
function KPICard({ title, value, sub, icon, color }) {
    const colors = {
        blue: 'text-blue-700 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        amber: 'text-amber-700 bg-amber-50 border-amber-100',
        rose: 'text-rose-700 bg-rose-50 border-rose-100',
        indigo: 'text-indigo-700 bg-indigo-50 border-indigo-100',
        purple: 'text-purple-700 bg-purple-50 border-purple-100'
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{title}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <i data-lucide={icon} className="w-3.5 h-3.5"></i>
                </div>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
        </div>
    );
}

// Export App to window
window.App = App;
ReactDOM.render(<App />, document.getElementById('root'));
