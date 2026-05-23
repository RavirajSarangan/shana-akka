import React, { useState, useEffect } from 'react';
import { 
    RefreshCw, Search, Filter, Calendar, MoreVertical, 
    CheckCircle, XCircle, Trash2, Edit, Eye, 
    AlertCircle, Image as ImageIcon, User, Clock, 
    History, Check, X, Shield, FileText, ChevronRight
} from 'lucide-react';
import axios from 'axios';

const MemoryModeration = ({ authHeaders, showToast }) => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        flagged: 0
    });
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [recentActivity, setRecentActivity] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/memory-wall/all', authHeaders);
            const data = res.data || [];
            setMemories(data);
            
            const newStats = data.reduce((acc, current) => {
                acc.total++;
                if (current.status === 'Pending') acc.pending++;
                else if (current.status === 'Approved') acc.approved++;
                else if (current.status === 'Rejected') acc.rejected++;
                if (current.flagCount > 0) acc.flagged++;
                return acc;
            }, { total: 0, pending: 0, approved: 0, rejected: 0, flagged: 0 });
            
            setStats(newStats);

            setRecentActivity([
                { id: 1, type: 'Approved', title: 'Summer Garden Visit', user: 'Admin Sarah', time: '10 mins ago' },
                { id: 2, type: 'Rejected', title: 'Blurry Photo', user: 'Admin Sarah', time: '1 hour ago' },
                { id: 3, type: 'Deleted', title: 'Duplicate Post', user: 'System', time: '3 hours ago' },
            ]);

        } catch (err) {
            console.error("Fetch error:", err);
            showToast("Failed to fetch memory wall content", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id, action) => {
        try {
            if (action === 'Delete') {
                if (!window.confirm("Permanently delete this memory?")) return;
                await axios.delete(`/api/memory-wall/${id}`, authHeaders);
                showToast("Memory deleted successfully!", "success");
                setShowModal(false);
            } else if (action === 'Update') {
                await axios.put(`/api/memory-wall/${id}`, selectedMemory, authHeaders);
                showToast("Memory updated successfully", "success");
                setShowModal(false);
            } else {
                await axios.put(`/api/memory-wall/${id}`, { status: action }, authHeaders);
                showToast(`Memory ${action} successfully`, "success");
            }
            fetchData();
        } catch (err) {
            console.error(err);
            showToast(`Failed to ${action.toLowerCase()} memory`, "error");
        }
    };

    const filteredMemories = memories.filter(m => {
        const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
        const matchesSearch = (m.caption?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             m.elder?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const openPreview = (memory) => {
        setSelectedMemory(memory);
        setShowModal(true);
    };

    return (
        <div style={pageContainer}>
            {/* 1. Header */}
            <header style={headerContainer}>
                <div>
                    <h1 style={pageTitle}>Memory Wall Moderation</h1>
                    <p style={pageSubtitle}>Review and manage memory content uploaded for elder users</p>
                </div>
                <button onClick={fetchData} style={refreshBtn} title="Refresh Data">
                    <RefreshCw size={18} style={loading ? { animation: 'spin 2s linear infinite' } : {}} />
                    <span>Refresh Data</span>
                </button>
            </header>

            {/* 2. Stats Cards */}
            <div style={statsGrid}>
                <StatsCard title="Total Memory Posts" value={stats.total} icon={<ImageIcon size={24} />} color="#3B82F6" />
                <StatsCard title="Pending Review" value={stats.pending} icon={<Clock size={24} />} color="#F59E0B" />
                <StatsCard title="Approved Posts" value={stats.approved} icon={<CheckCircle size={24} />} color="#10B981" />
                <StatsCard title="Rejected Posts" value={stats.rejected} icon={<XCircle size={24} />} color="#EF4444" />
                <StatsCard title="Flagged Posts" value={stats.flagged} icon={<AlertCircle size={24} />} color="#7C3AED" />
            </div>

            <div style={layoutGrid}>
                <div style={leftColumn}>
                    {/* 3. Filter Bar */}
                    <div style={filterBar}>
                        <div style={searchWrapper}>
                            <Search size={18} color="#94A3B8" />
                            <input 
                                type="text" 
                                placeholder="Search by elder name or memory title..." 
                                style={searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={filterGroup}>
                            <select style={selectInput} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <select style={selectInput}>
                                <option value="All">Categories</option>
                                <option value="Family">Family</option>
                                <option value="Nature">Nature</option>
                                <option value="Travel">Travel</option>
                                <option value="Events">Events</option>
                            </select>
                            <button style={dateFilterBtn}>
                                <Calendar size={18} />
                                <span>Filter By Date</span>
                            </button>
                        </div>
                    </div>

                    {/* 4. Main Moderation Table */}
                    <div style={tableCard}>
                        {loading ? (
                            <div style={loadingOverlay}>
                                <RefreshCw size={32} style={{ animation: 'spin 2s linear infinite' }} />
                                <p>Loading memories...</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={table}>
                                    <thead>
                                        <tr>
                                            <th style={th}>DATE</th>
                                            <th style={th}>ELDER NAME</th>
                                            <th style={th}>POSTED BY</th>
                                            <th style={th}>MEMORY TITLE</th>
                                            <th style={th}>PREVIEW</th>
                                            <th style={th}>STATUS</th>
                                            <th style={th}>FLAGS</th>
                                            <th style={th}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMemories.map(m => (
                                            <tr key={m._id} style={tr}>
                                                <td style={td}>{new Date(m.createdAt).toLocaleDateString()}</td>
                                                <td style={td}>
                                                    <div style={userCell}>
                                                        <div style={avatarSmall}>{m.elder?.name?.charAt(0) || 'E'}</div>
                                                        <span>{m.elder?.name || 'Unknown Elder'}</span>
                                                    </div>
                                                </td>
                                                <td style={td}>{m.postedBy?.name || 'Family Member'}</td>
                                                <td style={td}>{m.caption?.substring(0, 30)}...</td>
                                                <td style={td}>
                                                    <div style={previewBox} onClick={() => openPreview(m)}>
                                                        <img src={m.contentUrl} alt="prev" style={thumbnail} />
                                                        <div style={previewOverlay}><Eye size={12} /></div>
                                                    </div>
                                                </td>
                                                <td style={td}>
                                                    <StatusBadge status={m.status || 'Pending'} />
                                                </td>
                                                <td style={td}>
                                                    {m.flagCount > 0 ? (
                                                        <span style={flagCount}>{m.flagCount}</span>
                                                    ) : <span style={{color: '#E2E8F0'}}>-</span>}
                                                </td>
                                                <td style={td}>
                                                    <div style={actionGroup}>
                                                        <button style={actionBtnLabeled} onClick={() => openPreview(m)}>
                                                            <Eye size={14} /> <span>View</span>
                                                        </button>
                                                        {m.status !== 'Approved' && (
                                                            <button style={{...actionBtnLabeled, color: '#10B981', background: '#F0FDF4', border: '1px solid #DCFCE7'}} onClick={() => handleAction(m._id, 'Approved')}>
                                                                <CheckCircle size={14} /> <span>Approve</span>
                                                            </button>
                                                        )}
                                                        {m.status !== 'Rejected' && (
                                                            <button style={{...actionBtnLabeled, color: '#D97706', background: '#FFFBEB', border: '1px solid #FEF3C7'}} onClick={() => handleAction(m._id, 'Rejected')}>
                                                                <XCircle size={14} /> <span>Reject</span>
                                                            </button>
                                                        )}
                                                        <button style={actionBtnLabeled} onClick={() => openPreview(m)}>
                                                            <Edit size={14} /> <span>Edit</span>
                                                        </button>
                                                        <button style={{...actionBtnLabeled, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2'}} onClick={() => handleAction(m._id, 'Delete')}>
                                                            <Trash2 size={14} /> <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredMemories.length === 0 && (
                                            <tr>
                                                <td colSpan="8" style={noResults}>No memory posts found matching your criteria.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div style={rightColumn}>
                    {/* 7. Recent Moderation Activity Panel */}
                    <div style={activityCard}>
                        <div style={activityHeader}>
                            <History size={18} />
                            <span>Recent Activity</span>
                        </div>
                        <div style={activityList}>
                            {recentActivity.map(item => (
                                <div key={item.id} style={activityItem}>
                                    <div style={{...activityIcon, background: item.type === 'Approved' ? '#DCFCE7' : item.type === 'Rejected' ? '#FEE2E2' : '#F1F5F9'}}>
                                        {item.type === 'Approved' ? <Check size={14} color="#10B981" /> : item.type === 'Rejected' ? <X size={14} color="#EF4444" /> : <Trash2 size={14} color="#64748B" />}
                                    </div>
                                    <div style={activityMeta}>
                                        <div style={activityText}>
                                            <strong style={{fontWeight: '800'}}>{item.user}</strong> {item.type.toLowerCase()} <span style={{color: '#64748B'}}>"{item.title}"</span>
                                        </div>
                                        <span style={activityTime}>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={viewAllBtn} onClick={() => showToast("Full history view coming in next update")}>View Full History <ChevronRight size={14} /></button>
                    </div>

                    <div style={tipCard}>
                        <Shield size={24} color="#3B82F6" style={{marginBottom: '12px'}} />
                        <h3 style={{fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0'}}>Moderation Tip</h3>
                        <p style={{fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0}}>Verify all images for clarity and appropriateness before approval. AI flags should be reviewed with priority.</p>
                    </div>
                </div>
            </div>

            {/* 6. Memory Preview Modal */}
            {showModal && selectedMemory && (
                <div style={modalBackdrop} onClick={() => setShowModal(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={modalHeader}>
                            <div style={modalHeaderTitle}>
                                <ImageIcon size={20} color="#3B82F6" />
                                <h3 style={{margin: 0, fontWeight: '800'}}>Memory Preview & Moderation</h3>
                            </div>
                            <button style={closeBtn} onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <div style={modalBody}>
                            <div style={modalVisual}>
                                <img src={selectedMemory.contentUrl} alt="Full view" style={fullImage} />
                            </div>
                            <div style={modalDetails}>
                                <div style={detailSection}>
                                    <label style={detailLabel}>CAPTION / TITLE</label>
                                    <input 
                                        style={modalInput} 
                                        value={selectedMemory.caption} 
                                        onChange={(e) => setSelectedMemory({...selectedMemory, caption: e.target.value})}
                                    />
                                </div>
                                <div style={detailGrid}>
                                    <div>
                                        <label style={detailLabel}>POSTED BY</label>
                                        <div style={detailUser}>
                                            <div style={avatarSmall}><User size={12} /></div>
                                            <span>{selectedMemory.postedBy?.name || 'Family Member'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={detailLabel}>RELATED ELDER</label>
                                        <div style={detailUser}>
                                            <div style={avatarSmall}><HeartIcon size={12} color="#EF4444" fill="#EF4444" /></div>
                                            <span>{selectedMemory.elder?.name || 'Unknown Elder'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={detailGrid}>
                                    <div>
                                        <label style={detailLabel}>CREATED DATE</label>
                                        <div style={detailIconText}><Calendar size={14} /> {new Date(selectedMemory.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <label style={detailLabel}>CURRENT STATUS</label>
                                        <div style={{marginTop: '4px'}}><StatusBadge status={selectedMemory.status || 'Pending'} /></div>
                                    </div>
                                </div>
                                <div style={detailSection}>
                                    <label style={detailLabel}>MODERATION NOTE</label>
                                    <textarea style={modalTextarea} placeholder="Add a reason for approval/rejection..."></textarea>
                                </div>
                            </div>
                        </div>
                        <div style={modalFooter}>
                            <div style={modalFooterLeft}>
                                <button style={{...modalBtn, color: '#EF4444', border: '1px solid #FECACA', background: 'transparent'}} onClick={() => handleAction(selectedMemory._id, 'Delete')}>Delete Post</button>
                            </div>
                            <div style={modalFooterRight}>
                                <button style={modalBtnOutline} onClick={() => setShowModal(false)}>Cancel</button>
                                {selectedMemory.status !== 'Rejected' && (
                                    <button style={{...modalBtn, background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2'}} onClick={() => { handleAction(selectedMemory._id, 'Rejected'); setShowModal(false); }}>Reject</button>
                                )}
                                <button style={{...modalBtn, background: '#10B981', color: 'white'}} onClick={() => { handleAction(selectedMemory._id, 'Update'); setShowModal(false); }}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-components ---

const StatsCard = ({ title, value, icon, color }) => (
    <div style={statsCardStyle}>
        <div style={{...iconBox, background: `${color}15`, color: color }}>{icon}</div>
        <div style={statsInfo}>
            <span style={statsTitle}>{title}</span>
            <span style={statsValue}>{value}</span>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Pending': { bg: '#FFF7ED', text: '#D97706', border: '1px solid #FFEDD5' },
        'Approved': { bg: '#F0FDF4', text: '#166534', border: '1px solid #DCFCE7' },
        'Rejected': { bg: '#FEF2F2', text: '#991B1B', border: '1px solid #FEE2E2' },
        'Flagged': { bg: '#FAF5FF', text: '#6B21A8', border: '1px solid #F3E8FF' }
    };
    const style = styles[status] || styles['Pending'];
    return (
        <span style={{
            ...badgeStyle,
            backgroundColor: style.bg,
            color: style.text,
            border: style.border
        }}>{status}</span>
    );
};

const HeartIcon = ({ size, color, fill }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

// --- CSS Styles Objects ---

const pageContainer = { padding: '0px', width: '100%', animation: 'fadeIn 0.4s ease-out' };
const headerContainer = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' };
const pageTitle = { fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' };
const pageSubtitle = { fontSize: '15px', color: '#64748B', margin: 0 };
const refreshBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', color: '#334155' };

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' };
const statsCardStyle = { background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const iconBox = { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statsInfo = { display: 'flex', flexDirection: 'column' };
const statsTitle = { fontSize: '13px', color: '#64748B', fontWeight: '600' };
const statsValue = { fontSize: '22px', fontWeight: '800', color: '#0F172A' };

const layoutGrid = { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' };
const leftColumn = { display: 'flex', flexDirection: 'column', gap: '24px' };
const rightColumn = { display: 'flex', flexDirection: 'column', gap: '24px' };

const filterBar = { background: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' };
const searchWrapper = { flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '0 16px', borderRadius: '12px', border: '1px solid #E2E8F0' };
const searchInput = { background: 'transparent', border: 'none', padding: '12px 0', width: '100%', outline: 'none', fontSize: '14px', color: '#0F172A' };
const filterGroup = { display: 'flex', gap: '10px' };
const selectInput = { padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', fontSize: '13px', fontWeight: '600', color: '#334155', outline: 'none' };
const dateFilterBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer' };

const tableCard = { background: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' };
const table = { width: '100%', borderCollapse: 'collapse' };
const th = { textAlign: 'left', padding: '16px 20px', fontSize: '11px', fontWeight: '800', color: '#94A3B8', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', letterSpacing: '0.05em' };
const tr = { borderBottom: '1px solid #F8FAFC', transition: 'all 0.2s' };
const td = { padding: '16px 20px', fontSize: '14px', color: '#334155' };
const userCell = { display: 'flex', alignItems: 'center', gap: '10px' };
const avatarSmall = { width: '28px', height: '28px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#4F46E5' };
const previewBox = { width: '48px', height: '36px', borderRadius: '6px', overflow: 'hidden', position: 'relative', cursor: 'pointer' };
const thumbnail = { width: '100%', height: '100%', objectFit: 'cover' };
const previewOverlay = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, transition: 'opacity 0.2s' };
const badgeStyle = { padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' };
const flagCount = { width: '20px', height: '20px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' };
const actionGroup = { display: 'flex', gap: '8px' };
const actionBtn = { padding: '8px', borderRadius: '8px', border: 'none', background: '#F8FAFC', cursor: 'pointer', color: '#64748B' };
const actionBtnLabeled = { 
    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', 
    borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', 
    fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
    color: '#475569'
};
const noResults = { textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '15px' };

const activityCard = { background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F1F5F9' };
const activityHeader = { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '16px', color: '#0F172A', marginBottom: '20px' };
const activityList = { display: 'flex', flexDirection: 'column', gap: '16px' };
const activityItem = { display: 'flex', gap: '12px' };
const activityIcon = { width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const activityMeta = { flex: 1 };
const activityText = { margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#334155' };
const activityTime = { fontSize: '11px', color: '#94A3B8' };
const viewAllBtn = { width: '100%', marginTop: '20px', padding: '10px', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', color: '#3B82F6', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' };

const tipCard = { background: '#F0F9FF', padding: '24px', borderRadius: '24px', border: '1px solid #E0F2FE', textAlign: 'center' };

const modalBackdrop = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' };
const modalContent = { background: 'white', width: '100%', maxWidth: '900px', borderRadius: '32px', overflow: 'hidden', animation: 'fadeIn 0.3s ease-out', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' };
const modalHeader = { padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' };
const modalHeaderTitle = { display: 'flex', alignItems: 'center', gap: '12px' };
const closeBtn = { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' };
const modalBody = { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0' };
const modalVisual = { background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' };
const fullImage = { maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' };
const modalDetails = { padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' };
const detailSection = { display: 'flex', flexDirection: 'column', gap: '8px' };
const detailLabel = { fontSize: '10px', fontWeight: '800', color: '#94A3B8', letterSpacing: '0.1em' };
const detailTextStrong = { fontSize: '18px', fontWeight: '700', color: '#0F172A', margin: 0 };
const detailGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const detailUser = { display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #F1F5F9', fontSize: '13px', fontWeight: '600' };
const detailIconText = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' };
const modalTextarea = { padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '100px', resize: 'none', outline: 'none' };
const modalInput = { padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', fontWeight: '700', color: '#0F172A', outline: 'none', width: '100%' };
const modalFooter = { padding: '24px 32px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' };
const modalFooterLeft = { display: 'flex', gap: '12px' };
const modalFooterRight = { display: 'flex', gap: '12px' };
const modalBtn = { padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer' };
const modalBtnOutline = { padding: '12px 24px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' };
const loadingOverlay = { padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#94A3B8' };

export default MemoryModeration;
