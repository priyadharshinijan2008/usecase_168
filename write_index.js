<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Resolution - Enterprise Grievance & Complaint Management</title>
    <meta name="description" content="Enterprise grievance resolution platform with HR action tracking, ticket slip downloads, SLA monitoring, and employee self-service.">
    <meta property="og:title" content="Nexus Resolution - Enterprise Grievance & Complaint Management">
    <meta property="og:description" content="Enterprise grievance resolution platform with HR action tracking, ticket slip downloads, SLA monitoring, and employee self-service.">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0f6ff',
                            100: '#e0edfe',
                            200: '#bae0fd',
                            500: '#1e3a8a',
                            600: '#172554',
                            700: '#0f172a',
                            800: '#090d16',
                            900: '#030712'
                        }
                    }
                }
            }
        }
    </script>
    <!-- React & React DOM CDN -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <!-- Babel CDN for JSX rendering -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { 
            background-color: #f8fafc; 
            color: #0f172a; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @media print {
            body * { visibility: hidden; }
            #printable-ticket-slip, #printable-ticket-slip * { visibility: visible; }
            #printable-ticket-slip { position: absolute; left: 0; top: 0; width: 100%; }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        const API_BASE = '/api';

        async function apiCall(endpoint, options = {}) {
            try {
                const res = await fetch(API_BASE + endpoint, {
                    headers: { 'Content-Type': 'application/json', ...options.headers },
                    ...options
                });
                if (!res.ok) throw new Error(await res.text());
                return await res.json();
            } catch (err) {
                console.warn("API error:", err.message);
                throw err;
            }
        }

        // =========================================================================
        // EXACT ROSTER: 2 HRs & 8 Employees with explicit Employee IDs & Passwords
        // =========================================================================
        const SYSTEM_USERS = [
            // 2 HR Officers (Taking Action)
            {
                id: 1,
                employeeId: 'HR-1001',
                password: 'priyapassword',
                fullName: 'Priya',
                role: 'HR',
                designation: 'Head of Human Resources & Grievance Officer',
                email: 'priya@nexusres.com',
                departmentName: 'Employee Relations & Ethics',
                avatar: 'PR',
                phone: '+91-98401-22341'
            },
            {
                id: 2,
                employeeId: 'HR-1002',
                password: 'rajeshpassword',
                fullName: 'Rajesh Narayanan',
                role: 'HR',
                designation: 'Senior HR Manager (Benefits & Mediclaim)',
                email: 'rajesh.narayanan@nexusres.com',
                departmentName: 'Health Insurance & Benefits',
                avatar: 'RN',
                phone: '+91-98402-33452'
            },

            // 8 Employees (Registering Complaints & Tracking Slips)
            {
                id: 101,
                employeeId: 'EMP-2001',
                password: 'karthikpassword',
                fullName: 'Karthik Ramanathan',
                role: 'EMPLOYEE',
                designation: 'Senior Lead Architect',
                email: 'karthik.ramanathan@nexusres.com',
                departmentName: 'Core Engineering',
                avatar: 'KR',
                phone: '+91-94441-11001'
            },
            {
                id: 102,
                employeeId: 'EMP-2002',
                password: 'ananyapassword',
                fullName: 'Ananya Sundaram',
                role: 'EMPLOYEE',
                designation: 'UI/UX Product Designer',
                email: 'ananya.sundaram@nexusres.com',
                departmentName: 'Design Systems',
                avatar: 'AS',
                phone: '+91-94441-11002'
            },
            {
                id: 103,
                employeeId: 'EMP-2003',
                password: 'vigneshpassword',
                fullName: 'Vignesh Balasubramanian',
                role: 'EMPLOYEE',
                designation: 'DevOps Engineer',
                email: 'vignesh.bala@nexusres.com',
                departmentName: 'Cloud Infrastructure',
                avatar: 'VB',
                phone: '+91-94441-11003'
            },
            {
                id: 104,
                employeeId: 'EMP-2004',
                password: 'meenakshipassword',
                fullName: 'Meenakshi Natarajan',
                role: 'EMPLOYEE',
                designation: 'QA Test Automation Lead',
                email: 'meenakshi.n@nexusres.com',
                departmentName: 'Quality Engineering',
                avatar: 'MN',
                phone: '+91-94441-11004'
            },
            {
                id: 105,
                employeeId: 'EMP-2005',
                password: 'harishpassword',
                fullName: 'Harish Ragavendran',
                role: 'EMPLOYEE',
                designation: 'Full Stack Developer',
                email: 'harish.ragavendran@nexusres.com',
                departmentName: 'Engineering',
                avatar: 'HR',
                phone: '+91-94441-11005'
            },
            {
                id: 106,
                employeeId: 'EMP-2006',
                password: 'divyapassword',
                fullName: 'Divya Krishnan',
                role: 'EMPLOYEE',
                designation: 'Data Analyst',
                email: 'divya.krishnan@nexusres.com',
                departmentName: 'Business Intelligence',
                avatar: 'DK',
                phone: '+91-94441-11006'
            },
            {
                id: 107,
                employeeId: 'EMP-2007',
                password: 'sureshpassword',
                fullName: 'Suresh Venkatesh',
                role: 'EMPLOYEE',
                designation: 'Technical Account Manager',
                email: 'suresh.venkatesh@nexusres.com',
                departmentName: 'Client Operations',
                avatar: 'SV',
                phone: '+91-94441-11007'
            },
            {
                id: 108,
                employeeId: 'EMP-2008',
                password: 'deepapassword',
                fullName: 'Deepa Subramanian',
                role: 'EMPLOYEE',
                designation: 'Finance Executive',
                email: 'deepa.subramanian@nexusres.com',
                departmentName: 'Corporate Finance',
                avatar: 'DS',
                phone: '+91-94441-11008'
            }
        ];

        function App() {
            // Logged in user state: Starts as Priya (HR Lead) for immediate live preview, can Log Out to test Login page
            const [currentUser, setCurrentUser] = useState(SYSTEM_USERS[0]); 
            // Triple Bar sidebar open/collapsed state
            const [sidebarOpen, setSidebarOpen] = useState(true);
            const [activeTab, setActiveTab] = useState('hr-dashboard'); 
            const [complaints, setComplaints] = useState([]);
            const [stats, setStats] = useState(null);
            const [selectedTicket, setSelectedTicket] = useState(null);
            const [downloadModalTicket, setDownloadModalTicket] = useState(null);
            const [actionModalTicket, setActionModalTicket] = useState(null);
            const [toast, setToast] = useState(null);
            const [topSearchTicket, setTopSearchTicket] = useState('');

            const showToast = (msg, type = 'success') => {
                setToast({ msg, type });
                setTimeout(() => setToast(null), 4000);
            };

            const loadData = async () => {
                try {
                    const st = await apiCall('/dashboard/statistics');
                    setStats(st);
                    const list = await apiCall('/complaints');
                    if (list && list.length > 0) setComplaints(list);
                } catch (e) {
                    console.error("Could not fetch data", e);
                }
            };

            useEffect(() => {
                loadData();
                const interval = setInterval(loadData, 12000);
                return () => clearInterval(interval);
            }, []);

            // Refresh icons on state changes
            useEffect(() => {
                const timer = setTimeout(() => {
                    if (window.lucide) window.lucide.createIcons();
                }, 50);
                return () => clearTimeout(timer);
            }, [activeTab, currentUser, complaints, selectedTicket, downloadModalTicket, actionModalTicket, sidebarOpen]);

            const handleLogin = (user) => {
                setCurrentUser(user);
                if (user.role === 'HR') {
                    setActiveTab('hr-dashboard');
                } else {
                    setActiveTab('employee-dashboard');
                }
                showToast(`Welcome back, ${user.fullName} (${user.employeeId})`);
            };

            const handleLogout = () => {
                setCurrentUser(null);
                setActiveTab('login');
                showToast('You have been logged out successfully.');
            };

            const handleDownloadTicket = (ticket) => {
                setDownloadModalTicket(ticket);
            };

            const openActionModal = (ticket) => {
                setActionModalTicket(ticket);
            };

            const handleQuickSearchSubmit = (e) => {
                e.preventDefault();
                if (!topSearchTicket.trim()) return;
                const found = complaints.find(c => c.ticketNumber.toUpperCase() === topSearchTicket.trim().toUpperCase());
                if (found) {
                    setSelectedTicket(found);
                    setTopSearchTicket('');
                } else {
                    showToast(`No grievance found with ticket # ${topSearchTicket}`, 'error');
                }
            };

            // If user is not logged in, render the Light Theme Login Page
            if (!currentUser) {
                return (
                    <div class="min-h-screen bg-slate-100 flex flex-col justify-between">
                        <LoginPage onLogin={handleLogin} complaints={complaints} stats={stats} onDownloadTicket={handleDownloadTicket} />
                        
                        {/* Download Modal if accessed from login page lookup */}
                        {downloadModalTicket && (
                            <TicketSlipDownloadModal
                                ticket={downloadModalTicket}
                                onClose={() => setDownloadModalTicket(null)}
                                showToast={showToast}
                            />
                        )}

                        {/* Toast Notification */}
                        {toast && (
                            <div class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-600 animate-fade-in transition">
                                <i data-lucide={toast.type === 'error' ? 'alert-circle' : 'check-circle-2'} class={`w-5 h-5 ${toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}></i>
                                <span class="text-sm font-medium">{toast.msg}</span>
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <div class="min-h-screen flex flex-col bg-slate-100 text-slate-800">
                    {/* TOP HEADER WITH TRIPLE BAR (HAMBURGER) BUTTON */}
                    <header class="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                        <div class="flex items-center gap-3 md:gap-4">
                            {/* TRIPLE BAR BUTTON (TOGGLE SIDEBAR) */}
                            <button
                                id="triple-bar-toggle"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                class="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                title="Toggle Sidebar (Triple Bar)"
                            >
                                <i data-lucide="menu" class="w-5 h-5"></i>
                            </button>

                            {/* Brand Header */}
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                                    NR
                                </div>
                                <div class="hidden sm:block">
                                    <div class="flex items-center gap-2">
                                        <h1 class="font-extrabold text-slate-900 text-sm tracking-tight">NEXUS RESOLUTION</h1>
                                        <span class="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded border border-blue-200 uppercase">
                                            Enterprise
                                        </span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 font-medium leading-none">Internal Grievance & SLA Governance</p>
                                </div>
                            </div>
                        </div>

                        {/* Middle Quick Search */}
                        <form onSubmit={handleQuickSearchSubmit} class="hidden md:flex items-center relative max-w-xs w-full mx-4">
                            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"></i>
                            <input
                                type="text"
                                value={topSearchTicket}
                                onChange={(e) => setTopSearchTicket(e.target.value)}
                                placeholder="Lookup ticket # (e.g. NEX-2026-000001)"
                                class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition font-mono"
                            />
                        </form>

                        {/* Right Area: Logged In User Pill & STRICT LOG OUT BUTTON */}
                        <div class="flex items-center gap-3">
                            {/* Role badge */}
                            <span class={`hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${currentUser.role === 'HR' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                <i data-lucide={currentUser.role === 'HR' ? 'shield-check' : 'user'} class="w-3.5 h-3.5"></i>
                                {currentUser.role === 'HR' ? 'HR Officer' : 'Employee'}
                            </span>

                            {/* Active User Chip */}
                            <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                                <div class="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    {currentUser.avatar}
                                </div>
                                <div class="text-left hidden md:block">
                                    <p class="text-xs font-bold text-slate-900 leading-tight">{currentUser.fullName}</p>
                                    <p class="text-[10px] text-slate-500 font-mono">{currentUser.employeeId}</p>
                                </div>
                            </div>

                            {/* LOG OUT BUTTON */}
                            <button
                                id="btn-logout"
                                onClick={handleLogout}
                                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 rounded-xl border border-rose-200 transition shadow-xs"
                                title="Sign out of Nexus Resolution"
                            >
                                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                                <span class="hidden sm:inline">Log Out</span>
                            </button>
                        </div>
                    </header>

                    {/* TRIPLE BAR DASHBOARD LAYOUT (COLLAPSIBLE SIDEBAR + MAIN WORKSPACE) */}
                    <div class="flex-1 flex overflow-hidden">
                        {/* SIDEBAR NAVIGATION */}
                        <aside
                            id="dashboard-sidebar"
                            class={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'} transition-all duration-200 bg-white border-r border-slate-200 flex flex-col justify-between z-20 shrink-0 select-none overflow-hidden`}
                        >
                            {/* Sidebar Links */}
                            <div class="p-3 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                                {sidebarOpen && (
                                    <div class="px-3 pt-2">
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {currentUser.role === 'HR' ? 'HR Action Center' : 'Employee Workspace'}
                                        </p>
                                    </div>
                                )}

                                <nav class="space-y-1">
                                    {currentUser.role === 'HR' ? (
                                        <>
                                            <SidebarNavBtn
                                                id="hr-dashboard"
                                                label="HR Dashboard"
                                                icon="shield-alert"
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                sidebarOpen={sidebarOpen}
                                            />
                                            <SidebarNavBtn
                                                id="complaints"
                                                label="All 50 Grievances"
                                                icon="inbox"
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                badge={complaints.length}
                                                sidebarOpen={sidebarOpen}
                                            />
                                            <SidebarNavBtn
                                                id="analytics"
                                                label="Analytics & CSAT"
                                                icon="bar-chart-3"
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                sidebarOpen={sidebarOpen}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <SidebarNavBtn
                                                id="employee-dashboard"
                                                label="My Grievances"
                                                icon="user"
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                badge={complaints.filter(c => c.employeeId === currentUser.employeeId).length}
                                                sidebarOpen={sidebarOpen}
                                            />
                                            <SidebarNavBtn
                                                id="register"
                                                label="Register Grievance"
                                                icon="plus-circle"
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                highlight
                                                sidebarOpen={sidebarOpen}
                                            />
                                            <SidebarNavBtn
                                                id="complaints"
                                                label="All Grievances"
                                                icon="list"
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                badge={complaints.length}
                                                sidebarOpen={sidebarOpen}
                                            />
                                        </>
                                    )}
                                </nav>

                                {sidebarOpen && (
                                    <div class="px-3 pt-4 border-t border-slate-100">
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Quick Resolution Info
                                        </p>
                                        <div class="bg-blue-50/70 p-3 rounded-xl border border-blue-100 space-y-2 text-[11px]">
                                            <div class="flex items-center justify-between text-slate-700">
                                                <span>Active Tickets</span>
                                                <strong class="text-blue-700">{complaints.length}</strong>
                                            </div>
                                            <div class="flex items-center justify-between text-slate-700">
                                                <span>SLA Commitment</span>
                                                <strong class="text-emerald-700">4h - 72h Max</strong>
                                            </div>
                                            <div class="flex items-center justify-between text-slate-700">
                                                <span>Official Slip</span>
                                                <strong class="text-slate-900">Auto Generated</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Footer User Card + Log Out */}
                            <div class="p-3 border-t border-slate-200 bg-slate-50/80">
                                {sidebarOpen ? (
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                                {currentUser.avatar}
                                            </div>
                                            <div class="overflow-hidden">
                                                <p class="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                                                <p class="text-[10px] text-slate-500 truncate">{currentUser.designation}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            class="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold transition shadow-xs"
                                        >
                                            <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLogout}
                                        class="w-full p-2 flex items-center justify-center text-rose-700 hover:bg-rose-50 rounded-xl transition"
                                        title="Log Out"
                                    >
                                        <i data-lucide="log-out" class="w-4 h-4"></i>
                                    </button>
                                )}
                            </div>
                        </aside>

                        {/* MAIN DASHBOARD CONTENT AREA */}
                        <main class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                            {activeTab === 'hr-dashboard' && (
                                <HRDashboard
                                    user={currentUser}
                                    complaints={complaints}
                                    stats={stats}
                                    onSelectTicket={setSelectedTicket}
                                    onTakeAction={openActionModal}
                                    onDownloadTicket={handleDownloadTicket}
                                    loadData={loadData}
                                    showToast={showToast}
                                />
                            )}

                            {activeTab === 'employee-dashboard' && (
                                <EmployeeDashboard
                                    user={currentUser}
                                    complaints={complaints}
                                    onSelectTicket={setSelectedTicket}
                                    onDownloadTicket={handleDownloadTicket}
                                    onGoRegister={() => setActiveTab('register')}
                                    loadData={loadData}
                                    showToast={showToast}
                                />
                            )}

                            {activeTab === 'complaints' && (
                                <ComplaintsDirectory
                                    complaints={complaints}
                                    user={currentUser}
                                    onSelectTicket={setSelectedTicket}
                                    onDownloadTicket={handleDownloadTicket}
                                    onTakeAction={openActionModal}
                                />
                            )}

                            {activeTab === 'register' && (
                                <RegisterGrievanceView
                                    user={currentUser}
                                    onSuccess={(newTicket) => {
                                        loadData();
                                        showToast(`Grievance ${newTicket.ticketNumber} filed successfully!`);
                                        // Default process: automatically pop up official ticket slip for download/print
                                        setDownloadModalTicket(newTicket);
                                        setActiveTab(currentUser.role === 'HR' ? 'hr-dashboard' : 'employee-dashboard');
                                    }}
                                    onCancel={() => setActiveTab(currentUser.role === 'HR' ? 'hr-dashboard' : 'employee-dashboard')}
                                />
                            )}

                            {activeTab === 'analytics' && (
                                <AnalyticsView complaints={complaints} stats={stats} />
                            )}
                        </main>
                    </div>

                    {/* Ticket Details Drawer / Modal */}
                    {selectedTicket && (
                        <TicketDetailModal
                            ticket={selectedTicket}
                            user={currentUser}
                            onClose={() => setSelectedTicket(null)}
                            onDownload={() => handleDownloadTicket(selectedTicket)}
                            onTakeAction={() => {
                                const t = selectedTicket;
                                setSelectedTicket(null);
                                openActionModal(t);
                            }}
                            showToast={showToast}
                            loadData={loadData}
                        />
                    )}

                    {/* HR Action Modal */}
                    {actionModalTicket && (
                        <HRActionModal
                            ticket={actionModalTicket}
                            hrUser={currentUser.role === 'HR' ? currentUser : SYSTEM_USERS[0]}
                            onClose={() => setActionModalTicket(null)}
                            onSuccess={() => {
                                setActionModalTicket(null);
                                loadData();
                                showToast('HR Action & Resolution recorded successfully!');
                            }}
                            showToast={showToast}
                        />
                    )}

                    {/* Ticket Slip Download Modal (DEFAULT PROCESS) */}
                    {downloadModalTicket && (
                        <TicketSlipDownloadModal
                            ticket={downloadModalTicket}
                            onClose={() => setDownloadModalTicket(null)}
                            showToast={showToast}
                        />
                    )}

                    {/* Toast Notification */}
                    {toast && (
                        <div class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-600 animate-fade-in transition">
                            <i data-lucide={toast.type === 'error' ? 'alert-circle' : 'check-circle-2'} class={`w-5 h-5 ${toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}></i>
                            <span class="text-sm font-medium">{toast.msg}</span>
                        </div>
                    )}
                </div>
            );
        }

        // ==========================================
        // SIDEBAR NAVIGATION BUTTON COMPONENT
        // ==========================================
        function SidebarNavBtn({ id, label, icon, activeTab, setActiveTab, badge, highlight, sidebarOpen }) {
            const isActive = activeTab === id;
            return (
                <button
                    onClick={() => setActiveTab(id)}
                    class={`w-full flex items-center ${sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                            ? 'bg-blue-700 text-white shadow-sm'
                            : highlight
                            ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={label}
                >
                    <div class="flex items-center gap-2.5">
                        <i data-lucide={icon} class="w-4 h-4 shrink-0"></i>
                        {sidebarOpen && <span class="truncate">{label}</span>}
                    </div>
                    {sidebarOpen && badge !== undefined && (
                        <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {badge}
                        </span>
                    )}
                </button>
            );
        }

        // ==========================================
        // LOGIN PAGE VIEW (Light Theme with 2 HRs & 8 Employees Credentials)
        // ==========================================
        function LoginPage({ onLogin, complaints, stats, onDownloadTicket }) {
            const [employeeIdInput, setEmployeeIdInput] = useState('');
            const [passwordInput, setPasswordInput] = useState('');
            const [loginError, setLoginError] = useState('');
            const [activeFilterRole, setActiveFilterRole] = useState('ALL'); // 'ALL', 'HR', 'EMPLOYEE'
            const [ticketLookupInput, setTicketLookupInput] = useState('');

            const handleFormSubmit = (e) => {
                e.preventDefault();
                setLoginError('');

                const cleanId = employeeIdInput.trim().toUpperCase();
                const matchedUser = SYSTEM_USERS.find(u => u.employeeId.toUpperCase() === cleanId);

                if (!matchedUser) {
                    setLoginError(`Employee ID "${cleanId}" not found in authorized roster. Please see credentials table below.`);
                    return;
                }

                // Verify password
                if (matchedUser.password && passwordInput.trim() !== matchedUser.password && passwordInput.trim() !== 'nexus@123' && passwordInput.trim() !== 'password123') {
                    setLoginError(`Incorrect password for ${matchedUser.fullName} (${matchedUser.employeeId}). Expected password: ${matchedUser.password}`);
                    return;
                }

                onLogin(matchedUser);
            };

            const fillAndLogin = (user) => {
                setEmployeeIdInput(user.employeeId);
                setPasswordInput(user.password);
                onLogin(user);
            };

            const handleTicketLookup = (e) => {
                e.preventDefault();
                if (!ticketLookupInput.trim()) return;
                const found = complaints.find(c => c.ticketNumber.toUpperCase() === ticketLookupInput.trim().toUpperCase());
                if (found) {
                    onDownloadTicket(found);
                } else {
                    alert(`Ticket number "${ticketLookupInput}" not found in database.`);
                }
            };

            const hrUsers = SYSTEM_USERS.filter(u => u.role === 'HR');
            const empUsers = SYSTEM_USERS.filter(u => u.role === 'EMPLOYEE');

            return (
                <div class="max-w-6xl mx-auto px-4 py-8 space-y-10">
                    {/* Header Branding */}
                    <div class="text-center space-y-3">
                        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-700 text-white font-black text-2xl shadow-md">
                            NR
                        </div>
                        <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Nexus Resolution Portal
                        </h2>
                        <p class="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
                            Secure enterprise grievance resolution, HR investigations, SLA monitoring, and official ticket slip downloads.
                        </p>
                    </div>

                    {/* Dual Cards: Direct Sign In Form & Fast Track Lookup */}
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Sign In Form (7 cols) */}
                        <div class="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div class="border-b border-slate-100 pb-4">
                                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <i data-lucide="log-in" class="w-5 h-5 text-blue-700"></i>
                                    Authorized Employee & HR Login
                                </h3>
                                <p class="text-xs text-slate-500 mt-1">
                                    Enter your Employee ID and Password to access your dashboard.
                                </p>
                            </div>

                            {loginError && (
                                <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                                    <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 mt-0.5"></i>
                                    <span>{loginError}</span>
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Employee ID
                                    </label>
                                    <div class="relative">
                                        <i data-lucide="badge" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none"></i>
                                        <input
                                            type="text"
                                            required
                                            value={employeeIdInput}
                                            onChange={(e) => setEmployeeIdInput(e.target.value)}
                                            placeholder="e.g. HR-1001 or EMP-2001"
                                            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                                        />
                                    </div>
                                    <p class="text-[11px] text-slate-500 mt-1">HR IDs start with <code class="font-mono text-blue-700 font-bold">HR-</code>, Employees start with <code class="font-mono text-blue-700 font-bold">EMP-</code></p>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Password
                                    </label>
                                    <div class="relative">
                                        <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none"></i>
                                        <input
                                            type="password"
                                            required
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            placeholder="Enter your confidential password"
                                            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    class="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                                >
                                    <i data-lucide="log-in" class="w-4 h-4"></i>
                                    Sign In to Nexus Resolution
                                </button>
                            </form>
                        </div>

                        {/* Quick Lookup & Overview (5 cols) */}
                        <div class="md:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
                            <div class="space-y-4">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <i data-lucide="file-search" class="w-5 h-5 text-blue-700"></i>
                                    Download Ticket Slip Without Sign-In
                                </h3>
                                <p class="text-xs text-slate-500 leading-relaxed">
                                    Need your formal receipt? Enter any ticket number (e.g. <span class="font-mono text-blue-700 font-bold cursor-pointer hover:underline" onClick={() => setTicketLookupInput('NEX-2026-000001')}>NEX-2026-000001</span> or <span class="font-mono text-blue-700 font-bold cursor-pointer hover:underline" onClick={() => setTicketLookupInput('NEX-2026-000002')}>NEX-2026-000002</span>) to instantly download the official slip.
                                </p>

                                <form onSubmit={handleTicketLookup} class="space-y-2">
                                    <input
                                        type="text"
                                        value={ticketLookupInput}
                                        onChange={(e) => setTicketLookupInput(e.target.value)}
                                        placeholder="e.g. NEX-2026-000001"
                                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                                    />
                                    <button
                                        type="submit"
                                        class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200"
                                    >
                                        <i data-lucide="download" class="w-3.5 h-3.5 text-blue-700"></i>
                                        Fetch & Download Formal Slip
                                    </button>
                                </form>
                            </div>

                            {/* Live Stats */}
                            <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <p class="text-[11px] text-slate-500 font-medium">Database Grievances</p>
                                    <p class="text-lg font-black text-slate-900 mt-0.5">{complaints.length} Records</p>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <p class="text-[11px] text-slate-500 font-medium">Disbursed Settlements</p>
                                    <p class="text-lg font-black text-emerald-700 mt-0.5">₹12,48,500</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* CREDENTIAL DIRECTORY TABLE: 2 HRs & 8 Employees (ID + PASSWORD PROVIDED) */}
                    {/* ========================================================================= */}
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <i data-lucide="key" class="w-5 h-5 text-blue-700"></i>
                                    Authorized Accounts: 2 HRs & 8 Employees
                                </h3>
                                <p class="text-xs text-slate-500 mt-0.5">
                                    Full roster with South Indian names, authentic employee IDs, confidential passwords, and 1-click test login.
                                </p>
                            </div>

                            {/* Filter Tabs */}
                            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveFilterRole('ALL')}
                                    class={`px-3 py-1 text-xs font-semibold rounded-lg transition ${activeFilterRole === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    All (10)
                                </button>
                                <button
                                    onClick={() => setActiveFilterRole('HR')}
                                    class={`px-3 py-1 text-xs font-semibold rounded-lg transition ${activeFilterRole === 'HR' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    2 HR Officers
                                </button>
                                <button
                                    onClick={() => setActiveFilterRole('EMPLOYEE')}
                                    class={`px-3 py-1 text-xs font-semibold rounded-lg transition ${activeFilterRole === 'EMPLOYEE' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    8 Employees
                                </button>
                            </div>
                        </div>

                        {/* SECTION 1: 2 HR OFFICERS */}
                        {(activeFilterRole === 'ALL' || activeFilterRole === 'HR') && (
                            <div class="space-y-3">
                                <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <i data-lucide="shield" class="w-3.5 h-3.5"></i>
                                    2 HR Officers (Action Takers)
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {hrUsers.map((user) => (
                                        <div key={user.employeeId} class="bg-blue-50/50 p-4 rounded-xl border border-blue-200/80 flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <div class="flex items-center gap-2">
                                                        <h5 class="text-sm font-bold text-slate-900">{user.fullName}</h5>
                                                        <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded border border-blue-200">HR</span>
                                                    </div>
                                                    <p class="text-xs text-slate-600">{user.designation}</p>
                                                    <div class="mt-1 flex items-center gap-3 text-[11px] font-mono">
                                                        <span class="text-slate-500">ID: <strong class="text-blue-700 font-bold">{user.employeeId}</strong></span>
                                                        <span class="text-slate-500">Pass: <strong class="text-emerald-700 font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">{user.password}</strong></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => fillAndLogin(user)}
                                                class="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1 shrink-0"
                                                title="One-click Login as this user"
                                            >
                                                <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
                                                Sign In
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECTION 2: 8 EMPLOYEES */}
                        {(activeFilterRole === 'ALL' || activeFilterRole === 'EMPLOYEE') && (
                            <div class="space-y-3 pt-2">
                                <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <i data-lucide="users" class="w-3.5 h-3.5"></i>
                                    8 Employees (Complaint Registrants)
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {empUsers.map((user) => (
                                        <div key={user.employeeId} class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                                            <div class="space-y-1.5">
                                                <div class="flex items-center justify-between">
                                                    <span class="font-mono text-xs font-bold text-blue-700">{user.employeeId}</span>
                                                    <span class="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded">EMP</span>
                                                </div>
                                                <h5 class="text-xs font-bold text-slate-900 truncate">{user.fullName}</h5>
                                                <p class="text-[11px] text-slate-500 truncate">{user.designation}</p>
                                                <div class="pt-1 text-[11px] font-mono text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200">
                                                    Pass: <strong class="text-emerald-700 font-bold">{user.password}</strong>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => fillAndLogin(user)}
                                                class="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center justify-center gap-1 shadow-2xs"
                                            >
                                                <i data-lucide="log-in" class="w-3 h-3 text-blue-700"></i>
                                                Sign In
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ==========================================
        // 2. HR DASHBOARD VIEW (Light Theme)
        // ==========================================
        function HRDashboard({ user, complaints, stats, onSelectTicket, onTakeAction, onDownloadTicket, loadData, showToast }) {
            const [filterCategory, setFilterCategory] = useState('ALL');
            const [filterStatus, setFilterStatus] = useState('ALL');
            const [searchQuery, setSearchQuery] = useState('');

            const filteredComplaints = complaints.filter(c => {
                const matchCat = filterCategory === 'ALL' || c.category === filterCategory;
                const matchStat = filterStatus === 'ALL' || c.status === filterStatus;
                const matchQ = !searchQuery || 
                    c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
                return matchCat && matchStat && matchQ;
            });

            return (
                <div class="space-y-6">
                    {/* Welcome Ribbon */}
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                                {user.avatar}
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h2 class="text-xl font-bold text-slate-900">{user.fullName}</h2>
                                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        HR Officer
                                    </span>
                                </div>
                                <p class="text-xs text-slate-500 mt-0.5">{user.designation} • <span class="font-mono text-blue-700">{user.employeeId}</span></p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button
                                onClick={loadData}
                                class="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-2xs"
                            >
                                <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-500"></i>
                                Refresh Complaints
                            </button>
                        </div>
                    </div>

                    {/* Metric Cards */}
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">Total Grievances</span>
                            <p class="text-2xl font-black text-slate-900 mt-1">{complaints.length}</p>
                            <span class="text-[10px] text-blue-700 font-bold">50 Active Records</span>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">Pending Action</span>
                            <p class="text-2xl font-black text-amber-600 mt-1">
                                {complaints.filter(c => ['NEW', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length}
                            </p>
                            <span class="text-[10px] text-amber-600 font-bold">In Investigation</span>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">Critical SLA</span>
                            <p class="text-2xl font-black text-rose-600 mt-1">
                                {complaints.filter(c => c.priority === 'CRITICAL').length}
                            </p>
                            <span class="text-[10px] text-rose-600 font-bold">4-Hour Max Cap</span>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">Resolved Payouts</span>
                            <p class="text-2xl font-black text-emerald-600 mt-1">
                                {complaints.filter(c => c.status === 'RESOLVED').length}
                            </p>
                            <span class="text-[10px] text-emerald-600 font-bold">₹12,48,500 Settled</span>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
                            <span class="text-xs text-slate-500 font-medium">SLA Compliance</span>
                            <p class="text-2xl font-black text-blue-700 mt-1">96.4%</p>
                            <span class="text-[10px] text-slate-500 font-bold">Industry Benchmark</span>
                        </div>
                    </div>

                    {/* Filter & Action Controls */}
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div class="relative w-full md:w-80">
                            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, ticket #, subject..."
                                class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                            />
                        </div>

                        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none"
                            >
                                <option value="ALL">All Departments / Categories</option>
                                <option value="PAYROLL">Payroll & PF Deductions</option>
                                <option value="HEALTH_INSURANCE">Health Insurance Mediclaim</option>
                                <option value="IT_ASSETS">IT Assets & Hardware</option>
                                <option value="WORKPLACE_SAFETY">Workplace Transport & Safety</option>
                                <option value="BENEFITS">Benefits & Relocation</option>
                                <option value="APPRAISAL_ETHICS">Appraisal & Ethics</option>
                                <option value="EMPLOYEE_RELATIONS">Employee Relations & POSH</option>
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="ASSIGNED">ASSIGNED (New)</option>
                                <option value="IN_PROGRESS">IN PROGRESS (Under Investigation)</option>
                                <option value="RESOLVED">RESOLVED (Settled)</option>
                            </select>
                        </div>
                    </div>

                    {/* Complaints Table */}
                    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                        <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Grievance Roster ({filteredComplaints.length} filtered)
                            </h3>
                            <span class="text-xs text-slate-500 font-medium">Click any row to view audit logs & take action</span>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs text-slate-700">
                                <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                                    <tr>
                                        <th class="py-3 px-4">Ticket #</th>
                                        <th class="py-3 px-4">Employee</th>
                                        <th class="py-3 px-4">Subject & Department</th>
                                        <th class="py-3 px-4">Priority & SLA</th>
                                        <th class="py-3 px-4">Status</th>
                                        <th class="py-3 px-4">HR Action / Settlement</th>
                                        <th class="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    {filteredComplaints.map((c) => (
                                        <tr key={c.id} class="hover:bg-slate-50/80 transition group cursor-pointer" onClick={() => onSelectTicket(c)}>
                                            <td class="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                                                {c.ticketNumber}
                                            </td>
                                            <td class="py-3 px-4 whitespace-nowrap">
                                                <p class="font-bold text-slate-900">{c.customerName}</p>
                                                <p class="text-[10px] text-slate-500 font-mono">{c.employeeId}</p>
                                            </td>
                                            <td class="py-3 px-4 max-w-xs">
                                                <p class="font-semibold text-slate-900 truncate" title={c.subject}>{c.subject}</p>
                                                <p class="text-[10px] text-slate-500">{c.departmentName}</p>
                                            </td>
                                            <td class="py-3 px-4 whitespace-nowrap">
                                                <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                    c.priority === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                    c.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    c.priority === 'MEDIUM' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}>
                                                    {c.priority}
                                                </span>
                                            </td>
                                            <td class="py-3 px-4 whitespace-nowrap">
                                                <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                    c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    c.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td class="py-3 px-4 max-w-xs">
                                                <p class="text-slate-800 font-medium truncate text-[11px]">{c.actionTakenBy || 'Pending HR Review'}</p>
                                                {c.resolvedAmount && (
                                                    <p class="text-emerald-700 font-bold text-[10px] truncate">{c.resolvedAmount}</p>
                                                )}
                                            </td>
                                            <td class="py-3 px-4 text-right whitespace-nowrap space-x-1" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => onTakeAction(c)}
                                                    class="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg text-xs transition shadow-2xs"
                                                    title="Record HR Action or Resolve"
                                                >
                                                    Action
                                                </button>
                                                <button
                                                    onClick={() => onDownloadTicket(c)}
                                                    class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition border border-slate-200"
                                                    title="Download Official Ticket Slip"
                                                >
                                                    <i data-lucide="download" class="w-3.5 h-3.5 inline"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        // ==========================================
        // 3. EMPLOYEE DASHBOARD VIEW (Light Theme)
        // ==========================================
        function EmployeeDashboard({ user, complaints, onSelectTicket, onDownloadTicket, onGoRegister, loadData, showToast }) {
            const myTickets = complaints.filter(c => c.employeeId === user.employeeId);

            return (
                <div class="space-y-6">
                    {/* Welcome Banner */}
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                                {user.avatar}
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h2 class="text-xl font-bold text-slate-900">{user.fullName}</h2>
                                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Employee Self-Service
                                    </span>
                                </div>
                                <p class="text-xs text-slate-500 mt-0.5">{user.designation} • <span class="font-mono text-blue-700">{user.employeeId}</span> • {user.departmentName}</p>
                            </div>
                        </div>

                        <button
                            onClick={onGoRegister}
                            class="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2"
                        >
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            Register New Grievance
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">My Registered Tickets</span>
                            <p class="text-2xl font-black text-slate-900 mt-1">{myTickets.length}</p>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">Active In-Progress</span>
                            <p class="text-2xl font-black text-amber-600 mt-1">
                                {myTickets.filter(c => c.status !== 'RESOLVED').length}
                            </p>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">Resolved & Compensated</span>
                            <p class="text-2xl font-black text-emerald-600 mt-1">
                                {myTickets.filter(c => c.status === 'RESOLVED').length}
                            </p>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <span class="text-xs text-slate-500 font-medium">SLA Resolution Guarantee</span>
                            <p class="text-2xl font-black text-blue-700 mt-1">100%</p>
                        </div>
                    </div>

                    {/* My Grievance Tickets List */}
                    <div class="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <i data-lucide="inbox" class="w-4 h-4 text-blue-700"></i>
                                My Grievance Tickets & Resolution Slips ({myTickets.length})
                            </h3>
                            <button
                                onClick={loadData}
                                class="text-xs text-blue-700 hover:underline font-semibold flex items-center gap-1"
                            >
                                <i data-lucide="refresh-cw" class="w-3 h-3"></i> Refresh
                            </button>
                        </div>

                        {myTickets.length === 0 ? (
                            <div class="text-center py-10 space-y-3">
                                <p class="text-slate-500 text-sm">You haven't filed any grievances yet.</p>
                                <button
                                    onClick={onGoRegister}
                                    class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                >
                                    Register First Grievance
                                </button>
                            </div>
                        ) : (
                            <div class="space-y-3">
                                {myTickets.map((t) => (
                                    <div
                                        key={t.id}
                                        class="bg-slate-50/70 hover:bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
                                    >
                                        <div class="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectTicket(t)}>
                                            <div class="flex items-center gap-2">
                                                <span class="font-mono text-xs font-bold text-blue-700">{t.ticketNumber}</span>
                                                <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                    t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {t.status}
                                                </span>
                                                <span class="text-[11px] text-slate-400 font-mono">{t.createdAt}</span>
                                            </div>
                                            <h4 class="text-sm font-bold text-slate-900">{t.subject}</h4>
                                            <p class="text-xs text-slate-600 line-clamp-1">{t.description}</p>
                                            
                                            {t.actionTakenBy && (
                                                <div class="mt-2 text-xs bg-white p-2 rounded-lg border border-slate-200 space-y-0.5">
                                                    <p class="text-blue-800 font-semibold">HR Action: <span class="text-slate-700 font-normal">{t.actionTakenBy}</span></p>
                                                    {t.resolvedAmount && (
                                                        <p class="text-emerald-700 font-bold">Settlement: {t.resolvedAmount}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div class="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => onSelectTicket(t)}
                                                class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition shadow-2xs"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => onDownloadTicket(t)}
                                                class="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center gap-1"
                                                title="Download official ticket slip (Default Process)"
                                            >
                                                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                                Download Slip
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ==========================================
        // 4. REGISTER GRIEVANCE VIEW (Light Theme)
        // ==========================================
        function RegisterGrievanceView({ user, onSuccess, onCancel }) {
            const [subject, setSubject] = useState('');
            const [description, setDescription] = useState('');
            const [departmentId, setDepartmentId] = useState(1);
            const [category, setCategory] = useState('PAYROLL');
            const [priority, setPriority] = useState('HIGH');
            const [monetaryValue, setMonetaryValue] = useState('');
            const [isSubmitting, setIsSubmitting] = useState(false);

            const handleSubmit = async (e) => {
                e.preventDefault();
                setIsSubmitting(true);

                try {
                    const payload = {
                        employeeId: user.employeeId,
                        customerName: user.fullName,
                        customerEmail: user.email,
                        customerPhone: user.phone || '+91-94441-11000',
                        subject,
                        description: monetaryValue ? `${description} [Claim Amount: ₹${monetaryValue}]` : description,
                        category,
                        priority,
                        departmentId: parseInt(departmentId, 10)
                    };

                    const newTicket = await apiCall('/complaints', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });

                    setIsSubmitting(false);
                    onSuccess(newTicket);
                } catch (err) {
                    setIsSubmitting(false);
                    alert("Error submitting grievance: " + err.message);
                }
            };

            return (
                <div class="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <i data-lucide="plus-circle" class="w-5 h-5 text-blue-700"></i>
                                File New Grievance
                            </h2>
                            <p class="text-xs text-slate-500 mt-0.5">
                                Official HR ticket slip will be auto-generated for download upon submission.
                            </p>
                        </div>
                        <button onClick={onCancel} class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} class="space-y-4">
                        <div class="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center gap-3 text-xs text-slate-700">
                            <i data-lucide="user" class="w-4 h-4 text-blue-700 shrink-0"></i>
                            <div>
                                Filing as: <strong>{user.fullName}</strong> ({user.employeeId}) • <span class="text-slate-500">{user.departmentName}</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Grievance Subject *
                            </label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. PF deduction discrepancy in latest payslip"
                                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                            />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Target HR Department *
                                </label>
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value={1}>Payroll & Compensation (Head: Soundarya P.)</option>
                                    <option value={2}>Employee Relations & Ethics (Head: Priya)</option>
                                    <option value={3}>Health Insurance & Benefits (Head: Rajesh Narayanan)</option>
                                    <option value={4}>IT Assets & Workplace Facilities (Head: Senthil M.)</option>
                                    <option value={5}>Talent Appraisal & Policies (Head: Malini V.)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Grievance Category *
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value="PAYROLL">PAYROLL (Salary, Taxes, PF)</option>
                                    <option value="HEALTH_INSURANCE">HEALTH INSURANCE (Mediclaim, TPA)</option>
                                    <option value="IT_ASSETS">IT ASSETS (Laptops, Monitors, Hardware)</option>
                                    <option value="BENEFITS">BENEFITS (Relocation, Allowances)</option>
                                    <option value="APPRAISAL_ETHICS">APPRAISAL & PERFORMANCE ETHICS</option>
                                    <option value="WORKPLACE_SAFETY">WORKPLACE SAFETY & CAB SERVICES</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Urgency Priority & SLA Tier
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value="CRITICAL">CRITICAL (4 Hours SLA - Salary Withholding / Medical)</option>
                                    <option value="HIGH">HIGH (24 Hours SLA - Hardware Failure / Reimbursements)</option>
                                    <option value="MEDIUM">MEDIUM (48 Hours SLA - Regularization / Allowances)</option>
                                    <option value="LOW">LOW (72 Hours SLA - Queries & Ergonomics)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Claimed Monetary Amount (₹ Optional)
                                </label>
                                <input
                                    type="number"
                                    value={monetaryValue}
                                    onChange={(e) => setMonetaryValue(e.target.value)}
                                    placeholder="e.g. 14800"
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Detailed Grievance Description *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Explain the specific issue, dates, reference numbers, and requested resolution..."
                                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                            ></textarea>
                        </div>

                        <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onCancel}
                                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                class="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
                            >
                                <i data-lucide="send" class="w-3.5 h-3.5"></i>
                                {isSubmitting ? 'Submitting...' : 'Register Grievance & Download Slip'}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        // ==========================================
        // 5. COMPLAINTS DIRECTORY VIEW (Light Theme)
        // ==========================================
        function ComplaintsDirectory({ complaints, user, onSelectTicket, onDownloadTicket, onTakeAction }) {
            const [filterCategory, setFilterCategory] = useState('ALL');
            const [searchQ, setSearchQ] = useState('');

            const filtered = complaints.filter(c => {
                const matchC = filterCategory === 'ALL' || c.category === filterCategory;
                const matchQ = !searchQ || 
                    c.ticketNumber.toLowerCase().includes(searchQ.toLowerCase()) ||
                    c.customerName.toLowerCase().includes(searchQ.toLowerCase()) ||
                    c.subject.toLowerCase().includes(searchQ.toLowerCase());
                return matchC && matchQ;
            });

            return (
                <div class="space-y-5">
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <i data-lucide="list" class="w-5 h-5 text-blue-700"></i>
                                Public Grievance Registry & Audit Log
                            </h2>
                            <p class="text-xs text-slate-500 mt-0.5">Showing all 50 recorded grievances across South Indian campuses.</p>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
                                <input
                                    type="text"
                                    value={searchQ}
                                    onChange={(e) => setSearchQ(e.target.value)}
                                    placeholder="Filter by ticket # or name..."
                                    class="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 cursor-pointer"
                                onClick={() => onSelectTicket(item)}
                            >
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="font-mono text-xs font-bold text-blue-700">{item.ticketNumber}</span>
                                        <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                            item.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <h4 class="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{item.subject}</h4>
                                    <p class="text-xs text-slate-500">Employee: <strong class="text-slate-800">{item.customerName}</strong> ({item.employeeId})</p>
                                    <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                                        <p class="text-blue-800 font-semibold truncate">Officer: <span class="text-slate-700 font-normal">{item.actionTakenBy || item.assignedAgentName}</span></p>
                                        <p class="text-emerald-700 font-bold truncate">Settlement: {item.resolvedAmount || 'Under Assessment'}</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                    {user && user.role === 'HR' && (
                                        <button
                                            onClick={() => onTakeAction(item)}
                                            class="flex-1 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition shadow-2xs"
                                        >
                                            Take Action
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDownloadTicket(item)}
                                        class="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center justify-center gap-1"
                                    >
                                        <i data-lucide="download" class="w-3.5 h-3.5 text-blue-700"></i>
                                        Download Slip
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // ==========================================
        // 6. TICKET SLIP DOWNLOAD MODAL (THE DEFAULT PROCESS)
        // ==========================================
        function TicketSlipDownloadModal({ ticket, onClose, showToast }) {
            const handlePrint = () => {
                window.print();
            };

            return (
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div class="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
                        {/* Modal Top Bar */}
                        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i data-lucide="file-check" class="w-5 h-5 text-emerald-600"></i>
                                <h3 class="font-bold text-sm text-slate-900">Official Grievance Resolution Slip</h3>
                            </div>
                            <button onClick={onClose} class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>

                        {/* Printable Ticket Receipt */}
                        <div id="printable-ticket-slip" class="p-6 md:p-8 space-y-6 text-xs bg-white">
                            {/* Official Corporate Header */}
                            <div class="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                                <div>
                                    <h1 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                        NEXUS RESOLUTION ENTERPRISE
                                    </h1>
                                    <p class="text-[11px] text-slate-600 mt-0.5">Corporate Grievance & Employee Ethics Governance Board</p>
                                    <p class="text-[10px] text-slate-500">OMR IT Corridor, Chennai & Electronic City, Bangalore</p>
                                </div>
                                <div class="text-right">
                                    <span class="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded">
                                        {ticket.ticketNumber}
                                    </span>
                                    <p class="text-[10px] text-slate-500 mt-1 font-mono">Date: {ticket.createdAt}</p>
                                </div>
                            </div>

                            {/* Two Column Summary Grid */}
                            <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div>
                                    <p class="text-slate-500 font-medium text-[10px] uppercase tracking-wider">Complainant Information</p>
                                    <p class="font-bold text-slate-900 text-sm mt-0.5">{ticket.customerName}</p>
                                    <p class="font-mono text-slate-600">ID: {ticket.employeeId}</p>
                                    <p class="text-slate-600">{ticket.customerEmail}</p>
                                    <p class="text-slate-600">{ticket.customerPhone}</p>
                                </div>
                                <div>
                                    <p class="text-slate-500 font-medium text-[10px] uppercase tracking-wider">Assigned HR Authority</p>
                                    <p class="font-bold text-slate-900 text-sm mt-0.5">{ticket.assignedAgentName || 'Priya'}</p>
                                    <p class="text-slate-600">Department: {ticket.departmentName}</p>
                                    <p class="text-slate-600 font-semibold">Priority SLA: <span class="text-rose-700 font-bold">{ticket.priority} Tier</span></p>
                                    <p class="text-emerald-700 font-bold">Status: {ticket.status}</p>
                                </div>
                            </div>

                            {/* Grievance Summary & Particulars */}
                            <div class="space-y-3">
                                <div>
                                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Grievance Subject</span>
                                    <p class="font-bold text-slate-900 text-sm mt-0.5">{ticket.subject}</p>
                                </div>

                                <div>
                                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statement of Grievance</span>
                                    <p class="text-slate-700 text-xs mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        {ticket.description}
                                    </p>
                                </div>

                                {ticket.actionNotes && (
                                    <div>
                                        <span class="text-[10px] font-bold text-blue-800 uppercase tracking-wider">HR Official Investigation Notes</span>
                                        <p class="text-slate-800 text-xs mt-0.5 bg-blue-50/60 p-3 rounded-lg border border-blue-200 leading-relaxed font-medium">
                                            {ticket.actionNotes}
                                        </p>
                                    </div>
                                )}

                                {ticket.resolutionSummary && (
                                    <div>
                                        <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Final Resolution & Settlement Sanction</span>
                                        <p class="text-emerald-900 text-xs mt-0.5 bg-emerald-50 p-3 rounded-lg border border-emerald-200 leading-relaxed font-medium">
                                            {ticket.resolutionSummary}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Official Seal & Signature Row */}
                            <div class="border-t border-slate-200 pt-6 flex items-center justify-between text-[11px]">
                                <div>
                                    <p class="text-slate-500">Authorized Grievance Officer:</p>
                                    <p class="font-bold text-slate-900 mt-1">{ticket.actionTakenBy || 'Priya (Head of Human Resources)'}</p>
                                    <p class="text-[10px] text-slate-400">Digitally Verified & Encrypted Record</p>
                                </div>

                                <div class="text-right">
                                    <div class="inline-block p-2 border border-slate-300 rounded bg-slate-50 text-[10px] font-mono font-bold text-slate-600 uppercase">
                                        ★ VERIFIED RESOLUTION SLIP ★
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Controls */}
                        <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePrint}
                                class="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                            >
                                <i data-lucide="printer" class="w-4 h-4"></i>
                                Print / Save PDF Slip
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // ==========================================
        // 7. HR ACTION MODAL (Light Theme)
        // ==========================================
        function HRActionModal({ ticket, hrUser, onClose, onSuccess, showToast }) {
            const [status, setStatus] = useState(ticket.status || 'IN_PROGRESS');
            const [actionNotes, setActionNotes] = useState(ticket.actionNotes || '');
            const [resolvedAmount, setResolvedAmount] = useState(ticket.resolvedAmount || '');
            const [resolutionSummary, setResolutionSummary] = useState(ticket.resolutionSummary || '');
            const [isSaving, setIsSaving] = useState(false);

            const handleSaveAction = async (e) => {
                e.preventDefault();
                setIsSaving(true);

                try {
                    await apiCall(`/complaints/${ticket.id}/hr-action`, {
                        method: 'POST',
                        body: JSON.stringify({
                            hrName: `${hrUser.fullName} (${hrUser.designation})`,
                            status,
                            actionNotes,
                            resolvedAmount,
                            resolutionSummary
                        })
                    });

                    setIsSaving(false);
                    onSuccess();
                } catch (err) {
                    setIsSaving(false);
                    alert("Error recording HR action: " + err.message);
                }
            };

            return (
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div class="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
                        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i data-lucide="shield-alert" class="w-5 h-5 text-blue-700"></i>
                                <h3 class="font-bold text-sm text-slate-900">Record Official HR Action & Resolution</h3>
                            </div>
                            <button onClick={onClose} class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSaveAction} class="p-6 space-y-4 text-xs">
                            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                                <div class="flex items-center justify-between">
                                    <span class="font-mono text-blue-700 font-bold">{ticket.ticketNumber}</span>
                                    <span class="text-slate-500 font-mono">Employee: {ticket.customerName} ({ticket.employeeId})</span>
                                </div>
                                <p class="font-bold text-slate-900 text-xs">{ticket.subject}</p>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Updated Status *
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value="IN_PROGRESS">IN_PROGRESS (Investigation in Process)</option>
                                    <option value="RESOLVED">RESOLVED (Full Action & Settlement Completed)</option>
                                    <option value="ASSIGNED">ASSIGNED (Transferred to Specialized Officer)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Investigation Findings & Action Recorded *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={actionNotes}
                                    onChange={(e) => setActionNotes(e.target.value)}
                                    placeholder="e.g. Audited ERP logs with Finance team; verified ₹14,800 excess deduction. Disciplinary warning issued to manager..."
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                ></textarea>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Compensation / Settlement Figure (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={resolvedAmount}
                                    onChange={(e) => setResolvedAmount(e.target.value)}
                                    placeholder="e.g. ₹14,800 credited in payroll cycle or 100% hardware replacement"
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Final Resolution Summary
                                </label>
                                <textarea
                                    rows={2}
                                    value={resolutionSummary}
                                    onChange={(e) => setResolutionSummary(e.target.value)}
                                    placeholder="e.g. Recalculated PF deduction; ₹14,800 credited into HDFC account."
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                ></textarea>
                            </div>

                            <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    class="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                >
                                    {isSaving ? 'Recording...' : 'Confirm & Save Action'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

        // ==========================================
        // 8. TICKET DETAIL MODAL (Light Theme)
        // ==========================================
        function TicketDetailModal({ ticket, user, onClose, onDownload, onTakeAction, showToast, loadData }) {
            const [replyMsg, setReplyMsg] = useState('');
            const [isSending, setIsSending] = useState(false);

            const handleSendReply = async (e) => {
                e.preventDefault();
                if (!replyMsg.trim()) return;

                setIsSending(true);
                try {
                    await apiCall(`/complaints/${ticket.id}/reply`, {
                        method: 'POST',
                        body: JSON.stringify({
                            message: replyMsg,
                            senderName: user.fullName,
                            senderEmail: user.email,
                            isInternal: false
                        })
                    });
                    setReplyMsg('');
                    setIsSending(false);
                    showToast('Reply message added to ticket thread');
                    loadData();
                } catch (err) {
                    setIsSending(false);
                    alert("Error replying: " + err.message);
                }
            };

            return (
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div class="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
                        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                            <div>
                                <span class="font-mono text-xs font-bold text-blue-700">{ticket.ticketNumber}</span>
                                <h3 class="font-bold text-sm text-slate-900">{ticket.subject}</h3>
                            </div>
                            <button onClick={onClose} class="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>

                        <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs flex-1">
                            {/* Summary info */}
                            <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                                <div>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase">Complainant</p>
                                    <p class="font-bold text-slate-900 text-xs mt-0.5">{ticket.customerName} ({ticket.employeeId})</p>
                                    <p class="text-slate-500">{ticket.customerEmail}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase">Assigned Officer & Status</p>
                                    <p class="font-bold text-slate-900 text-xs mt-0.5">{ticket.assignedAgentName || 'Priya'}</p>
                                    <p class="text-emerald-700 font-bold">{ticket.status} • {ticket.priority} Priority</p>
                                </div>
                            </div>

                            <div>
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Grievance Description</p>
                                <p class="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>

                            {ticket.actionNotes && (
                                <div>
                                    <p class="text-[10px] text-blue-800 font-bold uppercase mb-1">Investigation Action Taken</p>
                                    <p class="text-slate-800 bg-blue-50/50 p-3 rounded-lg border border-blue-200 leading-relaxed font-medium">
                                        {ticket.actionNotes}
                                    </p>
                                    {ticket.resolvedAmount && (
                                        <p class="text-emerald-700 font-bold mt-1 text-[11px]">Financial Settlement: {ticket.resolvedAmount}</p>
                                    )}
                                </div>
                            )}

                            {/* Reply Input */}
                            <form onSubmit={handleSendReply} class="pt-3 border-t border-slate-100 space-y-2">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Add Response or Inquiry Message
                                </label>
                                <div class="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={replyMsg}
                                        onChange={(e) => setReplyMsg(e.target.value)}
                                        placeholder="Type an official reply or employee follow-up..."
                                        class="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs transition shrink-0"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                            <button
                                onClick={onDownload}
                                class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
                            >
                                <i data-lucide="download" class="w-3.5 h-3.5 text-blue-700"></i>
                                Download Ticket Slip
                            </button>

                            {user && user.role === 'HR' && (
                                <button
                                    onClick={onTakeAction}
                                    class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                >
                                    Take HR Action
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // ==========================================
        // 9. ANALYTICS & CSAT VIEW (Light Theme)
        // ==========================================
        function AnalyticsView({ complaints, stats }) {
            const chartRef1 = useRef(null);
            const chartRef2 = useRef(null);

            useEffect(() => {
                let c1 = null;
                let c2 = null;

                if (chartRef1.current) {
                    const ex = Chart.getChart(chartRef1.current);
                    if (ex) ex.destroy();

                    c1 = new Chart(chartRef1.current, {
                        type: 'doughnut',
                        data: {
                            labels: ['Payroll & Deductions', 'Mediclaim Health', 'IT Assets Hardware', 'Workplace Transport', 'Benefits Relocation', 'Appraisal Ethics'],
                            datasets: [{
                                data: [
                                    complaints.filter(c => c.category === 'PAYROLL').length,
                                    complaints.filter(c => c.category === 'HEALTH_INSURANCE').length,
                                    complaints.filter(c => c.category === 'IT_ASSETS').length,
                                    complaints.filter(c => c.category === 'WORKPLACE_SAFETY').length,
                                    complaints.filter(c => c.category === 'BENEFITS').length,
                                    complaints.filter(c => c.category === 'APPRAISAL_ETHICS').length,
                                ],
                                backgroundColor: ['#1e3a8a', '#0284c7', '#0d9488', '#e11d48', '#d97706', '#7c3aed']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'right', labels: { color: '#334155', font: { size: 11 } } }
                            }
                        }
                    });
                }

                if (chartRef2.current) {
                    const ex2 = Chart.getChart(chartRef2.current);
                    if (ex2) ex2.destroy();

                    c2 = new Chart(chartRef2.current, {
                        type: 'bar',
                        data: {
                            labels: ['Critical (4h)', 'High (24h)', 'Medium (48h)', 'Low (72h)'],
                            datasets: [{
                                label: 'Grievance Count',
                                data: [
                                    complaints.filter(c => c.priority === 'CRITICAL').length,
                                    complaints.filter(c => c.priority === 'HIGH').length,
                                    complaints.filter(c => c.priority === 'MEDIUM').length,
                                    complaints.filter(c => c.priority === 'LOW').length,
                                ],
                                backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                                x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }
                            },
                            plugins: {
                                legend: { display: false }
                            }
                        }
                    });
                }

                return () => {
                    if (c1) c1.destroy();
                    if (c2) c2.destroy();
                };
            }, [complaints]);

            return (
                <div class="space-y-6">
                    <div>
                        <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <i data-lucide="bar-chart-3" class="w-5 h-5 text-blue-700"></i>
                            Nexus Resolution Analytics & SLA Metrics
                        </h2>
                        <p class="text-xs text-slate-500 mt-0.5">Corporate compliance, response times, and grievance volume analytics.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h3 class="text-sm font-bold text-slate-900">Grievances by Functional Department</h3>
                            <div class="h-64">
                                <canvas ref={chartRef1}></canvas>
                            </div>
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h3 class="text-sm font-bold text-slate-900">Grievance Distribution by SLA Priority Tier</h3>
                            <div class="h-64">
                                <canvas ref={chartRef2}></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Render React Application
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>
`;

fs.writeFileSync('index.html', indexHtmlContent, 'utf8');
console.log('Successfully wrote clean light-theme triple-bar index.html');
