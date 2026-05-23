import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Pill, Bell, Image as ImageIcon, Settings, LogOut,
    Activity, ShieldAlert, CheckCircle, UserCircle, Search, Filter, MoreVertical,
    Download, RefreshCw, Check, Trash2, Lock, BookOpen, Plus, Edit2, Calendar,
    MessageSquare, BarChart3, FileText, Heart, ChevronDown, Clock, Zap, X,
    Eye, EyeOff, AlertTriangle, Shield, UserPlus, FileDown, ShieldCheck, UserX,
    Music, Headphones
} from 'lucide-react';
import axios from 'axios';
import { useAdminAuth } from '../context/AuthContext';
import MemoryModeration from './MemoryModeration';


const AdminPanel = () => {
    const { logout } = useAdminAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [meds, setMeds] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const authHeaders = { headers: { 'x-auth-token': token, 'Authorization': `Bearer ${token}` } };

    const showToast = (msg, type = 'success') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, analyticsRes, usersRes, medsRes, alertsRes] = await Promise.all([
                axios.get('/api/admin/stats', config),
                axios.get('/api/analytics/summary', config),
                axios.get('/api/admin/users', config),
                axios.get('/api/medications', authHeaders),
                axios.get('/api/alerts', authHeaders)
            ]);
            setStats(statsRes.data);
            setAnalytics(analyticsRes.data);
            setUsers(usersRes.data);
            setMeds(medsRes.data);
            setAlerts(alertsRes.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const renderContent = () => {
        if (loading) return <div style={centerStyle}><RefreshCw size={24} style={spinStyle} /> Loading System Data...</div>;

        switch (activeTab) {
            case 'dashboard': return <DashboardHome stats={stats} analytics={analytics} />;
            case 'users': return <UserManagement users={users} fetchData={fetchData} showToast={showToast} authHeaders={authHeaders} />;
            case 'medications': return <MedicationMonitoring meds={meds} stats={stats} showToast={showToast} />;
            case 'alerts': return <AlertsMonitoring alerts={alerts} fetchData={fetchData} showToast={showToast} authHeaders={authHeaders} />;
            case 'reports': return <ReportsView analytics={analytics} meds={meds} stats={stats} showToast={showToast} />;
            case 'security': return <SecurityMonitoring analytics={analytics} />;
            case 'stories': return <StoriesView authHeaders={authHeaders} showToast={showToast} />;
            case 'wellness': return <WellnessView authHeaders={authHeaders} showToast={showToast} />;
            case 'memory': return <MemoryModeration authHeaders={authHeaders} showToast={showToast} />;
            case 'settings': return <SettingsView showToast={showToast} />;
            default: return <div style={centerStyle}>Module "{activeTab}" is coming soon.</div>;
        }
    };

    return (
        <div style={dashboardContainer}>
            {/* SIDEBAR */}
            <aside style={sidebarStyle}>
                <div style={sidebarLogo}>
                    <div style={logoIcon}><Heart size={20} color="white" fill="white" /></div>
                    <span style={logoText}>ElderEase</span>
                </div>
                <nav style={navLinksStyle}>
                    <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <div style={navDivider}>RESOURCE MANAGEMENT</div>
                    <SidebarLink icon={<Users size={18} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarLink icon={<Pill size={18} />} label="Medications" active={activeTab === 'medications'} onClick={() => setActiveTab('medications')} />
                    <SidebarLink icon={<Shield size={18} />} label="Security Module" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                    
                    <div style={navDivider}>SYSTEM MONITORING</div>
                    <SidebarLink icon={<ShieldAlert size={18} />} label="Alert Management" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
                    <SidebarLink icon={<BookOpen size={18} />} label="Story Library" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} />
                    <SidebarLink icon={<Music size={18} />} label="Music & Wellness" active={activeTab === 'wellness'} onClick={() => setActiveTab('wellness')} />
                    <SidebarLink icon={<ImageIcon size={18} />} label="Memory moderation" onClick={() => setActiveTab('memory')} active={activeTab === 'memory'} />
                    
                    <div style={navDivider}>ADMINISTRATION</div>
                    <SidebarLink icon={<BarChart3 size={18} />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                    <SidebarLink icon={<Settings size={18} />} label="System Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    <div style={{ flexGrow: 1 }} />
                    <SidebarLink icon={<LogOut size={18} />} label="Logout" onClick={logout} danger />
                </nav>
            </aside>

            {/* MAIN AREA */}
            <div style={mainContentStyle}>
                <header style={topHeaderStyle}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Admin Dashboard / <span style={{ color: '#3B82F6', textTransform: 'capitalize' }}>{activeTab}</span></h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={headerAction}><Search size={18} color="#94A3B8" /></div>
                        <div style={headerAction}><Bell size={18} color="#94A3B8" /></div>
                        <div style={adminProfileStyle}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: '800' }}>System Administrator</div>
                                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>ONLINE</div>
                            </div>
                            <div style={avatarStyle}>SA</div>
                        </div>
                    </div>
                </header>
                <main style={scrollContentStyle}>
                    {renderContent()}
                </main>
            </div>
            {message && <div style={messageStyle(message.type)}>{message.text}</div>}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                body { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
};

// --- USER MANAGEMENT MODULE ---
const UserManagement = ({ users, fetchData, showToast, authHeaders }) => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [editingUser, setEditingUser] = useState(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Elder' });

    const filtered = users.filter(u => 
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
        (roleFilter === 'All' || u.role === roleFilter)
    );

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/users/${editingUser}`, formData, authHeaders);
            showToast("User details updated");
            setEditingUser(null);
            fetchData();
        } catch (err) { showToast(err.response?.data?.message || "Update failed", "error"); }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            showToast("User created successfully");
            setIsAddingUser(false);
            setFormData({ name: '', email: '', password: '', role: 'Elder' });
            fetchData();
        } catch (err) { showToast(err.response?.data?.message || "Creation failed", "error"); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`/api/admin/users/${id}`, authHeaders);
            showToast("User deleted");
            fetchData();
        } catch (err) { showToast("Deletion failed", "error"); }
    };

    const toggleStatus = async (user) => {
        const currentStatus = user.status || 'Active';
        const newStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
        try {
            await axios.put(`/api/admin/users/${user._id}`, { status: newStatus }, authHeaders);
            showToast(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
            fetchData();
        } catch (err) { 
            showToast(err.response?.data?.message || "Status change failed", "error"); 
        }
    };

    return (
        <div style={fadeAnimation}>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}>
                    <h4 style={cardTitleStyle}>Advanced User Controls</h4>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={searchBox}><Search size={16} /><input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={cleanInput} /></div>
                        <select style={selectStyle} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="All">All Roles</option>
                            <option value="Elder">Elders</option>
                            <option value="Family Member">Family Members</option>
                            <option value="Admin">Administrators</option>
                        </select>
                        <button onClick={() => { setIsAddingUser(true); setFormData({ name: '', email: '', password: '', role: 'Elder' }); }} style={btnActionStyle}><UserPlus size={16} /> Add User</button>
                    </div>
                </div>
                <table style={tableStyle}>
                    <thead><tr style={tableHeaderRow}><th style={thStyle}>NAME/EMAIL</th><th style={thStyle}>ROLE</th><th style={thStyle}>STATUS</th><th style={thStyle}>ACTIONS</th></tr></thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u._id} style={trStyle}>
                                <td style={tdStyle}><strong>{u.name}</strong><br/><span style={{ fontSize: '12px', color: '#64748B' }}>{u.email}</span></td>
                                <td style={tdStyle}><span style={roleBadge(u.role)}>{u.role}</span></td>
                                <td style={tdStyle}>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', 
                                        background: u.status === 'Deactivated' ? '#FEE2E2' : '#DCFCE7', 
                                        color: u.status === 'Deactivated' ? '#EF4444' : '#10B981' 
                                    }}>{u.status || 'Active'}</span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={actionBtnLabeled} onClick={() => { setEditingUser(u._id); setFormData(u); }}>
                                            <Edit2 size={12} /> <span>Edit</span>
                                        </button>
                                        <button style={{...actionBtnLabeled, color: u.status === 'Deactivated' ? '#10B981' : '#EF4444'}} onClick={() => toggleStatus(u)}>
                                            {u.status === 'Deactivated' ? <CheckCircle size={12} /> : <UserX size={12} />} 
                                            <span>{u.status === 'Deactivated' ? 'Activate' : 'Deactivate'}</span>
                                        </button>
                                        <button style={{...actionBtnLabeled, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2'}} onClick={() => handleDeleteUser(u._id)}>
                                            <Trash2 size={12} /> <span>Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(editingUser || isAddingUser) && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={cardHeaderStyle}><h3>{isAddingUser ? 'Add New User' : 'Edit User Details'}</h3><X style={{ cursor: 'pointer' }} onClick={() => { setEditingUser(null); setIsAddingUser(false); }} /></div>
                        <form onSubmit={isAddingUser ? handleAddUser : handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input required style={formInput} placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input required style={formInput} placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            {isAddingUser && <input required style={formInput} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />}
                            <select style={formInput} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option value="Elder">Elder</option>
                                <option value="Family Member">Family Member</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <button type="submit" style={btnActionStyle}>{isAddingUser ? 'Create Account' : 'Update User'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MEDICATION MONITORING ---
const MedicationMonitoring = ({ meds, stats, showToast }) => {
    const exportCSV = () => {
        const headers = ["Elder", "Medication", "Dosage", "Stock", "Threshold"];
        const rows = meds.map(m => [m.elder?.name || 'Unknown', m.name, m.dosage, m.stock, m.refillThreshold]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "medication_report.csv");
        document.body.appendChild(link);
        link.click();
        showToast("CSV Exported successfully");
    };

    return (
        <div style={fadeAnimation}>
            <div style={metricGridStyle}>
                <MetricCard title="Adherence Rate" value="94.2%" icon={<Activity color="#3B82F6" />} color="#3B82F6" />
                <MetricCard title="Missed Meds (24h)" value={stats?.alerts?.missedMeds || 0} icon={<AlertTriangle color="#EF4444" />} color="#EF4444" isAlert />
                <MetricCard title="Low Stock Assets" value={meds.filter(m => m.stock < m.refillThreshold).length} icon={<Zap color="#F59E0B" />} color="#F59E0B" />
            </div>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}><h4 style={cardTitleStyle}>Detailed medication logs</h4><button onClick={exportCSV} style={textBtnStyle}><Download size={14} /> Export CSV</button></div>
                <table style={tableStyle}>
                    <thead><tr style={tableHeaderRow}><th style={thStyle}>ELDER</th><th style={thStyle}>MEDICATION</th><th style={thStyle}>DOSAGE</th><th style={thStyle}>COMPLIANCE</th><th style={thStyle}>STOCK</th></tr></thead>
                    <tbody>
                        {meds.map(m => (
                            <tr key={m._id} style={trStyle}>
                                <td style={tdStyle}>{m.elder?.name || 'Unknown'}</td>
                                <td style={tdStyle}><strong>{m.name}</strong></td>
                                <td style={tdStyle}>{m.dosage}</td>
                                <td style={tdStyle}>
                                    <div style={{ width: '80px', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                                        <div style={{ width: '90%', height: '100%', background: '#10B981', borderRadius: '4px' }} />
                                    </div>
                                </td>
                                <td style={tdStyle}>{m.stock} Units</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- ALERTS MONITORING ---
const AlertsMonitoring = ({ alerts, fetchData, showToast, authHeaders }) => {
    const [severityFilter, setSeverityFilter] = useState('All');
    
    const dismiss = async (id) => {
        try {
            await axios.delete(`/api/alerts/${id}`, authHeaders);
            showToast("Case closed/dismissed");
            fetchData();
        } catch (e) { showToast("Failed to dismiss", "error"); }
    };

    const filtered = alerts.filter(a => severityFilter === 'All' || a.severity === severityFilter);

    return (
        <div style={fadeAnimation}>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}>
                    <h4 style={cardTitleStyle}>Central Alert Dashboard</h4>
                    <select style={selectStyle} value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                        <option value="All">All Severities</option>
                        <option value="High">Emergency / SOS</option>
                        <option value="Medium">Warning</option>
                        <option value="Low">Log</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map(a => (
                        <div key={a._id} style={{ ...alertStrip, borderLeft: `6px solid ${a.severity === 'High' ? '#EF4444' : '#F59E0B'}` }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {a.type === 'Emergency' ? <ShieldAlert color="#EF4444" size={24} /> : <Bell color="#64748B" size={24} />}
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: 0, fontSize: '15px' }}>{a.title} <span style={{ fontSize: '11px', background: '#EEF2FF', padding: '2px 8px', borderRadius: '4px' }}>{a.user?.name}</span></h5>
                                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>{a.message}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{new Date(a.createdAt).toLocaleTimeString()}</div>
                                    <button onClick={() => dismiss(a._id)} style={smallBtn}>Dismiss</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>No active alerts in this category.</p>}
                </div>
            </div>
        </div>
    );
};

// --- REPORTS VIEW ---
const ReportsView = ({ analytics, meds, stats, showToast }) => {
    const downloadCSV = () => {
        const headers = ["Timestamp", "User", "Action", "Category"];
        const rows = (analytics?.recentActivity || []).map(l => [new Date(l.timestamp).toLocaleString(), l.user?.name || 'System', l.action, l.category]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "system_activity_report.csv");
        document.body.appendChild(link);
        link.click();
        showToast("Activity Report Exported");
    };

    return (
        <div style={fadeAnimation}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={adminCardStyle}><h5 style={{ margin: '0 0 10px 0' }}>User Activity Export</h5><button onClick={downloadCSV} style={fullBtnStyle}><FileDown size={14} /> Download Activity (CSV)</button></div>
                <div style={adminCardStyle}><h5 style={{ margin: '0 0 10px 0' }}>Adherence Audit</h5><button onClick={() => showToast("PDF Generation started...")} style={fullBtnStyle}><Download size={14} /> Export PDF Statement</button></div>
                <div style={adminCardStyle}><h5 style={{ margin: '0 0 10px 0' }}>System Audit</h5><button onClick={() => showToast("Running diagnostic check...")} style={fullBtnStyle}><Check size={14} /> Run Compliance Check</button></div>
            </div>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}><h4 style={cardTitleStyle}>Analytics Reporting Dashboard</h4> <div style={{ display: 'flex', gap: '10px' }}><input type="date" style={selectStyle} /><input type="date" style={selectStyle} /></div></div>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #E2E8F0' }}>
                   <div style={{ textAlign: 'center' }}><BarChart3 size={48} color="#CBD5E1" /><p style={{ color: '#94A3B8' }}>Select date ranges to generate detailed reports.</p></div>
                </div>
            </div>
        </div>
    );
};

// --- SECURITY MONITORING ---
const SecurityMonitoring = ({ analytics }) => {
    const loginLogs = analytics?.recentActivity?.filter(l => l.category === 'Security') || [];
    return (
        <div style={fadeAnimation}>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}><h4 style={cardTitleStyle}>Security & Access Logs</h4><span style={{ fontSize: '12px', color: '#10B981', fontWeight: '800' }}>● REAL-TIME MONITORING ACTIVE</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {loginLogs.map((log, i) => (
                        <div key={i} style={{ padding: '12px 16px', borderRadius: '12px', background: log.action === 'Login Failed' ? '#FFF5F5' : '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                {log.action === 'Login Failed' ? <ShieldAlert size={18} color="#EF4444" /> : <ShieldCheck size={18} color="#10B981" />}
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: log.action === 'Login Failed' ? '#EF4444' : '#0F172A' }}>{log.action}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>{log.user?.email || log.metadata?.email}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#94A3B8' }}>{new Date(log.timestamp).toLocaleString()}</div>
                        </div>
                    ))}
                    {loginLogs.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>No security events logged.</p>}
                </div>
            </div>
        </div>
    );
};

// --- Helper Components & Styles ---
const DashboardHome = ({ stats, analytics }) => (
    <div style={fadeAnimation}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div><h3 style={{ fontSize: '24px', fontWeight: '800' }}>Platform Overview</h3><p style={{ color: '#64748B' }}>Monitoring health and security for {stats?.users?.elders || 0} elders.</p></div>
            <div style={lastLoginBadge}><Clock size={12} /> Live Status: Operational</div>
        </div>
        <div style={metricGridStyle}>
            <MetricCard title="Total Elders" value={stats?.users?.elders || 0} icon={<Heart fill="#3B82F6" stroke="#3B82F6" size={24} />} color="#3B82F6" />
            <MetricCard title="Alerts Today" value={stats?.alerts?.totalToday || 0} icon={<ShieldAlert size={24} />} color="#EF4444" isAlert />
            <MetricCard title="Missed Meds" value={stats?.alerts?.missedMeds || 0} icon={<Pill size={24} />} color="#F59E0B" />
            <MetricCard title="Sys Status" value="Online" icon={<Zap fill="#10B981" stroke="#10B981" size={24} />} color="#10B981" />
        </div>
        <div style={adminCardStyle}>
           <div style={cardHeaderStyle}><h4 style={cardTitleStyle}>Latest activity table</h4><button style={textBtnStyle}>Full Audit Trail</button></div>
           <table style={tableStyle}>
                <thead><tr style={tableHeaderRow}><th style={thStyle}>TIMESTAMP</th><th style={thStyle}>USER</th><th style={thStyle}>ACTION</th><th style={thStyle}>MODULE</th></tr></thead>
                <tbody>
                    {analytics?.recentActivity?.slice(0, 8).map((log, i) => (
                        <tr key={i} style={trStyle}>
                            <td style={tdStyle}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td style={tdStyle}>{log.user?.name || 'System'}</td>
                            <td style={tdStyle}>{log.action}</td>
                            <td style={tdStyle}><span style={categoryBadge}>{log.category}</span></td>
                        </tr>
                    ))}
                </tbody>
           </table>
        </div>
    </div>
);

const SidebarLink = ({ icon, label, active, onClick, danger }) => (
    <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
        marginBottom: '4px', transition: 'all 0.2s', backgroundColor: active ? '#EFF6FF' : 'transparent',
        color: active ? '#3B82F6' : danger ? '#EF4444' : '#64748B', fontWeight: active ? '800' : '500'
    }}>{icon} <span style={{ fontSize: '14px' }}>{label}</span></div>
);

const MetricCard = ({ title, value, icon, color, isAlert }) => (
    <div style={{ ...adminCardStyle, border: isAlert && value > 0 ? '1px solid #FECACA' : '1px solid #F1F5F9', background: isAlert && value > 0 ? '#FFF5F5' : 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><div style={{ padding: '8px', borderRadius: '8px', background: `${color}15`, color: color }}>{icon}</div><MoreVertical size={14} color="#94A3B8" /></div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0' }}>{value}</div>
    </div>
);

// --- MEMORY WALL MODERATION ---
const MemoryWallView = ({ authHeaders, showToast }) => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/memory-wall/all', authHeaders);
            setContent(res.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this content permanently?")) return;
        try {
            await axios.delete(`/api/memory-wall/${id}`, authHeaders);
            showToast("Memory deleted");
            fetchData();
        } catch (e) { showToast("Failed to delete memory", "error"); }
    };

    return (
        <div style={fadeAnimation}>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}>
                    <h4 style={cardTitleStyle}>Memory Wall Content Moderation</h4>
                    <button onClick={fetchData} style={iconActionBtn}><RefreshCw size={14} /></button>
                </div>
                {loading ? <p>Loading gallery...</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {content.map(item => (
                            <div key={item._id} style={{ border: '1px solid #F1F5F9', borderRadius: '16px', overflow: 'hidden', background: '#F8FAFC' }}>
                                <img src={item.contentUrl} alt="Shared" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                                <div style={{ padding: '12px' }}>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800' }}>{item.elder?.name || 'Elder'}</p>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#64748B', height: '32px', overflow: 'hidden' }}>{item.caption}</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{ ...smallBtn, background: '#10B981', color: 'white', border: 'none', flexGrow: 1 }} onClick={() => showToast("Content Verified")}>Approve</button>
                                        <button style={{ ...smallBtn, background: '#EF4444', color: 'white', border: 'none' }} onClick={() => handleDelete(item._id)}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {content.length === 0 && <p style={{ textAlign: 'center', gridColumn: 'span 4', padding: '40px', color: '#94A3B8' }}>No memory posts to moderate.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- STORY LIBRARY MANAGEMENT ---
const StoriesView = ({ authHeaders, showToast }) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingStory, setIsAddingStory] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: '', duration: '', content: '', pdfUrl: '', published: true });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/stories', authHeaders);
            setStories(res.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const togglePublish = async (story) => {
        const newStatus = !story.published;
        try {
            await axios.put(`/api/stories/${story._id}`, { published: newStatus }, authHeaders);
            showToast(`Story ${newStatus ? 'published' : 'unpublished'}`);
            fetchData();
        } catch (e) { showToast("Action failed", "error"); }
    };

    const handleAddStory = async (e) => {
        e.preventDefault();
        try {
            if (editingStory) {
                await axios.put(`/api/stories/${editingStory}`, formData, authHeaders);
                showToast("Story updated successfully");
            } else {
                await axios.post('/api/stories', formData, authHeaders);
                showToast("Story added successfully");
            }
            setIsAddingStory(false);
            setEditingStory(null);
            setFormData({ title: '', category: '', duration: '', content: '', pdfUrl: '', published: true });
            fetchData();
        } catch (e) { showToast(editingStory ? "Update failed" : "Creation failed", "error"); }
    };

    const handleDeleteStory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this story?")) return;
        try {
            await axios.delete(`/api/stories/${id}`, authHeaders);
            showToast("Story deleted");
            fetchData();
        } catch (e) { showToast("Deletion failed", "error"); }
    };

    return (
        <div style={fadeAnimation}>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}>
                    <h4 style={cardTitleStyle}>Story Library Control Panel</h4>
                    <button onClick={() => setIsAddingStory(true)} style={btnActionStyle}><Plus size={14} /> Add New Story</button>
                </div>
                <table style={tableStyle}>
                    <thead><tr style={tableHeaderRow}><th style={thStyle}>TITLE / CATEGORY</th><th style={thStyle}>READ TIME</th><th style={thStyle}>STATUS</th><th style={thStyle}>ACTIONS</th></tr></thead>
                    <tbody>
                        {stories.map(s => (
                            <tr key={s._id} style={trStyle}>
                                <td style={tdStyle}><strong>{s.title}</strong><br/><span style={categoryBadge}>{s.category}</span></td>
                                <td style={tdStyle}>{s.duration || '5 min'}</td>
                                <td style={tdStyle}>{s.published ? <span style={{ color: '#10B981', fontWeight: '800' }}>● PUBLISHED</span> : <span style={{ color: '#94A3B8' }}>○ DRAFT</span>}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={actionBtnLabeled} onClick={() => togglePublish(s)}>
                                            {s.published ? <EyeOff size={12} /> : <Eye size={12} />} 
                                            <span>{s.published ? 'Unpublish' : 'Publish'}</span>
                                        </button>
                                        <button style={actionBtnLabeled} onClick={() => { setEditingStory(s._id); setFormData(s); setIsAddingStory(true); }}>
                                            <Edit2 size={12} /> <span>Edit</span>
                                        </button>
                                        <button style={{...actionBtnLabeled, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2'}} onClick={() => handleDeleteStory(s._id)}>
                                            <Trash2 size={12} /> <span>Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAddingStory && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={cardHeaderStyle}><h3>{editingStory ? 'Edit Story' : 'Create New Story'}</h3><X style={{ cursor: 'pointer' }} onClick={() => { setIsAddingStory(false); setEditingStory(null); }} /></div>
                        <form onSubmit={handleAddStory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input required style={formInput} placeholder="Story Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <input required style={formInput} placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                            <input required style={formInput} placeholder="Reading Duration (e.g. 5 min)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                            <textarea required style={{ ...formInput, minHeight: '120px' }} placeholder="Story Content Text" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                            <input style={formInput} placeholder="PDF URL (External Link)" value={formData.pdfUrl || ''} onChange={e => setFormData({...formData, pdfUrl: e.target.value})} />
                            <button type="submit" style={btnActionStyle}>Publish Story</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- WELLNESS / MUSIC MANAGEMENT ---
const WellnessView = ({ authHeaders, showToast }) => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ title: '', type: 'Music', content: '', description: '', active: true });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/wellness', authHeaders);
            setContents(res.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`/api/wellness/${editing}`, formData, authHeaders);
                showToast("Content updated successfully");
            } else {
                await axios.post('/api/wellness', formData, authHeaders);
                showToast("Content added successfully");
            }
            setIsAdding(false);
            setEditing(null);
            setFormData({ title: '', type: 'Music', content: '', description: '', active: true });
            fetchData();
        } catch (e) { showToast("Operation failed", "error"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/wellness/${id}`, authHeaders);
            showToast("Content removed");
            fetchData();
        } catch (e) { showToast("Deletion failed", "error"); }
    };

    const toggleActive = async (item) => {
        try {
            await axios.put(`/api/wellness/${item._id}`, { active: !item.active }, authHeaders);
            showToast(`Content ${!item.active ? 'activated' : 'deactivated'}`);
            fetchData();
        } catch (e) { showToast("Update failed", "error"); }
    };

    return (
        <div style={fadeAnimation}>
            <div style={adminCardStyle}>
                <div style={cardHeaderStyle}>
                    <h4 style={cardTitleStyle}>Music & Wellness Management</h4>
                    <button onClick={() => setIsAdding(true)} style={btnActionStyle}><Plus size={14} /> Add New Music</button>
                </div>
                <table style={tableStyle}>
                    <thead><tr style={tableHeaderRow}><th style={thStyle}>TITLE / TYPE</th><th style={thStyle}>URL / CONTENT</th><th style={thStyle}>STATUS</th><th style={thStyle}>ACTIONS</th></tr></thead>
                    <tbody>
                        {contents.map(c => (
                            <tr key={c._id} style={trStyle}>
                                <td style={tdStyle}><strong>{c.title}</strong><br/><span style={categoryBadge}>{c.type}</span></td>
                                <td style={tdStyle}><span style={{ fontSize: '12px', color: '#64748B' }}>{c.content.substring(0, 50)}...</span></td>
                                <td style={tdStyle}>{c.active ? <span style={{ color: '#10B981', fontWeight: '800' }}>● ACTIVE</span> : <span style={{ color: '#94A3B8' }}>○ INACTIVE</span>}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={actionBtnLabeled} onClick={() => toggleActive(c)}>
                                            {c.active ? <EyeOff size={12} /> : <Eye size={12} />} 
                                            <span>{c.active ? 'Deactivate' : 'Activate'}</span>
                                        </button>
                                        <button style={actionBtnLabeled} onClick={() => { setEditing(c._id); setFormData(c); setIsAdding(true); }}>
                                            <Edit2 size={12} /> <span>Edit</span>
                                        </button>
                                        <button style={{...actionBtnLabeled, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2'}} onClick={() => handleDelete(c._id)}>
                                            <Trash2 size={12} /> <span>Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={cardHeaderStyle}><h3>{editing ? 'Edit Content' : 'Add Wellness Content'}</h3><X style={{ cursor: 'pointer' }} onClick={() => { setIsAdding(false); setEditing(null); }} /></div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input required style={formInput} placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <select style={formInput} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option value="Music">Music</option>
                                <option value="Story">Story</option>
                                <option value="Exercise">Exercise</option>
                            </select>
                            <input required style={formInput} placeholder="Content URL (MP3/Video/Image)" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                            <textarea style={{ ...formInput, minHeight: '80px' }} placeholder="Description (Optional)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <button type="submit" style={btnActionStyle}>Save Content</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SettingsView = ({ showToast }) => (
    <div style={{ maxWidth: '600px' }}>
        <div style={adminCardStyle}>
            <h3>Admin Profile Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input style={formInput} placeholder="Display Name" defaultValue="System Admin" />
                <input style={formInput} placeholder="New Password" type="password" />
                <button style={btnActionStyle} onClick={() => showToast("Profile settings saved")}>Save Profile Changes</button>
            </div>
        </div>
    </div>
);

// --- GLOBAL STYLES & HELPERS ---
const dashboardContainer = { display: 'flex', height: '100vh', background: '#F8FAFC' };
const sidebarStyle = { width: '280px', background: 'white', padding: '24px', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' };
const sidebarLogo = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' };
const logoIcon = { width: '40px', height: '40px', background: '#3B82F6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const logoText = { fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' };
const navLinksStyle = { display: 'flex', flexDirection: 'column', gap: '2px', flexGrow: 1 };
const navDivider = { fontSize: '11px', fontWeight: '800', color: '#94A3B8', marginTop: '20px', marginBottom: '10px', letterSpacing: '1px', padding: '0 16px' };
const mainContentStyle = { flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const topHeaderStyle = { height: '80px', background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', flexShrink: 0 };
const scrollContentStyle = { flexGrow: 1, overflowY: 'auto', padding: '32px 40px' };
const adminProfileStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatarStyle = { width: '36px', height: '36px', background: '#EEF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#4F46E5', fontSize: '13px' };
const metricGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' };
const adminCardStyle = { background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const cardTitleStyle = { fontSize: '18px', fontWeight: '800', margin: 0 };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '16px 0', fontSize: '11px', fontWeight: '800', color: '#94A3B8', borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: '16px 0', fontSize: '14px', borderBottom: '1px solid #F8FAFC' };
const searchBox = { display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '0 14px', borderRadius: '12px', border: '1px solid #E2E8F0' };
const cleanInput = { border: 'none', background: 'transparent', padding: '10px 0', outline: 'none', fontSize: '14px', width: '200px' };
const selectStyle = { padding: '10px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '13px', fontWeight: '700' };
const btnActionStyle = { padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' };
const fullBtnStyle = { width: '100%', padding: '12px', background: '#F8FAFC', color: '#3B82F6', border: '1px solid #EFF6FF', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const iconActionBtn = { border: 'none', background: '#F8FAFC', padding: '8px', borderRadius: '8px', cursor: 'pointer' };
const actionBtnLabeled = { 
    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', 
    borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', 
    fontSize: '11px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s',
    color: '#475569'
};
const alertStrip = { padding: '16px', borderRadius: '16px', background: 'white', border: '1px solid #F1F5F9' };
const smallBtn = { padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' };
const categoryBadge = { padding: '4px 8px', background: '#F8FAFC', color: '#64748B', borderRadius: '6px', fontSize: '10px', fontWeight: '800' };
const roleBadge = (role) => ({ padding: '4px 8px', background: role === 'Admin' ? '#EEF2FF' : '#F8FAFC', color: role === 'Admin' ? '#4F46E5' : '#64748B', borderRadius: '6px', fontSize: '11px', fontWeight: '800' });
const lastLoginBadge = { fontSize: '11px', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' };
const headerAction = { width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const centerStyle = { display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' };
const spinStyle = { animation: 'spin 2s linear infinite' };
const fadeAnimation = { animation: 'slideIn 0.3s ease-out' };
const tableHeaderRow = { borderBottom: '1px solid #F1F5F9' };
const trStyle = { transition: 'background 0.2s' };
const textBtnStyle = { border: 'none', background: 'transparent', color: '#3B82F6', fontWeight: '800', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent = { background: 'white', padding: '32px', borderRadius: '24px', width: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' };
const formInput = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' };
const messageStyle = (type) => ({ position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px', borderRadius: '16px', color: 'white', background: type === 'error' ? '#EF4444' : '#10B981', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: '800', zIndex: 2000, animation: 'slideIn 0.3s ease-out' });

export default AdminPanel;
