// Nexus Resolution - Primary Omnichannel View Modules
const { useState: vState, useEffect: vEffect } = React;

// ==========================================
// 1. OMNICHANNEL INBOX VIEW
// ==========================================
function OmnichannelInboxView({
    complaints,
    allComplaints,
    channelFilter,
    setChannelFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    onSelectTicket,
    onAssignTicket,
    onEscalateTicket,
    onFeedbackTicket,
    onActionTicket,
    onAdjustTicket,
    onCompensateTicket,
    onDownloadSlip,
    customTitle
}) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [complaints, channelFilter, statusFilter]);

    const channelTabs = [
        { id: 'ALL', label: 'All Channels', icon: 'layers' },
        { id: 'EMAIL', label: 'Email Inbound', icon: 'mail' },
        { id: 'WEB_PORTAL', label: 'Web Portal', icon: 'globe' },
        { id: 'PHONE', label: 'Phone Helpline', icon: 'phone-call' },
        { id: 'LIVE_CHAT', label: 'Live Chat', icon: 'message-square' },
        { id: 'MOBILE_APP', label: 'Mobile SDK', icon: 'smartphone' },
        { id: 'SOCIAL_MEDIA', label: 'Social & WhatsApp', icon: 'share-2' },
        { id: 'IN_PERSON', label: 'Branch Desk', icon: 'map-pin' }
    ];

    return (
        <div className="space-y-4 max-w-7xl mx-auto">
            {/* Header / Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <i data-lucide="inbox" className="w-5 h-5 text-blue-700"></i>
                        {customTitle || 'Centralized Omnichannel Complaint Repository'}
                    </h2>
                    <p className="text-xs text-slate-500">
                        Unified tracking of all customer inquiries, cross-channel assignment, and SLA enforcement.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                        Showing {complaints.length} of {allComplaints.length} tickets
                    </span>
                </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by ticket # (TKT-2026-...), customer name, company, email, or subject..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="ASSIGNED">ASSIGNED (New)</option>
                            <option value="IN_PROGRESS">IN_PROGRESS (Investigating)</option>
                            <option value="ESCALATED">ESCALATED (Tier 2-4)</option>
                            <option value="BREACHED">SLA BREACHED</option>
                            <option value="RESOLVED">RESOLVED</option>
                        </select>
                    </div>
                </div>

                {/* Horizontal Channel Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 pt-1 border-t border-slate-100">
                    {channelTabs.map(tab => {
                        const count = tab.id === 'ALL' 
                            ? allComplaints.length 
                            : allComplaints.filter(c => c.channel === tab.id).length;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setChannelFilter(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                                    channelFilter === tab.id
                                        ? 'bg-blue-700 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                            >
                                <i data-lucide={tab.icon} className="w-3.5 h-3.5"></i>
                                <span>{tab.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    channelFilter === tab.id ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                <th className="py-3 px-4">Ticket & Channel</th>
                                <th className="py-3 px-4">Customer & Account</th>
                                <th className="py-3 px-4">Subject & Grievance</th>
                                <th className="py-3 px-4">Queue & Assignee</th>
                                <th className="py-3 px-4">SLA Status</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-400">
                                        <i data-lucide="inbox" className="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                                        <p className="font-semibold">No complaints matched current filters.</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Try resetting search or channel tabs.</p>
                                    </td>
                                </tr>
                            ) : (
                                complaints.map(ticket => {
                                    const chMeta = getChannel(ticket.channel);
                                    return (
                                        <tr key={ticket.id} className="hover:bg-slate-50/80 transition group">
                                            {/* Ticket & Channel */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        onClick={() => onSelectTicket(ticket)}
                                                        className="font-black text-blue-700 hover:text-blue-900 cursor-pointer font-mono"
                                                    >
                                                        {ticket.ticketNumber}
                                                    </span>
                                                    {ticket.escalated && (
                                                        <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                                                            Escalated
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${chMeta.bg} ${chMeta.text}`}>
                                                        <i data-lucide={chMeta.icon} className="w-3 h-3"></i>
                                                        {chMeta.label}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Customer & Account */}
                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-slate-900">{ticket.customerName}</p>
                                                <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{ticket.companyName || 'Retail Customer'}</p>
                                                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                                                    ticket.customerAccountTier === 'ENTERPRISE_VIP' ? 'bg-purple-100 text-purple-900' :
                                                    ticket.customerAccountTier === 'CORPORATE' ? 'bg-blue-100 text-blue-900' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {ticket.customerAccountTier}
                                                </span>
                                            </td>

                                            {/* Subject & Grievance */}
                                            <td className="py-3.5 px-4 max-w-xs">
                                                <p
                                                    onClick={() => onSelectTicket(ticket)}
                                                    className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-1"
                                                >
                                                    {ticket.subject}
                                                </p>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ticket.description}</p>
                                                <span className="text-[10px] text-slate-400 font-mono">{ticket.category}</span>
                                            </td>

                                            {/* Queue & Assignee */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <p className="font-bold text-slate-800">{ticket.assignedAgentName || 'Unassigned'}</p>
                                                <p className="text-[10px] text-slate-500">{ticket.departmentName}</p>
                                                <button
                                                    onClick={() => onAssignTicket(ticket)}
                                                    className="text-[10px] text-blue-700 hover:text-blue-900 font-bold underline mt-0.5"
                                                >
                                                    Re-Route / Assign
                                                </button>
                                            </td>

                                            {/* SLA Status */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                    ticket.slaBreached 
                                                        ? 'bg-rose-100 text-rose-800' 
                                                        : ticket.status === 'RESOLVED'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {ticket.status === 'RESOLVED' ? 'RESOLVED' : ticket.slaBreached ? 'SLA BREACHED' : 'SLA ON-TRACK'}
                                                </span>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    Target: {ticket.slaTargetHours}h • {ticket.priority}
                                                </p>
                                            </td>

                                            {/* Claim / Sanctioned Amount */}
                                            <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                                                <span className="font-bold text-slate-900">
                                                    {ticket.resolvedAmount || ticket.hrApprovedAmount || ticket.claimedAmount || '—'}
                                                </span>
                                                {ticket.isAmountAdjusted && (
                                                    <span className="block text-[9px] text-purple-700 font-sans font-bold">Audited / Capped</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => onSelectTicket(ticket)}
                                                        className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg transition"
                                                        title="Open Ticket Thread & Log"
                                                    >
                                                        <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => onEscalateTicket(ticket)}
                                                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition"
                                                        title="Trigger Escalation Tier"
                                                    >
                                                        <i data-lucide="alert-octagon" className="w-3.5 h-3.5"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => onActionTicket(ticket)}
                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg transition"
                                                        title="Record Action / Resolve"
                                                    >
                                                        <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => onDownloadSlip(ticket)}
                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                                        title="Print Resolution Voucher"
                                                    >
                                                        <i data-lucide="printer" className="w-3.5 h-3.5"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 2. REGISTER COMPLAINT VIEW (Multi-Channel Intake)
// ==========================================
function RegisterComplaintView({ departments, currentUser, onSuccess, onCancel }) {
    const [channel, setChannel] = vState('WEB_PORTAL');
    const [customerName, setCustomerName] = vState(currentUser.fullName || '');
    const [customerEmail, setCustomerEmail] = vState(currentUser.email || '');
    const [customerPhone, setCustomerPhone] = vState('+91 98401 23456');
    const [companyName, setCompanyName] = vState('TechNova Cloud Systems');
    const [customerAccountTier, setCustomerAccountTier] = vState('ENTERPRISE_VIP');
    const [category, setCategory] = vState('BILLING_FINANCIAL');
    const [priority, setPriority] = vState('HIGH');
    const [departmentId, setDepartmentId] = vState(1);
    const [subject, setSubject] = vState('');
    const [description, setDescription] = vState('');
    const [claimedAmount, setClaimedAmount] = vState('14800');
    const [isSubmitting, setIsSubmitting] = vState(false);

    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [channel]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) {
            alert('Please provide a subject and detailed description.');
            return;
        }

        setIsSubmitting(true);
        try {
            const newTkt = await apiCall('/complaints', {
                method: 'POST',
                body: JSON.stringify({
                    channel,
                    customerName,
                    customerEmail,
                    customerPhone,
                    companyName,
                    customerAccountTier,
                    category,
                    priority,
                    departmentId: Number(departmentId),
                    subject,
                    description,
                    claimedAmount: claimedAmount ? `₹${parseFloat(claimedAmount).toLocaleString('en-IN')}` : null,
                    employeeId: currentUser.employeeId || 'CUST-3001'
                })
            });
            setIsSubmitting(false);
            onSuccess(newTkt);
        } catch (err) {
            setIsSubmitting(false);
            alert('Registration error: ' + err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="border-b border-slate-100 pb-4 mb-6">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full">
                        Centralized Intake Gateway
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                        Register Inbound Customer Complaint
                    </h2>
                    <p className="text-xs text-slate-500">
                        Streamline complaint intake from any channel into our central repository with automated SLA tracking and department routing.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                    {/* Channel Selection Matrix */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                            1. Ingestion Channel Source *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                            {Object.entries(CHANNEL_META).map(([key, meta]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setChannel(key)}
                                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                                        channel === key
                                            ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-xs'
                                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    <i data-lucide={meta.icon} className="w-4 h-4"></i>
                                    <span className="text-[11px] leading-tight">{meta.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customer Account Details */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                            2. Customer & Account Identification *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Customer Full Name</span>
                                <input
                                    type="text"
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Corporate / Company Name</span>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Account Relationship Tier</span>
                                <select
                                    value={customerAccountTier}
                                    onChange={(e) => setCustomerAccountTier(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value="ENTERPRISE_VIP">Enterprise VIP (Dedicated SLA)</option>
                                    <option value="CORPORATE">Corporate Business</option>
                                    <option value="SMB">SMB / Mid-Market</option>
                                    <option value="STANDARD">Standard Retail</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Email</span>
                                <input
                                    type="email"
                                    required
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Phone / Helpline Reference</span>
                                <input
                                    type="text"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Routing, Category, & SLA Priority */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                            3. Routing & SLA Classification *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Department Routing</span>
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Grievance Category</span>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value="BILLING_FINANCIAL">Billing & Overcharge Dispute</option>
                                    <option value="TECHNICAL_PLATFORM">Technical Platform & Outage</option>
                                    <option value="CUSTOMER_SERVICE">Customer Service Quality / Conduct</option>
                                    <option value="LOGISTICS_DELIVERY">Logistics & Service Delivery</option>
                                    <option value="SECURITY_ACCESS">Security & Identity Access</option>
                                </select>
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">SLA Priority Level</span>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                >
                                    <option value="CRITICAL">CRITICAL (4 Hours Resolution SLA)</option>
                                    <option value="HIGH">HIGH (24 Hours Resolution SLA)</option>
                                    <option value="MEDIUM">MEDIUM (48 Hours Resolution SLA)</option>
                                    <option value="LOW">LOW (72 Hours Resolution SLA)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Complaint Details */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                            4. Grievance Content & Financial Claim
                        </label>
                        <div className="space-y-3">
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Complaint Subject *</span>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief title summarizing the issue..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Detailed Description & Evidence *</span>
                                <textarea
                                    rows={4}
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the incident, timestamps, impacted services, and steps to reproduce..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 leading-relaxed"
                                />
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-1">Claimed Compensation / Financial Value (₹)</span>
                                <input
                                    type="number"
                                    value={claimedAmount}
                                    onChange={(e) => setClaimedAmount(e.target.value)}
                                    placeholder="e.g. 14800 (leave empty if non-monetary)"
                                    className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-2"
                        >
                            <i data-lucide="check" className="w-4 h-4"></i>
                            {isSubmitting ? 'Registering Across Channels...' : 'Register & Assign Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ==========================================
// 3. SLA MONITOR & COUNTDOWN QUEUE VIEW
// ==========================================
function SLAMonitorView({ complaints, stats, onSelectTicket, onEscalateTicket }) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [complaints]);

    const activeTickets = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED');

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <i data-lucide="clock" className="w-5 h-5 text-blue-700"></i>
                        Centralized SLA Monitoring & Compliance Matrix
                    </h2>
                    <p className="text-xs text-slate-500">
                        Real-time tracking of resolution targets, breach alerts, and automatic escalation thresholds.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
                        <span className="text-emerald-700 font-medium">Compliance Rate: </span>
                        <strong className="text-emerald-900 font-bold">{stats?.slaComplianceRate || 94}%</strong>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs">
                        <span className="text-rose-700 font-medium">Active Breaches: </span>
                        <strong className="text-rose-900 font-bold">{stats?.slaBreachedTickets || 0}</strong>
                    </div>
                </div>
            </div>

            {/* SLA Policy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-rose-900 uppercase">CRITICAL SLA</span>
                        <span className="text-xs font-mono font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">4 Hours</span>
                    </div>
                    <p className="text-xs text-rose-800 font-medium">Enterprise VIP & Outages</p>
                    <p className="text-[10px] text-rose-600 mt-1">Escalates to Tier 3 within 2 hours of inactivity</p>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-orange-900 uppercase">HIGH SLA</span>
                        <span className="text-xs font-mono font-bold bg-orange-200 text-orange-900 px-2 py-0.5 rounded">24 Hours</span>
                    </div>
                    <p className="text-xs text-orange-800 font-medium">Corporate Invoicing & Data</p>
                    <p className="text-[10px] text-orange-600 mt-1">Warning alert sent at 18 hours</p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-blue-900 uppercase">MEDIUM SLA</span>
                        <span className="text-xs font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">48 Hours</span>
                    </div>
                    <p className="text-xs text-blue-800 font-medium">Account Access & Shipping</p>
                    <p className="text-[10px] text-blue-600 mt-1">Daily SLA progress review</p>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-800 uppercase">LOW SLA</span>
                        <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">72 Hours</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">General Inquiries & Feedback</p>
                    <p className="text-[10px] text-slate-500 mt-1">Standard queue resolution</p>
                </div>
            </div>

            {/* Active SLA Watchlist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Active Complaint SLA Watchlist</h3>
                    <span className="text-xs text-slate-400">{activeTickets.length} pending complaints monitored</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {activeTickets.map(t => (
                        <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        onClick={() => onSelectTicket(t)}
                                        className="font-mono font-bold text-xs text-blue-700 hover:underline cursor-pointer"
                                    >
                                        {t.ticketNumber}
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                        t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                                        t.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {t.priority}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        Target: {t.slaTargetHours}h
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{t.subject}</p>
                                <p className="text-[10px] text-slate-500">
                                    {t.customerName} ({t.companyName}) • Assigned: {t.assignedAgentName}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    t.slaBreached 
                                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}>
                                    {t.slaBreached ? '⚠️ SLA BREACHED' : '⏱️ ON-TRACK'}
                                </span>
                                <button
                                    onClick={() => onEscalateTicket(t)}
                                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                                >
                                    <i data-lucide="zap" className="w-3.5 h-3.5"></i>
                                    Escalate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 4. ESCALATION WORKFLOWS VIEW
// ==========================================
function EscalationsView({ complaints, onSelectTicket, onEscalateTicket, onActionTicket }) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [complaints]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <i data-lucide="alert-octagon" className="w-5 h-5 text-amber-600"></i>
                        Multi-Tier Escalation Workflows & Executive Oversight
                    </h2>
                    <p className="text-xs text-slate-500">
                        Systematic operational path: Tier 1 Specialists → Tier 2 Leads → Tier 3 Department Ops → Tier 4 Executive CX.
                    </p>
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl">
                    {complaints.length} Escalated Cases Under Supervision
                </span>
            </div>

            {/* Escalation Hierarchy Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase">TIER 1</span>
                    <h4 className="font-bold text-slate-900 mt-0.5">Frontline Resolution</h4>
                    <p className="text-slate-500 text-[11px] mt-1">First-touch triage, channel intake, verification of evidence.</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                    <span className="text-[10px] font-black text-amber-800 uppercase">TIER 2</span>
                    <h4 className="font-bold text-amber-950 mt-0.5">Senior Specialist</h4>
                    <p className="text-amber-800 text-[11px] mt-1">Technical impasses, multi-party reconciliation, SLA alerts.</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs">
                    <span className="text-[10px] font-black text-orange-800 uppercase">TIER 3</span>
                    <h4 className="font-bold text-orange-950 mt-0.5">Operations Manager</h4>
                    <p className="text-orange-800 text-[11px] mt-1">Financial compensation overrides, priority SLA breaches.</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                    <span className="text-[10px] font-black text-rose-800 uppercase">TIER 4</span>
                    <h4 className="font-bold text-rose-950 mt-0.5">Executive CX Director</h4>
                    <p className="text-rose-800 text-[11px] mt-1">Strategic account retention, legal review, board reporting.</p>
                </div>
            </div>

            {/* Escalated Tickets Feed */}
            <div className="space-y-3">
                {complaints.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                        <i data-lucide="check-circle" className="w-8 h-8 mx-auto mb-2 text-emerald-500"></i>
                        <p className="font-bold text-slate-700">No active escalated cases.</p>
                        <p className="text-xs text-slate-400">All complaint queues are operating within standard frontline SLA thresholds.</p>
                    </div>
                ) : (
                    complaints.map(t => (
                        <div key={t.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-black text-sm text-slate-900">{t.ticketNumber}</span>
                                        <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full uppercase">
                                            {t.escalationTier || 'TIER 2 ESCALATION'}
                                        </span>
                                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                                            {t.priority}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mt-1">{t.subject}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-500">Escalated Manager:</span>
                                    <p className="text-xs font-bold text-slate-900">{t.escalatedTo || 'Priya (Grievance Officer)'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Escalation Trigger Reason</span>
                                    <p className="font-semibold text-slate-800 mt-0.5">{t.escalationReason || 'SLA Risk'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Impact</span>
                                    <p className="font-semibold text-slate-800 mt-0.5">{t.customerName} ({t.customerAccountTier})</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Settlement Claim</span>
                                    <p className="font-mono font-bold text-emerald-700 mt-0.5">{t.resolvedAmount || t.claimedAmount || 'Non-financial'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                    onClick={() => onSelectTicket(t)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                >
                                    Review Full History
                                </button>
                                <button
                                    onClick={() => onEscalateTicket(t)}
                                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition"
                                >
                                    Elevate Tier
                                </button>
                                <button
                                    onClick={() => onActionTicket(t)}
                                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                >
                                    Take Resolution Action
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ==========================================
// 5. CUSTOMER FEEDBACK & SERVICE QUALITY VIEW
// ==========================================
function CustomerFeedbackView({ feedbacks, stats, complaints, onSelectTicket, onOpenFeedbackModal }) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [feedbacks]);

    const resolvedWithoutFeedback = complaints.filter(c => c.status === 'RESOLVED' && !c.feedback);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <i data-lucide="star" className="w-5 h-5 text-amber-500"></i>
                        Customer Feedback & Service Quality Optimization (CSAT / NPS)
                    </h2>
                    <p className="text-xs text-slate-500">
                        Continuous service loop capturing real-time customer satisfaction, Net Promoter scores, and First Contact Resolution (FCR).
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl">
                        ★ {stats?.avgCsat || 4.8} / 5.0 CSAT Average
                    </span>
                </div>
            </div>

            {/* Quality Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Average CSAT Rating</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats?.avgCsat || 4.8} ★</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Top 5% Industry Benchmark</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Net Promoter Score (NPS)</span>
                    <p className="text-2xl font-black text-purple-900 mt-1">+{stats?.npsScore || 75}</p>
                    <p className="text-[10px] text-purple-600 font-bold mt-0.5">World-Class Loyalty Index</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">First Contact Resolution (FCR)</span>
                    <p className="text-2xl font-black text-blue-900 mt-1">{stats?.fcrRate || 100}%</p>
                    <p className="text-[10px] text-blue-600 font-bold mt-0.5">Zero Callback Resolutions</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Average Turnaround</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats?.avgResolutionHours || '3.4h'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Across All 7 Ingestion Channels</p>
                </div>
            </div>

            {/* Ready for Customer Review Callout */}
            {resolvedWithoutFeedback.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900">
                            {resolvedWithoutFeedback.length} Resolved Complaints Awaiting Customer Feedback
                        </span>
                        <span className="text-[10px] text-blue-700">Click ticket to capture customer feedback</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {resolvedWithoutFeedback.map(t => (
                            <button
                                key={t.id}
                                onClick={() => onOpenFeedbackModal(t)}
                                className="px-3 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl font-mono font-bold text-xs transition"
                            >
                                Rate {t.ticketNumber} ({t.customerName})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Customer Testimonial & Review Feed */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Reviews & Verified Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedbacks.map(f => (
                        <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-mono font-bold text-xs text-blue-700">{f.ticketNumber}</span>
                                    <p className="text-xs font-bold text-slate-900">{f.customerName}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <i
                                            key={s}
                                            data-lucide="star"
                                            className={`w-3.5 h-3.5 ${s <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                        ></i>
                                    ))}
                                </div>
                            </div>

                            <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                "{f.comments}"
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <span>NPS Score: {f.npsScore}/10 • FCR: {f.fcr ? 'Yes (Single Contact)' : 'No'}</span>
                                <span>{f.timestamp}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 6. CHANNEL MATRIX & INTEGRATION VIEW
// ==========================================
function ChannelMatrixView({ channels, stats, onFilterChannel }) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [channels]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <i data-lucide="radio" className="w-5 h-5 text-blue-700"></i>
                    Omnichannel Ingestion Infrastructure
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Centralizing customer complaints arriving through multiple disparate gateways into a single unified tracking engine.
                </p>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(stats?.channels || channels).map(ch => {
                    const meta = getChannel(ch.id);
                    return (
                        <div key={ch.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={`w-10 h-10 rounded-xl ${meta.bg} ${meta.text} flex items-center justify-center font-bold`}>
                                    <i data-lucide={meta.icon} className="w-5 h-5"></i>
                                </div>
                                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                                    {ch.count || 0} Tickets ({ch.percentage || 0}%)
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm text-slate-900">{meta.label}</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ch.description}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    Gateway Active
                                </span>
                                <button
                                    onClick={() => onFilterChannel(ch.id)}
                                    className="text-xs font-bold text-blue-700 hover:text-blue-900"
                                >
                                    Filter Inbox →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Export views to window
window.OmnichannelInboxView = OmnichannelInboxView;
window.RegisterComplaintView = RegisterComplaintView;
window.SLAMonitorView = SLAMonitorView;
window.EscalationsView = EscalationsView;
window.CustomerFeedbackView = CustomerFeedbackView;
window.ChannelMatrixView = ChannelMatrixView;
