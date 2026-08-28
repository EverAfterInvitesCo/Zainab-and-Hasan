import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { RSVPRecord, GuestbookRecord, AdminStats } from '../types';

interface AdminPortalProps {
  onBack: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [pin, setPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('zh_admin_auth') === 'true';
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Active Tab: rsvps or guestbook
  const [activeTab, setActiveTab] = useState<'rsvps' | 'guestbook'>('rsvps');

  // Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [guestbookNotes, setGuestbookNotes] = useState<GuestbookRecord[]>([]);

  // Filters
  const [rsvpSearch, setRsvpSearch] = useState<string>('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [gbFilter, setGbFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('pending');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (pin.trim() === 'ZH2027') {
      setIsAuthenticated(true);
      sessionStorage.setItem('zh_admin_auth', 'true');
      fetchSupabaseData();
    } else {
      setError('Invalid security code. Please check your PIN.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('zh_admin_auth');
    setPin('');
  };

  const fetchSupabaseData = async () => {
    setLoading(true);
    try {
      // 1. Fetch RSVPs from Supabase
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (rsvpError) throw rsvpError;

      // Map Supabase rows to your frontend type if column names differ
      const formattedRsvps: RSVPRecord[] = (rsvpData || []).map((row: any) => ({
        id: row.id.toString(),
        name: row.name,
        attending: row.attendance === 'yes' || row.attending === 'yes' ? 'yes' : 'no',
        guestCount: row.guests_count || row.guestCount || 1,
        contact: row.dietary || row.contact || '',
        notes: row.notes || '',
        createdAt: row.created_at || new Date().toISOString(),
      }));

      setRsvps(formattedRsvps);

      // 2. Fetch Guestbook notes from Supabase
      const { data: gbData, error: gbError } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (gbError && gbError.code !== '42P01') {
        console.warn('Guestbook table might not exist yet:', gbError.message);
      }

      const formattedNotes: GuestbookRecord[] = (gbData || []).map((row: any) => ({
        id: row.id.toString(),
        name: row.name,
        message: row.message,
        photoUrl: row.photo_url || row.photoUrl || '',
        status: row.status || 'pending',
        createdAt: row.created_at || new Date().toISOString(),
      }));

      setGuestbookNotes(formattedNotes);

      // 3. Compute Stats
      const confirmedCount = formattedRsvps.filter((r) => r.attending === 'yes').length;
      const totalConfirmedGuests = formattedRsvps
        .filter((r) => r.attending === 'yes')
        .reduce((sum, r) => sum + (Number(r.guestCount) || 1), 0);
      const declinedCount = formattedRsvps.filter((r) => r.attending === 'no').length;

      const pendingCount = formattedNotes.filter((n) => n.status === 'pending').length;
      const approvedCount = formattedNotes.filter((n) => n.status === 'approved').length;

      setStats({
        rsvp: {
          confirmedCount,
          totalConfirmedGuests,
          declinedCount,
          totalCount: formattedRsvps.length,
        },
        guestbook: {
          pendingCount,
          approvedCount,
          hiddenCount: formattedNotes.filter((n) => n.status === 'hidden').length,
          totalCount: formattedNotes.length,
        },
      });
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSupabaseData();
    }
  }, [isAuthenticated]);

  const handleGuestbookAction = async (id: string, newStatus: 'approved' | 'hidden') => {
    try {
      const { error } = await supabase
        .from('guestbook')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchSupabaseData();
    } catch (err) {
      console.error('Failed to update guestbook status:', err);
      alert('Error updating note status. Check console.');
    }
  };

  const handleDeleteGuestbook = async (id: string) => {
    if (!confirm('Permanently delete this guestbook note?')) return;
    try {
      const { error } = await supabase.from('guestbook').delete().eq('id', id);
      if (error) throw error;
      fetchSupabaseData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleDeleteRsvp = async (id: string) => {
    if (!confirm('Permanently delete this RSVP record?')) return;
    try {
      const { error } = await supabase.from('rsvps').delete().eq('id', id);
      if (error) throw error;
      fetchSupabaseData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleExportCsv = () => {
    if (!rsvps || rsvps.length === 0) {
      alert('No RSVP records to export.');
      return;
    }

    const headers = ['ID', 'Guest Name', 'Attendance', 'Seats', 'Contact / Dietary', 'Notes', 'Date'];
    const escapeCsv = (val: any) => `"${(val ?? '').toString().replace(/"/g, '""')}"`;

    const rows = rsvps.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.name),
      escapeCsv(r.attending === 'yes' ? 'Attending' : 'Declined'),
      escapeCsv(r.guestCount),
      escapeCsv(r.contact),
      escapeCsv(r.notes),
      escapeCsv(new Date(r.createdAt).toLocaleString()),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zainab-hasan-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
      (r.contact && r.contact.toLowerCase().includes(rsvpSearch.toLowerCase()));
    const matchesFilter = rsvpFilter === 'all' || r.attending === rsvpFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredNotes = guestbookNotes.filter((g) => {
    if (gbFilter === 'all') return true;
    return g.status === gbFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F4F2ED] flex flex-col items-center justify-center p-6">
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-xs font-sans-luxury tracking-widest text-white/50 hover:text-white uppercase transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Invitation
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md border border-white/20 bg-black/70 p-8 sm:p-10 rounded-xl backdrop-blur-xl shadow-2xl text-center"
        >
          <div className="w-14 h-14 rounded-full border border-white/25 flex items-center justify-center mx-auto mb-6 bg-white/5">
            <Lock size={22} className="text-white" />
          </div>

          <h2 className="font-serif-luxury text-2xl uppercase tracking-[0.2em] font-light mb-2">
            Organizer Portal
          </h2>
          <p className="text-xs font-sans-luxury text-white/50 tracking-wider mb-8">
            ZAINAB &amp; HASAN WEDDING DASHBOARD
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-200 text-xs font-sans-luxury rounded text-left">
                {error}
              </div>
            )}

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-white/[0.05] border border-white/20 focus:border-white text-white px-4 py-3.5 text-sm font-sans-luxury text-center tracking-[0.3em] focus:outline-none transition-colors"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F4F2ED] text-black hover:bg-white text-xs font-sans-luxury tracking-[0.3em] uppercase font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4F2ED] p-6 sm:p-10 md:p-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/15 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 border border-white/20 hover:border-white rounded-full text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display-luxury text-2xl sm:text-3xl tracking-[0.2em] uppercase font-light">
              ORGANIZER DASHBOARD
            </h1>
            <p className="text-xs font-sans-luxury text-white/50 tracking-widest mt-1">
              ZAINAB MARWAN &amp; HASAN HASSAN · 08.01.2027
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-white/90 text-xs font-sans-luxury tracking-widest uppercase font-semibold rounded transition-colors shadow-lg"
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            onClick={fetchSupabaseData}
            className="p-2.5 border border-white/20 hover:border-white rounded text-white/70 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-300 hover:bg-red-950/40 text-xs font-sans-luxury tracking-widest uppercase rounded transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#121212] border border-white/10 p-6 rounded-xl">
            <span className="text-[10px] font-sans-luxury tracking-[0.25em] text-white/50 uppercase block mb-1">
              CONFIRMED ATTENDING
            </span>
            <span className="font-display-luxury text-3xl sm:text-4xl text-white font-light">
              {stats?.rsvp.confirmedCount ?? 0}
            </span>
            <span className="text-xs text-green-400/80 block mt-2 font-sans-luxury">
              {stats?.rsvp.totalConfirmedGuests ?? 0} Total Guests
            </span>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-xl">
            <span className="text-[10px] font-sans-luxury tracking-[0.25em] text-white/50 uppercase block mb-1">
              DECLINED
            </span>
            <span className="font-display-luxury text-3xl sm:text-4xl text-white font-light">
              {stats?.rsvp.declinedCount ?? 0}
            </span>
            <span className="text-xs text-white/40 block mt-2 font-sans-luxury">Regrets</span>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-xl">
            <span className="text-[10px] font-sans-luxury tracking-[0.25em] text-white/50 uppercase block mb-1">
              PENDING NOTES
            </span>
            <span className="font-display-luxury text-3xl sm:text-4xl text-white font-light">
              {stats?.guestbook.pendingCount ?? 0}
            </span>
            <span className="text-xs text-amber-300/80 block mt-2 font-sans-luxury">Needs Review</span>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-xl">
            <span className="text-[10px] font-sans-luxury tracking-[0.25em] text-white/50 uppercase block mb-1">
              APPROVED NOTES
            </span>
            <span className="font-display-luxury text-3xl sm:text-4xl text-white font-light">
              {stats?.guestbook.approvedCount ?? 0}
            </span>
            <span className="text-xs text-white/40 block mt-2 font-sans-luxury">Published Online</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-4">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-sans-luxury tracking-widest uppercase transition-all ${
              activeTab === 'rsvps'
                ? 'bg-white text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={14} />
            <span>RSVP Guests ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guestbook')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-sans-luxury tracking-widest uppercase transition-all ${
              activeTab === 'guestbook'
                ? 'bg-white text-black font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare size={14} />
            <span>Guestbook Notes ({guestbookNotes.length})</span>
          </button>
        </div>

        {/* RSVP TABLE */}
        {activeTab === 'rsvps' && (
          <div className="bg-[#101010] border border-white/15 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <h2 className="font-serif-luxury text-xl sm:text-2xl uppercase tracking-[0.18em] font-light">
                RSVP GUEST LIST ({filteredRsvps.length})
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                    placeholder="Search guest..."
                    className="bg-black/50 border border-white/20 text-xs text-white pl-9 pr-3 py-2 rounded focus:outline-none focus:border-white font-sans-luxury w-48 sm:w-64"
                  />
                </div>

                <div className="flex items-center border border-white/20 rounded overflow-hidden text-xs font-sans-luxury">
                  <button
                    onClick={() => setRsvpFilter('all')}
                    className={`px-3 py-2 ${rsvpFilter === 'all' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setRsvpFilter('yes')}
                    className={`px-3 py-2 ${rsvpFilter === 'yes' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    Attending
                  </button>
                  <button
                    onClick={() => setRsvpFilter('no')}
                    className={`px-3 py-2 ${rsvpFilter === 'no' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    Declined
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left text-xs font-sans-luxury border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-white/50 tracking-wider uppercase">
                    <th className="py-3 px-4 font-normal">Guest Name</th>
                    <th className="py-3 px-4 font-normal">Status</th>
                    <th className="py-3 px-4 font-normal">Seats</th>
                    <th className="py-3 px-4 font-normal">Dietary / Contact</th>
                    <th className="py-3 px-4 font-normal">Notes</th>
                    <th className="py-3 px-4 font-normal">Date</th>
                    <th className="py-3 px-4 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-white/40">
                        No RSVPs found in Supabase.
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-medium text-white text-sm">{rsvp.name}</td>
                        <td className="py-4 px-4">
                          {rsvp.attending === 'yes' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-950/70 border border-green-500/40 text-green-300 text-[10px] tracking-wider uppercase">
                              <CheckCircle2 size={11} /> Attending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-[10px] tracking-wider uppercase">
                              <XCircle size={11} /> Declined
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-white/80 font-bold">{rsvp.guestCount}</td>
                        <td className="py-4 px-4 text-white/60">{rsvp.contact || '—'}</td>
                        <td className="py-4 px-4 text-white/70 max-w-xs truncate">{rsvp.notes || '—'}</td>
                        <td className="py-4 px-4 text-white/40">
                          {new Date(rsvp.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteRsvp(rsvp.id)}
                            className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GUESTBOOK MODERATION */}
        {activeTab === 'guestbook' && (
          <div className="bg-[#101010] border border-white/15 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <h2 className="font-serif-luxury text-xl sm:text-2xl uppercase tracking-[0.18em] font-light">
                GUESTBOOK MODERATION
              </h2>

              <div className="flex items-center border border-white/20 rounded overflow-hidden text-xs font-sans-luxury">
                <button
                  onClick={() => setGbFilter('pending')}
                  className={`px-3 py-2 ${gbFilter === 'pending' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Pending ({stats?.guestbook.pendingCount ?? 0})
                </button>
                <button
                  onClick={() => setGbFilter('approved')}
                  className={`px-3 py-2 ${gbFilter === 'approved' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Approved ({stats?.guestbook.approvedCount ?? 0})
                </button>
                <button
                  onClick={() => setGbFilter('hidden')}
                  className={`px-3 py-2 ${gbFilter === 'hidden' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  Hidden
                </button>
                <button
                  onClick={() => setGbFilter('all')}
                  className={`px-3 py-2 ${gbFilter === 'all' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredNotes.length === 0 ? (
                <div className="col-span-full py-12 text-center text-white/40 font-sans-luxury text-xs tracking-widest border border-white/5 p-8">
                  No guestbook notes found.
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div key={note.id} className="bg-black/60 border border-white/10 p-5 rounded-lg flex flex-col justify-between">
                    <div>
                      {note.photoUrl && (
                        <div className="aspect-video rounded overflow-hidden mb-3 bg-black">
                          <img src={note.photoUrl} alt={note.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans-luxury text-xs text-white font-bold uppercase tracking-wider">{note.name}</span>
                        <span className={`text-[9px] font-sans-luxury uppercase px-2 py-0.5 rounded ${
                          note.status === 'approved' ? 'bg-green-950 text-green-300 border border-green-500/30' :
                          note.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {note.status}
                        </span>
                      </div>
                      <p className="font-serif-luxury text-sm text-white/85 italic mb-4">"{note.message}"</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-sans-luxury text-white/40">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {note.status !== 'approved' && (
                          <button
                            onClick={() => handleGuestbookAction(note.id, 'approved')}
                            className="px-2.5 py-1 bg-green-900/60 hover:bg-green-800 text-green-200 text-[10px] font-sans-luxury tracking-wider uppercase rounded transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {note.status !== 'hidden' && (
                          <button
                            onClick={() => handleGuestbookAction(note.id, 'hidden')}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-sans-luxury tracking-wider uppercase rounded transition-colors"
                          >
                            Hide
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteGuestbook(note.id)}
                          className="p-1 text-white/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};