// Nexus Resolution - Omnichannel Complaint Management Modals
const { useState: mState, useEffect: mEffect } = React;

// ==========================================
// 1. ASSIGN / RE-ROUTE TICKET MODAL
// ==========================================
function AssignTicketModal({ ticket, departments, users, currentUser, onClose, onSuccess, showToast }) {
    const [selectedDept, setSelectedDept] = mState(ticket.departmentId || 1);
    const [selectedAgent, setSelectedAgent] = mState(ticket.assignedAgentId || 1);
    const [notes, setNotes] = mState('');
    const [isSubmitting, setIsSubmitting] = mState(false);

    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, []);

    const supportAgents = users.filter(u => u.role === 'STAFF' || u.role === 'HELPDESK' || u.role === 'MANAGER' || u.role === 'HR');

    const handleAssign = async () => {
        setIsSubmitting(true);
        try {
            const updated = await apiCall(`/complaints/${ticket.id}/assign`, {
                method: 'POST',
                body: JSON.stringify({
                    assignedAgentId: selectedAgent,
                    departmentId: selectedDept,
                    assignmentNotes: notes || `Direct queue assignment to ${departments.find(d => d.id === Number(selectedDept))?.name}`,
                    assignedBy: currentUser.fullName
                })
            });
            setIsSubmitting(false);
            onSuccess(updated);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Failed to assign ticket: ' + err.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                            <i data-lucide="user-check" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Assign / Re-Route Complaint</h3>
                            <p className="text-xs text-slate-500">{ticket.ticketNumber} • {ticket.customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Target Department Queue *
                        </label>
                        <select
                            value={selectedDept}
                            onChange={(e) => {
                                const deptId = Number(e.target.value);
                                setSelectedDept(deptId);
                                const agentInDept = supportAgents.find(a => a.departmentId === deptId);
                                if (agentInDept) setSelectedAgent(agentInDept.id);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        >
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Assigned Support Specialist / Officer *
                        </label>
                        <select
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        >
                            {supportAgents.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.fullName} — {a.designation} ({a.departmentName})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Routing & Triage Notes
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add specific context, customer account priority, or instructions for the assignee..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                        <i data-lucide="check" className="w-4 h-4"></i>
                        {isSubmitting ? 'Routing...' : 'Confirm Assignment'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 2. ESCALATE TICKET WORKFLOW MODAL
// ==========================================
function EscalateTicketModal({ ticket, currentUser, onClose, onSuccess, showToast }) {
    const [tier, setTier] = mState('TIER_2');
    const [reason, setReason] = mState('SLA Breach Risk (Approaching target deadline)');
    const [customReason, setCustomReason] = mState('');
    const [escalatedTo, setEscalatedTo] = mState('Priya (Chief Grievance Officer & Operations Head)');
    const [notes, setNotes] = mState('');
    const [isSubmitting, setIsSubmitting] = mState(false);

    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, []);

    const handleEscalate = async () => {
        setIsSubmitting(true);
        const finalReason = customReason.trim() || reason;
        try {
            const updated = await apiCall(`/complaints/${ticket.id}/escalate`, {
                method: 'POST',
                body: JSON.stringify({
                    escalationTier: tier,
                    escalationReason: finalReason,
                    escalatedTo,
                    escalatedBy: currentUser.fullName,
                    notes
                })
            });
            setIsSubmitting(false);
            onSuccess(updated);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Failed to escalate: ' + err.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-amber-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                            <i data-lucide="alert-octagon" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Initiate Escalation Workflow</h3>
                            <p className="text-xs text-slate-500">{ticket.ticketNumber} • {ticket.subject}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-900">
                    <p className="font-bold flex items-center gap-1.5">
                        <i data-lucide="alert-triangle" className="w-4 h-4"></i>
                        High-Priority Escalation Notice
                    </p>
                    <p className="mt-0.5 text-amber-800">
                        Escalating elevates supervision tier, notifies senior executives, and recalculates priority handling.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Escalation Hierarchy Tier *
                        </label>
                        <select
                            value={tier}
                            onChange={(e) => setTier(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                        >
                            <option value="TIER_1">Tier 1: Senior Subject Matter Specialist</option>
                            <option value="TIER_2">Tier 2: Team Lead & Technical Escalations</option>
                            <option value="TIER_3">Tier 3: Department Operations Manager (Priya)</option>
                            <option value="TIER_4">Tier 4: Executive Escalation / Director of CX</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Escalation Reason *
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                        >
                            <option value="SLA Breach Risk (Approaching target deadline)">SLA Breach Risk (Approaching target deadline)</option>
                            <option value="High VIP Customer Impact & Revenue At Risk">High VIP Customer Impact & Revenue At Risk</option>
                            <option value="Critical Outage / Platform Technical Impasse">Critical Outage / Platform Technical Impasse</option>
                            <option value="Customer Demanded Supervisor / Executive Review">Customer Demanded Supervisor / Executive Review</option>
                            <option value="Disputed Financial Settlement Over Policy Limit">Disputed Financial Settlement Over Policy Limit</option>
                            <option value="Repeated Ingestion Across Multiple Channels">Repeated Ingestion Across Multiple Channels</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Designated Escalation Manager
                        </label>
                        <input
                            type="text"
                            value={escalatedTo}
                            onChange={(e) => setEscalatedTo(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Direct Intervention Notes
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Detail why standard resolution was insufficient and required action..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEscalate}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                        <i data-lucide="zap" className="w-4 h-4"></i>
                        {isSubmitting ? 'Escalating...' : 'Trigger Escalation'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 3. CUSTOMER FEEDBACK (CSAT & NPS) MODAL
// ==========================================
function CustomerFeedbackModal({ ticket, currentUser, onClose, onSuccess, showToast }) {
    const [rating, setRating] = mState(ticket.feedback?.rating || 5);
    const [npsScore, setNpsScore] = mState(ticket.feedback?.npsScore || 10);
    const [fcr, setFcr] = mState(ticket.feedback?.fcr !== false);
    const [comments, setComments] = mState(ticket.feedback?.comments || '');
    const [isSubmitting, setIsSubmitting] = mState(false);

    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [rating]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await apiCall(`/complaints/${ticket.id}/feedback`, {
                method: 'POST',
                body: JSON.stringify({
                    rating,
                    npsScore,
                    fcr,
                    comments,
                    customerName: currentUser.fullName
                })
            });
            setIsSubmitting(false);
            onSuccess(res.feedback);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Failed to record feedback: ' + err.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                            <i data-lucide="star" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Customer Feedback & CSAT</h3>
                            <p className="text-xs text-slate-500">{ticket.ticketNumber} • {ticket.customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                            Overall Customer Satisfaction (CSAT)
                        </label>
                        <div className="flex items-center justify-center gap-2 py-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1.5 transition transform hover:scale-125 focus:outline-none"
                                >
                                    <i
                                        data-lucide="star"
                                        className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                    ></i>
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-xs font-semibold text-slate-600 mt-1">
                            {rating === 5 ? 'Exceptional Service (5/5)' :
                             rating === 4 ? 'Very Satisfied (4/5)' :
                             rating === 3 ? 'Neutral / Acceptable (3/5)' :
                             rating === 2 ? 'Needs Improvement (2/5)' : 'Poor Experience (1/5)'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Net Promoter Score (Likelihood to recommend: 0 to 10)
                        </label>
                        <div className="flex items-center gap-1 justify-between">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setNpsScore(val)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                                        npsScore === val
                                            ? val >= 9 ? 'bg-emerald-600 text-white' : val >= 7 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <input
                            type="checkbox"
                            id="fcr-check"
                            checked={fcr}
                            onChange={(e) => setFcr(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                        />
                        <label htmlFor="fcr-check" className="text-xs font-semibold text-slate-800 cursor-pointer">
                            First Contact Resolution (Issue was resolved without repetitive callbacks)
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Customer Remarks & Testimonial
                        </label>
                        <textarea
                            rows={3}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Share detailed feedback on agent demeanor, turnaround time, or communication clarity..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                        <i data-lucide="check" className="w-4 h-4"></i>
                        {isSubmitting ? 'Saving...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 4. TAKE ACTION & RESOLVE MODAL
// ==========================================
function TakeActionModal({ ticket, currentUser, onClose, onSuccess, showToast }) {
    const [actionNotes, setActionNotes] = mState('');
    const [status, setStatus] = mState('RESOLVED');
    const [resolutionSummary, setResolutionSummary] = mState('');
    const [resolvedAmount, setResolvedAmount] = mState(ticket.resolvedAmount || '');
    const [isSubmitting, setIsSubmitting] = mState(false);

    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, []);

    const handleAction = async () => {
        setIsSubmitting(true);
        try {
            const res = await apiCall(`/complaints/${ticket.id}/hr-action`, {
                method: 'POST',
                body: JSON.stringify({
                    hrName: currentUser.fullName,
                    hrEmployeeId: currentUser.employeeId,
                    actionNotes: actionNotes || 'Formal action and resolution applied by operations officer.',
                    status,
                    resolutionSummary: resolutionSummary || 'Resolved per corporate quality policies.',
                    resolvedAmount: resolvedAmount || ticket.resolvedAmount
                })
            });
            setIsSubmitting(false);
            onSuccess(res);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Action failed: ' + err.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                            <i data-lucide="shield-check" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Record Operational Resolution</h3>
                            <p className="text-xs text-slate-500">{ticket.ticketNumber} • {ticket.customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            New Complaint Status *
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        >
                            <option value="IN_PROGRESS">IN_PROGRESS (Under Active Investigation)</option>
                            <option value="RESOLVED">RESOLVED (Redressal Completed & Customer Notified)</option>
                            <option value="CLOSED">CLOSED (Final Archive)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Investigation & Operational Action Notes *
                        </label>
                        <textarea
                            rows={3}
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            placeholder="Detail steps taken: system logs checked, vendor contacted, replacement issued..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Resolution Summary for Customer Statement
                        </label>
                        <textarea
                            rows={2}
                            value={resolutionSummary}
                            onChange={(e) => setResolutionSummary(e.target.value)}
                            placeholder="Summary statement visible on resolution slip and client portal..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Settlement / Approved Value (₹)
                        </label>
                        <input
                            type="text"
                            value={resolvedAmount}
                            onChange={(e) => setResolvedAmount(e.target.value)}
                            placeholder="e.g. ₹14,800 or 100% Replacement"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAction}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                        <i data-lucide="check" className="w-4 h-4"></i>
                        {isSubmitting ? 'Recording...' : 'Record Resolution'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 5. ADJUST COMPENSATION AMOUNT MODAL
// ==========================================
function AdjustCompensationModal({ ticket, hrUser, onClose, onSuccess, onProceedToDisburse, showToast }) {
    const rawClaimed = ticket.originalClaimedAmount || ticket.claimedAmount;
    const claimedNum = parseFloat(String(rawClaimed || '').replace(/[^0-9.]/g, '')) || 0;

    const initialAmount = (() => {
        if (ticket.hrApprovedAmount) {
            const clean = ticket.hrApprovedAmount.replace(/[^0-9.]/g, '');
            if (clean && !isNaN(clean)) return clean;
        }
        if (claimedNum > 0) return String(claimedNum);
        return '14800';
    })();

    const [amount, setAmount] = mState(initialAmount);
    const [reason, setReason] = mState('Employee inflated claim unwantedly: transport bill audited and capped at ₹32,000 policy limit');
    const [isSubmitting, setIsSubmitting] = mState(false);

    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [amount]);

    const currentNum = parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
    const diff = Math.abs(currentNum - claimedNum);

    const handleSave = async (andDisburse = false) => {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            showToast('Please enter a valid numeric compensation figure', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiCall(`/complaints/${ticket.id}/adjust-amount`, {
                method: 'POST',
                body: JSON.stringify({
                    newAmount: parseFloat(amount),
                    adjustmentReason: reason,
                    hrName: hrUser.fullName,
                    hrEmployeeId: hrUser.employeeId
                })
            });
            setIsSubmitting(false);
            if (andDisburse) onProceedToDisburse(res);
            else onSuccess(res);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Adjustment failed: ' + err.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                            <i data-lucide="sliders" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Adjust & Sanction Claim Amount</h3>
                            <p className="text-xs text-slate-500">{ticket.ticketNumber} • {ticket.customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Claimed by Customer:</span>
                        <span className="font-mono font-bold text-slate-800">{rawClaimed || '₹0'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Sanctioned Value:</span>
                        <span className="font-mono font-black text-emerald-700">₹{currentNum.toLocaleString('en-IN')}</span>
                    </div>
                    {claimedNum > 0 && currentNum < claimedNum && (
                        <div className="text-amber-800 font-semibold pt-1 border-t border-amber-200">
                            Anti-Inflation Reduction: -₹{diff.toLocaleString('en-IN')} deducted
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Approved Amount (₹) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-2.5 font-bold text-sm text-slate-500">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Audit Justification Reason *
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                        >
                            <option value="Employee inflated claim unwantedly: transport bill audited and capped at ₹32,000 policy limit">
                                Employee inflated claim unwantedly: transport bill audited and capped at ₹32,000 policy limit
                            </option>
                            <option value="Exceeds corporate reimbursement ceiling for employee grade">
                                Exceeds corporate reimbursement ceiling for employee grade
                            </option>
                            <option value="Missing proof of purchase / partial receipt substantiation">
                                Missing proof of purchase / partial receipt substantiation
                            </option>
                            <option value="Mutually agreed final revised settlement">
                                Mutually agreed final revised settlement
                            </option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                    >
                        Save Adjusted Figure
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                    >
                        Save & Disburse
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 6. DISBURSE PAYMENT & RESOLVE MODAL
// ==========================================
function CompensationPaymentModal({ ticket, hrUser, onClose, onSuccess, showToast }) {
    const raw = ticket.hrApprovedAmount || ticket.claimedAmount || '14800';
    const cleanNum = parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 14800;

    const [amount, setAmount] = mState(cleanNum);
    const [method, setMethod] = mState('Corporate Instant IMPS / NEFT Gateway');
    const [notes, setNotes] = mState('');
    const [isSubmitting, setIsSubmitting] = mState(false);

    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, []);

    const handleDisburse = async () => {
        setIsSubmitting(true);
        try {
            const res = await apiCall(`/complaints/${ticket.id}/compensate`, {
                method: 'POST',
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    paymentMethod: method,
                    settlementNotes: notes || `Direct compensation refund disbursed through website. Ticket marked RESOLVED.`,
                    hrName: hrUser.fullName,
                    hrEmployeeId: hrUser.employeeId
                })
            });
            setIsSubmitting(false);
            onSuccess(res);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Disbursement failed: ' + err.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                            <i data-lucide="credit-card" className="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Disburse Refund Voucher</h3>
                            <p className="text-xs text-slate-500">{ticket.ticketNumber} • {ticket.customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
                        <span className="text-emerald-900 font-medium">Approved Settlement Total:</span>
                        <span className="font-mono text-base font-black text-emerald-800">₹{amount.toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Disbursement Channel *
                        </label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                        >
                            <option value="Corporate Instant IMPS / NEFT Gateway">Corporate Instant IMPS / NEFT Gateway</option>
                            <option value="Stripe Payment Gateway Reverse Credit">Stripe Payment Gateway Reverse Credit</option>
                            <option value="HDFC Bank Electronic Salary Adjustment Voucher">HDFC Bank Electronic Salary Adjustment Voucher</option>
                            <option value="Direct Electronic Corporate Guarantee Letter">Direct Electronic Corporate Guarantee Letter</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Settlement Ledger Memo
                        </label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Official memo for bank journal, UTR, and customer voucher statement..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDisburse}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                        <i data-lucide="check-circle" className="w-4 h-4"></i>
                        {isSubmitting ? 'Authorizing...' : 'Authorize Disbursement & Mark RESOLVED'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 7. DOWNLOAD / PRINT RESOLUTION SLIP MODAL
// ==========================================
function DownloadSlipModal({ ticket, onClose }) {
    mEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, []);

    const chMeta = getChannel(ticket.channel);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 no-print">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <i data-lucide="printer" className="w-4 h-4 text-blue-700"></i>
                        Official Resolution Certificate & Service Slip
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                            <i data-lucide="printer" className="w-3.5 h-3.5"></i>
                            Print Document
                        </button>
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                            <i data-lucide="x" className="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                {/* Printable Document Body */}
                <div id="printable-ticket-slip" className="border-2 border-slate-900 rounded-2xl p-6 bg-white text-slate-900 space-y-4 font-sans">
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-900 text-white font-black px-2 py-0.5 text-sm rounded">NEXUS</span>
                                <h1 className="text-base font-black tracking-tight">OMNICHANNEL RESOLUTION SERVICE</h1>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Certified Multi-Channel Service Quality & Redressal Statement
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-sm font-black text-blue-700">{ticket.ticketNumber}</p>
                            <span className="inline-block bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase mt-1">
                                {ticket.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Account</p>
                            <p className="font-bold text-slate-900 text-sm mt-0.5">{ticket.customerName}</p>
                            <p className="text-slate-500">{ticket.companyName} • {ticket.customerEmail}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Intake Channel & Origin</p>
                            <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <i data-lucide={chMeta.icon} className="w-3.5 h-3.5 text-blue-700"></i>
                                {chMeta.label}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">{ticket.channelReference}</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Grievance Subject</p>
                        <p className="font-bold text-slate-900">{ticket.subject}</p>
                        <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {ticket.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-200 py-3">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Action Taken By</p>
                            <p className="font-semibold text-slate-800">{ticket.actionTakenBy || 'Operations Lead'}</p>
                            <p className="text-[10px] text-slate-400">{ticket.actionTimestamp || ticket.createdAt}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Settlement / Sanctioned Total</p>
                            <p className="font-mono text-sm font-black text-emerald-700">{ticket.resolvedAmount || 'Non-financial Redressal'}</p>
                        </div>
                    </div>

                    {ticket.resolutionSummary && (
                        <div className="text-xs bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                            <p className="text-[10px] font-bold text-emerald-900 uppercase mb-1">Official Resolution Summary</p>
                            <p className="text-emerald-950 font-medium">{ticket.resolutionSummary}</p>
                        </div>
                    )}

                    {ticket.feedback && (
                        <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-amber-900 uppercase">Customer Service Quality Score</p>
                                <p className="font-bold text-amber-950 mt-0.5">Rating: {ticket.feedback.rating}/5 Stars • NPS: {ticket.feedback.npsScore}/10</p>
                                <p className="text-[11px] text-amber-900 italic mt-0.5">"{ticket.feedback.comments}"</p>
                            </div>
                            <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 text-[10px] text-slate-400 border-t border-slate-200">
                        <span>Certified by Nexus Resolution Centralized Gateway</span>
                        <span>Official Security Timestamp: 2026-08-28</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 8. TICKET DETAIL & TIMELINE MODAL
// ==========================================
function TicketDetailModal({ ticket, currentUser, onClose, onAssign, onEscalate, onFeedback, onAction, onAdjust, onCompensate, onDownload, onRefresh, showToast }) {
    const [messages, setMessages] = mState([]);
    const [auditTimeline, setAuditTimeline] = mState([]);
    const [replyText, setReplyText] = mState('');
    const [isInternal, setIsInternal] = mState(false);
    const [isSending, setIsSending] = mState(false);

    mEffect(() => {
        apiCall(`/complaints/${ticket.id}`).then(res => {
            if (res) {
                setMessages(res.messages || []);
                setAuditTimeline(res.auditTimeline || []);
            }
        });
        if (window.lucide) window.lucide.createIcons();
    }, [ticket.id]);

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setIsSending(true);
        try {
            const res = await apiCall(`/complaints/${ticket.id}/reply`, {
                method: 'POST',
                body: JSON.stringify({
                    message: replyText.trim(),
                    isInternal,
                    senderName: currentUser.fullName,
                    senderEmail: currentUser.email
                })
            });
            setMessages([...messages, res]);
            setReplyText('');
            setIsSending(false);
            showToast('Message posted to ticket conversation');
        } catch (err) {
            setIsSending(false);
            showToast('Failed to post reply: ' + err.message, 'error');
        }
    };

    const chMeta = getChannel(ticket.channel);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${chMeta.bg} ${chMeta.text} flex items-center justify-center font-bold`}>
                            <i data-lucide={chMeta.icon} className="w-5 h-5"></i>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-black text-slate-900">{ticket.ticketNumber}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${chMeta.bg} ${chMeta.text}`}>
                                    {chMeta.label}
                                </span>
                                {ticket.escalated && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                        Escalated
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">{ticket.subject}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDownload(ticket)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                            title="Print Resolution Slip"
                        >
                            <i data-lucide="printer" className="w-3.5 h-3.5"></i>
                            Slip
                        </button>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700">
                            <i data-lucide="x" className="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                {/* Quick Action Toolbar */}
                <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => onAssign(ticket)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                            <i data-lucide="user-check" className="w-3.5 h-3.5"></i>
                            Assign Queue
                        </button>
                        <button
                            onClick={() => onEscalate(ticket)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                            <i data-lucide="alert-octagon" className="w-3.5 h-3.5"></i>
                            Escalate Tier
                        </button>
                        <button
                            onClick={() => onAdjust(ticket)}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                            <i data-lucide="sliders" className="w-3.5 h-3.5"></i>
                            Adjust Amount
                        </button>
                        <button
                            onClick={() => onCompensate(ticket)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                            <i data-lucide="credit-card" className="w-3.5 h-3.5"></i>
                            Disburse & Resolve
                        </button>
                        <button
                            onClick={() => onAction(ticket)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                            <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                            Record Action
                        </button>
                    </div>

                    <button
                        onClick={() => onFeedback(ticket)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                        <i data-lucide="star" className="w-3.5 h-3.5"></i>
                        Customer Review (CSAT)
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Customer & Account</span>
                            <p className="font-bold text-slate-900">{ticket.customerName}</p>
                            <p className="text-slate-500 truncate">{ticket.companyName || 'Corporate Client'}</p>
                            <p className="text-slate-500 truncate">{ticket.customerEmail}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Queue & Assignee</span>
                            <p className="font-bold text-slate-900">{ticket.assignedAgentName || 'Unassigned'}</p>
                            <p className="text-slate-500 truncate">{ticket.departmentName}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">SLA & Countdown</span>
                            <p className={`font-bold ${ticket.slaBreached ? 'text-rose-700' : 'text-emerald-700'}`}>
                                {ticket.slaBreached ? 'SLA BREACHED' : 'SLA ON-TRACK'}
                            </p>
                            <p className="text-slate-500">{ticket.priority} Priority</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Settlement Value</span>
                            <p className="font-mono font-bold text-emerald-700">{ticket.resolvedAmount || ticket.claimedAmount || '—'}</p>
                            <p className="text-[10px] text-slate-500">{ticket.isAmountAdjusted ? 'Audited by Support' : 'Original Claim'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                        <p className="font-bold text-slate-700 mb-1">Detailed Grievance Ingestion Statement:</p>
                        <p className="text-slate-800 leading-relaxed">{ticket.description}</p>
                        <p className="text-[10px] text-slate-400 mt-2">
                            Source Reference: {ticket.channelReference}
                        </p>
                    </div>

                    {/* Timeline & Conversation Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Conversation Thread */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="message-square" className="w-3.5 h-3.5 text-blue-700"></i>
                                Conversation & Customer Updates
                            </h4>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar text-xs">
                                {messages.length === 0 ? (
                                    <p className="text-slate-400 text-center py-4">No thread messages yet.</p>
                                ) : (
                                    messages.map(m => (
                                        <div key={m.id} className={`p-2.5 rounded-xl ${m.isInternal ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-slate-200'}`}>
                                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                                <span className="font-bold text-slate-700">{m.senderName}</span>
                                                <span>{m.createdAt}</span>
                                            </div>
                                            <p className="text-slate-800 leading-relaxed">{m.body || m.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Reply Input */}
                            <div className="space-y-2">
                                <textarea
                                    rows={2}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type response to customer or internal note..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isInternal}
                                            onChange={(e) => setIsInternal(e.target.checked)}
                                            className="rounded text-blue-600 w-3.5 h-3.5"
                                        />
                                        Internal Note
                                    </label>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={isSending || !replyText.trim()}
                                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                                    >
                                        <i data-lucide="send" className="w-3 h-3"></i>
                                        Post Reply
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Immutable Audit Trail */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="history" className="w-3.5 h-3.5 text-slate-700"></i>
                                Immutable SLA & Ingestion Audit Log
                            </h4>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar text-xs">
                                {auditTimeline.length === 0 ? (
                                    <p className="text-slate-400 text-center py-4">Audit entries being loaded...</p>
                                ) : (
                                    auditTimeline.map(a => (
                                        <div key={a.id} className="border-l-2 border-blue-600 pl-2.5 py-1 space-y-0.5">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="font-bold text-slate-800">{a.action}</span>
                                                <span className="text-slate-400">{a.timestamp}</span>
                                            </div>
                                            <p className="text-slate-600 text-[11px]">{a.details}</p>
                                            <p className="text-[10px] text-slate-400">By: {a.performedBy}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export modals to window
window.AssignTicketModal = AssignTicketModal;
window.EscalateTicketModal = EscalateTicketModal;
window.CustomerFeedbackModal = CustomerFeedbackModal;
window.TakeActionModal = TakeActionModal;
window.AdjustCompensationModal = AdjustCompensationModal;
window.CompensationPaymentModal = CompensationPaymentModal;
window.DownloadSlipModal = DownloadSlipModal;
window.TicketDetailModal = TicketDetailModal;
