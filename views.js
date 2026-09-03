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

// ==========================================
// 7. WORKFLOW BANNER COMPONENT
// Customer → Helpdesk → Assigned Staff/Department → Manager/Admin → Customer Feedback
// ==========================================
function WorkflowBanner({ complaints, stats, currentTab, onNavigateTab, currentUserRole }) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [complaints]);

    const stage1Count = complaints.length;
    const stage2Count = complaints.filter(c => !c.assignedAgentId || c.status === 'ASSIGNED').length;
    const stage3Count = complaints.filter(c => c.status === 'IN_PROGRESS' || (c.assignedAgentId && c.status !== 'RESOLVED')).length;
    const stage4Count = complaints.filter(c => c.escalated || c.slaBreached || c.status === 'ESCALATED').length;
    const stage5Count = complaints.filter(c => c.feedback || c.status === 'RESOLVED').length;

    const stages = [
        { id: 'customer', title: '1. Customer / User', role: 'CUSTOMER', desc: 'Registers grievance & submits inquiry', icon: 'user', count: stage1Count, color: 'blue', tab: 'inbox' },
        { id: 'helpdesk', title: '2. Helpdesk Team', role: 'HELPDESK', desc: 'Intake triage & routes to department', icon: 'headphones', count: stage2Count, color: 'indigo', tab: 'inbox' },
        { id: 'staff', title: '3. Assigned Staff', role: 'STAFF', desc: 'Investigates & executes resolution', icon: 'wrench', count: stage3Count, color: 'emerald', tab: 'my-tickets' },
        { id: 'manager', title: '4. Manager / Admin', role: 'MANAGER', desc: 'SLA oversight & multi-tier escalation', icon: 'shield-alert', count: stage4Count, color: 'amber', tab: 'sla' },
        { id: 'feedback', title: '5. Customer Feedback', role: 'CUSTOMER', desc: 'CSAT rating & satisfaction review', icon: 'star', count: stage5Count, color: 'purple', tab: 'feedback' }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs mb-5">
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                        Resolution Lifecycle Workflow:
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                        Customer → Helpdesk → Assigned Staff → Manager/Admin → Customer Feedback
                    </span>
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Active Pipeline Tracking
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {stages.map((stage, idx) => {
                    const isRelevantToUser = currentUserRole === stage.role || currentUserRole === 'ADMIN' || currentUserRole === 'MANAGEMENT';
                    return (
                        <div
                            key={stage.id}
                            onClick={() => onNavigateTab && onNavigateTab(stage.tab)}
                            className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                                isRelevantToUser
                                    ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                        stage.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                        stage.color === 'indigo' ? 'bg-indigo-100 text-indigo-800' :
                                        stage.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                                        stage.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        <i data-lucide={stage.icon} className="w-3 h-3"></i>
                                    </span>
                                    <span className="text-xs font-bold text-slate-900 leading-none">{stage.title}</span>
                                </div>
                                <span className="font-mono text-[11px] font-black text-slate-700 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                                    {stage.count}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight truncate">{stage.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ==========================================
// 8. ADMIN USER & STAFF MANAGEMENT VIEW
// ==========================================
function UserManagementView({ users, departments, onRefreshUsers, showToast }) {
    const [searchTerm, setSearchTerm] = vState('');
    const [roleFilter, setRoleFilter] = vState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = vState(false);
    const [editingUser, setEditingUser] = vState(null);
    const [showPinUserId, setShowPinUserId] = vState(null);

    // New user state
    const [newEmpId, setNewEmpId] = vState('');
    const [newFullName, setNewFullName] = vState('');
    const [newEmail, setNewEmail] = vState('');
    const [newRole, setNewRole] = vState('STAFF');
    const [newDepartmentId, setNewDepartmentId] = vState(1);
    const [newDesignation, setNewDesignation] = vState('');
    const [newPin, setNewPin] = vState('1234');
    const [newPhone, setNewPhone] = vState('+91-98400-00000');
    const [isSubmitting, setIsSubmitting] = vState(false);

    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [users, roleFilter, isAddModalOpen, editingUser, showPinUserId]);

    const filteredUsers = users.filter(u => {
        if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            (u.fullName && u.fullName.toLowerCase().includes(q)) ||
            (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
            (u.customerId && u.customerId.toLowerCase().includes(q)) ||
            (u.headId && u.headId.toLowerCase().includes(q)) ||
            (u.altId && u.altId.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.role && u.role.toLowerCase().includes(q)) ||
            (u.departmentName && u.departmentName.toLowerCase().includes(q))
        );
    });

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newEmpId.trim() || !newFullName.trim()) {
            alert('Please provide Employee ID and Full Name.');
            return;
        }

        const dept = departments.find(d => d.id === Number(newDepartmentId)) || departments[0];

        setIsSubmitting(true);
        try {
            await apiCall('/users', {
                method: 'POST',
                body: JSON.stringify({
                    employeeId: newEmpId.trim().toUpperCase(),
                    fullName: newFullName.trim(),
                    email: newEmail.trim() || `${newEmpId.toLowerCase()}@nexusres.com`,
                    role: newRole,
                    roleDisplay: newRole === 'CUSTOMER' ? 'Customer / User' :
                                 newRole === 'HELPDESK' ? 'Support / Helpdesk Team' :
                                 newRole === 'STAFF' ? 'Complaint Handling Staff' :
                                 newRole === 'MANAGER' ? 'Team Leader / Manager' :
                                 newRole === 'ADMIN' ? 'System Administrator' : 'Executive Management',
                    designation: newDesignation.trim() || 'Complaint Specialist',
                    departmentId: Number(newDepartmentId),
                    departmentName: dept?.name || 'Customer Operations',
                    phone: newPhone,
                    securityPin: newPin || '1234'
                })
            });
            setIsSubmitting(false);
            setIsAddModalOpen(false);
            // Reset form
            setNewEmpId('');
            setNewFullName('');
            setNewEmail('');
            setNewDesignation('');
            setNewPin('1234');
            showToast('New user account created successfully with Security PIN.');
            if (onRefreshUsers) onRefreshUsers();
        } catch (err) {
            setIsSubmitting(false);
            alert('Failed to add user: ' + err.message);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;
        setIsSubmitting(true);
        try {
            await apiCall(`/users/${editingUser.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    fullName: editingUser.fullName,
                    email: editingUser.email,
                    role: editingUser.role,
                    roleDisplay: editingUser.role === 'CUSTOMER' ? 'Customer / User' :
                                 editingUser.role === 'HELPDESK' ? 'Support / Helpdesk Team' :
                                 editingUser.role === 'STAFF' ? 'Complaint Handling Staff' :
                                 editingUser.role === 'MANAGER' ? 'Team Leader / Manager' :
                                 editingUser.role === 'ADMIN' ? 'System Administrator' : 'Executive Management',
                    designation: editingUser.designation,
                    departmentId: Number(editingUser.departmentId),
                    departmentName: departments.find(d => d.id === Number(editingUser.departmentId))?.name || editingUser.departmentName,
                    phone: editingUser.phone,
                    securityPin: editingUser.securityPin
                })
            });
            setIsSubmitting(false);
            setEditingUser(null);
            showToast(`User ${editingUser.employeeId} profile updated successfully.`);
            if (onRefreshUsers) onRefreshUsers();
        } catch (err) {
            setIsSubmitting(false);
            alert('Failed to update user: ' + err.message);
        }
    };

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <i data-lucide="users" className="w-5 h-5 text-blue-700"></i>
                        User, Staff & Role Governance Center
                    </h2>
                    <p className="text-xs text-slate-500">
                        Manage user permissions, employee identifiers, assigned support departments, and security PIN credentials.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <i data-lucide="user-plus" className="w-4 h-4"></i>
                    Add New User / Staff
                </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: 'Total Accounts', count: users.length, icon: 'users', color: 'bg-slate-100 text-slate-800' },
                    { label: 'Support / Helpdesk', count: users.filter(u => u.role === 'HELPDESK').length, icon: 'headphones', color: 'bg-indigo-100 text-indigo-800' },
                    { label: 'Handling Staff', count: users.filter(u => u.role === 'STAFF').length, icon: 'wrench', color: 'bg-emerald-100 text-emerald-800' },
                    { label: 'Team Leaders / Mgrs', count: users.filter(u => u.role === 'MANAGER').length, icon: 'shield-alert', color: 'bg-amber-100 text-amber-800' },
                    { label: 'Administrators', count: users.filter(u => u.role === 'ADMIN').length, icon: 'settings', color: 'bg-rose-100 text-rose-800' },
                    { label: 'Customer Accounts', count: users.filter(u => u.role === 'CUSTOMER').length, icon: 'user', color: 'bg-blue-100 text-blue-800' }
                ].map((m, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 leading-tight">{m.label}</span>
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${m.color}`}>
                                <i data-lucide={m.icon} className="w-3.5 h-3.5"></i>
                            </span>
                        </div>
                        <p className="text-xl font-black text-slate-900 mt-2">{m.count}</p>
                    </div>
                ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Employee ID, Name, Email, or Department..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                    >
                        <option value="ALL">All System Roles</option>
                        <option value="CUSTOMER">Customers / Users</option>
                        <option value="HELPDESK">Support / Helpdesk Team</option>
                        <option value="STAFF">Complaint Handling Staff</option>
                        <option value="MANAGER">Team Leaders / Managers</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGEMENT">Executive Management</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                <th className="py-3 px-4">User & Identifier</th>
                                <th className="py-3 px-4">Assigned Role</th>
                                <th className="py-3 px-4">Department & Designation</th>
                                <th className="py-3 px-4">Contact Info</th>
                                <th className="py-3 px-4">Security PIN</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-slate-400">
                                        No users match the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => {
                                    const roleColors = {
                                        ADMIN: 'bg-rose-100 text-rose-800 border-rose-200',
                                        HELPDESK: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                                        STAFF: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                                        MANAGER: 'bg-amber-100 text-amber-800 border-amber-200',
                                        MANAGEMENT: 'bg-purple-100 text-purple-800 border-purple-200',
                                        CUSTOMER: 'bg-blue-100 text-blue-800 border-blue-200'
                                    };
                                    const isPinShown = showPinUserId === u.id;
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition">
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                                                        {u.avatar || u.fullName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{u.fullName}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono font-bold">
                                                            {u.customerId ? `CUST ID: ${u.customerId}` : u.headId ? `HEAD ID: ${u.headId}` : `EMP ID: ${u.employeeId}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full border ${roleColors[u.role] || 'bg-slate-100 text-slate-800'}`}>
                                                    {u.roleDisplay || u.role}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-slate-800 text-xs">{u.departmentName || 'Operations'}</p>
                                                <p className="text-[11px] text-slate-500">{u.designation || 'Specialist'}</p>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="text-slate-800 font-medium">{u.email}</p>
                                                <p className="text-[10px] text-slate-400">{u.phone}</p>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">
                                                        {isPinShown ? (u.securityPin || '1234') : '••••'}
                                                    </span>
                                                    <button
                                                        onClick={() => setShowPinUserId(isPinShown ? null : u.id)}
                                                        className="text-slate-400 hover:text-slate-700"
                                                        title={isPinShown ? "Hide PIN" : "Reveal PIN"}
                                                    >
                                                        <i data-lucide={isPinShown ? "eye-off" : "eye"} className="w-3.5 h-3.5"></i>
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setEditingUser({ ...u, securityPin: u.securityPin || '1234' })}
                                                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition"
                                                >
                                                    Edit / Reset PIN
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add User */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <i data-lucide="user-plus" className="w-4 h-4 text-blue-700"></i>
                                Provision New Platform User
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Employee ID *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEmpId}
                                        onChange={(e) => setNewEmpId(e.target.value)}
                                        placeholder="e.g. EMP-1005 or CUST-3001"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Security PIN *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value)}
                                        placeholder="4-digit PIN (e.g. 1234)"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                    placeholder="e.g. Srikant Iyer"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Role *</label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                                    >
                                        <option value="CUSTOMER">Customer / User</option>
                                        <option value="HELPDESK">Support / Helpdesk Team</option>
                                        <option value="STAFF">Complaint Handling Staff</option>
                                        <option value="MANAGER">Team Leader / Manager</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGEMENT">Executive Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                                    <select
                                        value={newDepartmentId}
                                        onChange={(e) => setNewDepartmentId(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                                    >
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="name@nexusres.com"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        value={newDesignation}
                                        onChange={(e) => setNewDesignation(e.target.value)}
                                        placeholder="e.g. Senior Resolution Specialist"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs"
                                >
                                    {isSubmitting ? 'Provisioning...' : 'Provision User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit User & Reset PIN */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div>
                                <h3 className="text-sm font-black text-slate-900">Edit User & Reset Security PIN</h3>
                                <p className="text-[11px] text-slate-500 font-mono">Employee ID: {editingUser.employeeId}</p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingUser.fullName}
                                        onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Security PIN (Reset)</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={editingUser.securityPin || '1234'}
                                        onChange={(e) => setEditingUser({ ...editingUser, securityPin: e.target.value })}
                                        className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono font-black text-amber-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Role</label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                                    >
                                        <option value="CUSTOMER">Customer / User</option>
                                        <option value="HELPDESK">Support / Helpdesk Team</option>
                                        <option value="STAFF">Complaint Handling Staff</option>
                                        <option value="MANAGER">Team Leader / Manager</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGEMENT">Executive Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                                    <select
                                        value={editingUser.departmentId}
                                        onChange={(e) => setEditingUser({ ...editingUser, departmentId: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                                    >
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                                <input
                                    type="text"
                                    value={editingUser.designation || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, designation: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save User Updates'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 9. MANAGEMENT REPORTS & ANALYTICS VIEW
// ==========================================
function ManagementReportsView({ stats, complaints, departments, feedbacks, channels }) {
    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [stats, complaints]);

    const totalTickets = complaints.length;
    const resolvedTickets = complaints.filter(c => c.status === 'RESOLVED').length;
    const breachedTickets = complaints.filter(c => c.slaBreached).length;
    const escalatedTickets = complaints.filter(c => c.escalated || c.status === 'ESCALATED').length;
    const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <i data-lucide="bar-chart-3" className="w-5 h-5 text-blue-700"></i>
                        Executive Complaint Intelligence & Service Quality Analytics
                    </h2>
                    <p className="text-xs text-slate-500">
                        Macro-level visibility across SLA performance, customer satisfaction indices, department turnaround, and root causes.
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 self-start md:self-auto"
                >
                    <i data-lucide="printer" className="w-4 h-4"></i>
                    Export Executive Brief
                </button>
            </div>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500">Resolution Rate</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{resolutionRate}%</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{resolvedTickets} of {totalTickets} closed</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500">SLA Compliance</span>
                    <p className="text-2xl font-black text-emerald-700 mt-1">{stats?.slaComplianceRate || 94}%</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Target: 90% Adherence</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500">Customer CSAT</span>
                    <p className="text-2xl font-black text-amber-600 mt-1">{stats?.avgCsat || 4.8} ★</p>
                    <p className="text-[10px] text-amber-700 font-bold mt-0.5">Scale of 5.0</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500">Net Promoter (NPS)</span>
                    <p className="text-2xl font-black text-purple-900 mt-1">+{stats?.npsScore || 75}</p>
                    <p className="text-[10px] text-purple-700 font-bold mt-0.5">Executive Benchmark</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500">First Contact (FCR)</span>
                    <p className="text-2xl font-black text-blue-900 mt-1">{stats?.fcrRate || 100}%</p>
                    <p className="text-[10px] text-blue-700 font-bold mt-0.5">No Escalated Bounce</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500">Avg Resolution</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats?.avgResolutionHours || '3.4h'}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">End-to-End Cycle</p>
                </div>
            </div>

            {/* Department Service Quality Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Department Service Quality Scorecard</h3>
                        <p className="text-xs text-slate-500">Comparing resolution efficiency and escalation containment across operational units</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{departments.length} Functional Queues</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {departments.map(d => {
                        const deptTickets = complaints.filter(c => c.departmentId === d.id);
                        const resolved = deptTickets.filter(c => c.status === 'RESOLVED').length;
                        const breached = deptTickets.filter(c => c.slaBreached).length;
                        const escalated = deptTickets.filter(c => c.escalated).length;
                        const compliance = deptTickets.length > 0 ? Math.round(((deptTickets.length - breached) / deptTickets.length) * 100) : 100;

                        return (
                            <div key={d.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="min-w-0 md:w-1/3">
                                    <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                                    <p className="text-[11px] text-slate-500">{d.headName} • {d.headEmail}</p>
                                </div>

                                <div className="flex items-center gap-6 text-xs font-medium">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Total Volume</span>
                                        <span className="font-bold text-slate-900">{deptTickets.length} Complaints</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Resolved</span>
                                        <span className="font-bold text-emerald-700">{resolved} closed</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Escalated</span>
                                        <span className="font-bold text-amber-700">{escalated}</span>
                                    </div>
                                    <div className="w-28">
                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                            <span className="text-slate-500">SLA Adherence</span>
                                            <span className="font-bold text-slate-900">{compliance}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-1.5 rounded-full ${compliance >= 90 ? 'bg-emerald-600' : 'bg-rose-500'}`} style={{ width: `${compliance}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Root-Cause & Channel Matrix Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Category & Root Cause Analysis */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Grievance Root-Cause Categorization</h3>
                    <div className="space-y-3">
                        {[
                            { category: 'Billing & Financial Transactions', count: complaints.filter(c => c.category === 'BILLING').length, pct: 42, color: 'bg-indigo-600' },
                            { category: 'Technical Systems & Platform Outages', count: complaints.filter(c => c.category === 'TECHNICAL').length, pct: 28, color: 'bg-blue-600' },
                            { category: 'Logistics, Shipping & Delayed Transit', count: complaints.filter(c => c.category === 'LOGISTICS').length, pct: 18, color: 'bg-amber-600' },
                            { category: 'Customer Service & Account Administration', count: complaints.filter(c => c.category === 'CUSTOMER_SERVICE').length, pct: 12, color: 'bg-emerald-600' }
                        ].map((c, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-800">{c.category}</span>
                                    <span className="font-mono font-bold text-slate-700">{c.count} tickets ({c.pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Omnichannel Inbound Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Inbound Channel Share & Response</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(stats?.channels || channels).slice(0, 6).map(ch => {
                            const meta = getChannel(ch.id);
                            return (
                                <div key={ch.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg ${meta.bg} ${meta.text} flex items-center justify-center`}>
                                            <i data-lucide={meta.icon} className="w-3.5 h-3.5"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 truncate max-w-[90px]">{meta.label}</p>
                                            <p className="text-[10px] text-slate-500">{ch.count || 0} tickets</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs font-black text-slate-800">{ch.percentage || 0}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 10. LOGIN VIEW (Employee ID & Security PIN)
// ==========================================
function LoginView({ onLogin, initialError }) {
    const [empId, setEmpId] = vState('EMP-1001');
    const [securityPin, setSecurityPin] = vState('1234');
    const [showPin, setShowPin] = vState(false);
    const [isLoading, setIsLoading] = vState(false);
    const [error, setError] = vState(initialError || null);

    vEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [isLoading, error, showPin]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        if (!empId.trim()) {
            setError('Please enter your Employee ID or Account ID.');
            return;
        }
        if (!securityPin.trim()) {
            setError('Please enter your 4-digit Security PIN.');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin(empId.trim(), securityPin.trim());
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectRole = (roleEmpId) => {
        setEmpId(roleEmpId);
        setSecurityPin('1234');
        setError(null);
    };

    const [categoryFilter, setCategoryFilter] = vState('ALL');

    const DEMO_ROLES = [
        // ---------------------------------------------------------
        // 8 EMPLOYEES (Helpdesk & Handling Staff)
        // ---------------------------------------------------------
        {
            category: 'EMPLOYEE',
            role: 'HELPDESK',
            roleTitle: 'Employee / Helpdesk',
            empId: 'EMP-1001',
            pin: '1234',
            name: 'Priya Sharma',
            department: 'Customer Success & Operations',
            designation: 'Helpdesk Central Dispatcher & Intake Lead',
            purpose: 'Receive omnichannel complaints, triage tickets & assign functional staff.',
            icon: 'headphones',
            badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1002',
            pin: '1234',
            name: 'Rajesh Narayanan',
            department: 'Billing, Payments & Invoicing',
            designation: 'Senior Resolution Specialist (Billing & Disputes)',
            purpose: 'Reconcile gateway duplicate charges, calculate compensation & issue refunds.',
            icon: 'credit-card',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1003',
            pin: '1234',
            name: 'Soundarya Padmanabhan',
            department: 'Technical Support & Platform Systems',
            designation: 'Lead Systems Engineer & Technical Triage Resolver',
            purpose: 'Troubleshoot API rate limits, database locks, and cloud service disruptions.',
            icon: 'terminal',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1004',
            pin: '1234',
            name: 'Senthil Murugan',
            department: 'Logistics, Shipping & Order Fulfillment',
            designation: 'Logistics & Shipping Resolution Specialist',
            purpose: 'Investigate freight invoice delays, damaged packages, and waybill disputes.',
            icon: 'truck',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1005',
            pin: '1234',
            name: 'Deepa Varma',
            department: 'Billing, Payments & Invoicing',
            designation: 'Senior Invoicing & Dispute Settlement Analyst',
            purpose: 'GST credit memo reconciliation, corporate debit anomalies, and ledger credits.',
            icon: 'file-text',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1006',
            pin: '1234',
            name: 'Arun Prasad',
            department: 'Technical Support & Platform Systems',
            designation: 'Tier-2 Cloud Infrastructure & API Resolver',
            purpose: 'Tenant isolation bugs, OAuth token expires, and webhook queue bottlenecks.',
            icon: 'cpu',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1007',
            pin: '1234',
            name: 'Kavitha Krishnan',
            department: 'Customer Success & Operations',
            designation: 'Senior Customer Experience Care Specialist',
            purpose: 'High-touch enterprise client relations, VIP account disputes, and care review.',
            icon: 'heart-handshake',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },
        {
            category: 'EMPLOYEE',
            role: 'STAFF',
            roleTitle: 'Employee / Staff',
            empId: 'EMP-1008',
            pin: '1234',
            name: 'Manoj Kumar',
            department: 'Logistics, Shipping & Order Fulfillment',
            designation: 'Hardware Logistics & Replacement Officer',
            purpose: 'Express RMA warranty dispatches, carrier claim recoveries, and inventory verification.',
            icon: 'package-check',
            badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        },

        // ---------------------------------------------------------
        // 5 CUSTOMERS
        // ---------------------------------------------------------
        {
            category: 'CUSTOMER',
            role: 'CUSTOMER',
            roleTitle: 'Customer / User',
            empId: 'CUST-2001',
            pin: '1234',
            name: 'Karthik Ramanathan',
            department: 'TechNova Cloud Systems Ltd.',
            designation: 'VP of Enterprise Infrastructure (Enterprise VIP)',
            purpose: 'Submit multi-channel tickets, monitor real-time SLA progress, and rate CSAT.',
            icon: 'user',
            badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        {
            category: 'CUSTOMER',
            role: 'CUSTOMER',
            roleTitle: 'Customer / User',
            empId: 'CUST-2002',
            pin: '1234',
            name: 'Ananya Sundaram',
            department: 'Horizon Digital Studios',
            designation: 'Head of Product Design & CX (Corporate Business)',
            purpose: 'Submit multi-channel tickets, monitor real-time SLA progress, and rate CSAT.',
            icon: 'user',
            badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        {
            category: 'CUSTOMER',
            role: 'CUSTOMER',
            roleTitle: 'Customer / User',
            empId: 'CUST-2003',
            pin: '1234',
            name: 'Vignesh Balasubramanian',
            department: 'CloudScale DevOps Inc.',
            designation: 'Principal Site Reliability Engineer (Corporate Business)',
            purpose: 'Submit multi-channel tickets, monitor real-time SLA progress, and rate CSAT.',
            icon: 'user',
            badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        {
            category: 'CUSTOMER',
            role: 'CUSTOMER',
            roleTitle: 'Customer / User',
            empId: 'CUST-2004',
            pin: '1234',
            name: 'Meenakshi Natarajan',
            department: 'Apex Global FinTech',
            designation: 'Chief Quality Officer (Enterprise VIP)',
            purpose: 'Submit multi-channel tickets, monitor real-time SLA progress, and rate CSAT.',
            icon: 'user',
            badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        {
            category: 'CUSTOMER',
            role: 'CUSTOMER',
            roleTitle: 'Customer / User',
            empId: 'CUST-2005',
            pin: '1234',
            name: 'Harish Ragavendran',
            department: 'Zenith Retail & Logistics',
            designation: 'Operations Lead (Standard Client)',
            purpose: 'Submit multi-channel tickets, monitor real-time SLA progress, and rate CSAT.',
            icon: 'user',
            badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
        },

        // ---------------------------------------------------------
        // 3 HEADS (Department & Escalation Division Leaders)
        // ---------------------------------------------------------
        {
            category: 'HEAD',
            role: 'MANAGER',
            roleTitle: 'Department Head / Leader',
            empId: 'HEAD-3001',
            pin: '1234',
            name: 'Vikram Sengupta',
            department: 'Customer Success & Operations',
            designation: 'Head of Operations & Service Delivery',
            purpose: 'Oversee resolution pipelines, SLA compliance, and authorize multi-level escalations.',
            icon: 'shield-alert',
            badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
        },
        {
            category: 'HEAD',
            role: 'MANAGER',
            roleTitle: 'Department Head / Leader',
            empId: 'HEAD-3002',
            pin: '1234',
            name: 'Dr. Radhika Sundaram',
            department: 'Billing, Payments & Invoicing',
            designation: 'Head of Customer Grievance & Financial QA',
            purpose: 'Approve large financial dispute reversals, goodwill vouchers, and audit billing metrics.',
            icon: 'shield-alert',
            badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
        },
        {
            category: 'HEAD',
            role: 'MANAGER',
            roleTitle: 'Department Head / Leader',
            empId: 'HEAD-3003',
            pin: '1234',
            name: 'Suresh Chandrasekhar',
            department: 'Technical Support & Platform Systems',
            designation: 'Head of Platform Reliability & Systems Support',
            purpose: 'Direct infrastructure outage response, root-cause analyses, and critical SLA breaches.',
            icon: 'shield-alert',
            badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
        },

        // ---------------------------------------------------------
        // ADMIN & EXECUTIVE MANAGEMENT
        // ---------------------------------------------------------
        {
            category: 'ADMIN',
            role: 'ADMIN',
            roleTitle: 'System Admin',
            empId: 'ADM-0001',
            pin: '1234',
            name: 'Sarah Connor',
            department: 'System Administration & IT Governance',
            designation: 'Chief Platform Administrator',
            purpose: 'Manage user credentials, security PIN resets, SLA rules, and system governance.',
            icon: 'shield-check',
            badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
        },
        {
            category: 'ADMIN',
            role: 'MANAGEMENT',
            roleTitle: 'Executive Management',
            empId: 'EMP-5001',
            pin: '1234',
            name: 'Dr. Arvind Ramakrishnan',
            department: 'Executive Board & Service Quality',
            designation: 'VP of Service Quality & Executive Director',
            purpose: 'Review macro analytical reports, CSAT trends, first-contact resolution, and operational KPIs.',
            icon: 'bar-chart-3',
            badgeBg: 'bg-purple-100 text-purple-800 border-purple-200'
        }
    ];

    const displayedRoles = DEMO_ROLES.filter(r => {
        if (categoryFilter === 'ALL') return true;
        if (categoryFilter === 'EMPLOYEE') return r.category === 'EMPLOYEE';
        if (categoryFilter === 'CUSTOMER') return r.category === 'CUSTOMER';
        if (categoryFilter === 'HEAD') return r.category === 'HEAD';
        if (categoryFilter === 'ADMIN') return r.category === 'ADMIN';
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full space-y-8">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-700 text-white shadow-md mb-2">
                        <i data-lucide="layers" className="w-8 h-8"></i>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        NEXUS RESOLUTION
                    </h1>
                    <p className="text-sm font-semibold text-blue-800 uppercase tracking-wider">
                        Centralized Omnichannel Complaint Resolution Platform
                    </p>
                    <p className="text-xs text-slate-500 max-w-xl mx-auto">
                        Secure role-based portal for Customers, Helpdesk Officers, Resolution Staff, Department Heads, System Administrators, and Executive Management.
                    </p>
                </div>

                {/* Main Card: Login Form */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-lg mx-auto w-full space-y-5">
                    <div className="border-b border-slate-100 pb-4 text-center">
                        <h2 className="text-base font-bold text-slate-900">Portal Security Authentication</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Enter your Employee ID, Customer ID, or Head ID with your 4-digit Security PIN</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                            <i data-lucide="alert-circle" className="w-4 h-4 shrink-0 mt-0.5 text-rose-600"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>Account ID (EMP / CUST / HEAD / ADM)</span>
                                <span className="text-[10px] text-slate-400 font-normal">e.g. EMP-1001, CUST-2001, HEAD-3001</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <i data-lucide="id-card" className="w-4 h-4"></i>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={empId}
                                    onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                                    placeholder="Enter Employee, Customer, or Head ID (e.g. EMP-1001 or CUST-2001)"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 uppercase"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>4-Digit Security PIN</span>
                                <span className="text-[10px] text-slate-400 font-normal">Default Demo PIN: 1234</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <i data-lucide="lock" className="w-4 h-4"></i>
                                </div>
                                <input
                                    type={showPin ? 'text' : 'password'}
                                    required
                                    maxLength={6}
                                    value={securityPin}
                                    onChange={(e) => setSecurityPin(e.target.value)}
                                    placeholder="Enter 4-digit Security PIN"
                                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-900 tracking-widest focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPin(!showPin)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                                    title={showPin ? "Hide PIN" : "Show PIN"}
                                >
                                    <i data-lucide={showPin ? "eye-off" : "eye"} className="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Verifying Credentials...</span>
                                </>
                            ) : (
                                <>
                                    <i data-lucide="key-round" className="w-4 h-4"></i>
                                    <span>Secure Sign In with PIN</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Role Quick Selector Cards */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <i data-lucide="users" className="w-4 h-4 text-blue-700"></i>
                                Role-Based Access Quick Selector
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Select from the 8 Employees, 5 Customers, 3 Heads, or Admins below to instantly autofill ID and PIN (1234):
                            </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
                            PIN: 1234
                        </span>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoryFilter('ALL')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                categoryFilter === 'ALL'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>All Accounts</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">18</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter('EMPLOYEE')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                categoryFilter === 'EMPLOYEE'
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                        >
                            <i data-lucide="briefcase" className="w-3.5 h-3.5"></i>
                            <span>8 Employees</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/50">8</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter('CUSTOMER')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                categoryFilter === 'CUSTOMER'
                                    ? 'bg-blue-700 text-white shadow-xs'
                                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                            }`}
                        >
                            <i data-lucide="user" className="w-3.5 h-3.5"></i>
                            <span>5 Customers</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-200/50">5</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter('HEAD')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                categoryFilter === 'HEAD'
                                    ? 'bg-amber-700 text-white shadow-xs'
                                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            }`}
                        >
                            <i data-lucide="shield-alert" className="w-3.5 h-3.5"></i>
                            <span>3 Heads</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200/50">3</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter('ADMIN')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                categoryFilter === 'ADMIN'
                                    ? 'bg-rose-700 text-white shadow-xs'
                                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                            }`}
                        >
                            <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                            <span>Admin & Exec</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-200/50">2</span>
                        </button>
                    </div>

                    {/* Account Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {displayedRoles.map((r) => {
                            const isSelected = empId === r.empId;
                            return (
                                <div
                                    key={r.empId}
                                    onClick={() => handleSelectRole(r.empId)}
                                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                                        isSelected
                                            ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.badgeBg}`}>
                                                {r.roleTitle}
                                            </span>
                                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                                                {r.empId}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                                        <p className="text-[11px] font-semibold text-slate-700 leading-tight">{r.designation}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{r.department}</p>
                                    </div>

                                    <p className="text-[10px] text-slate-600 leading-snug line-clamp-2">
                                        {r.purpose}
                                    </p>

                                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                        <span className="text-[9px] text-slate-400 font-mono">PIN: 1234</span>
                                        <span className={`text-[10px] font-bold flex items-center gap-1 ${isSelected ? 'text-blue-700 font-black' : 'text-slate-600'}`}>
                                            {isSelected ? '✓ Selected' : 'Use Account →'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Workflow Roadmap Footer */}
                <div className="p-4 bg-white/70 border border-slate-200 rounded-2xl text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">Platform Core Workflow:</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600">
                        <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 font-bold">1. Customer (Register)</span>
                        <span>→</span>
                        <span className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200 font-bold">2. Helpdesk (Triage & Assign)</span>
                        <span>→</span>
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">3. Assigned Staff (Resolve)</span>
                        <span>→</span>
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">4. Manager/Head (SLA & Escalation)</span>
                        <span>→</span>
                        <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200 font-bold">5. Customer Feedback</span>
                    </div>
                </div>
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
window.WorkflowBanner = WorkflowBanner;
window.UserManagementView = UserManagementView;
window.ManagementReportsView = ManagementReportsView;
window.LoginView = LoginView;


