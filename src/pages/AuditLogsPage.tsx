import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/apiClient';
import { ShieldCheck, Search, Clock, FileText } from 'lucide-react';

interface AuditLogItem {
  id: number;
  username: string;
  userRole?: string;
  action: string;
  entityName?: string;
  entityId?: string;
  details?: string;
  timestamp: string;
}

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    try {
      const data = await apiFetch<AuditLogItem[]>('/audit-logs');
      setLogs(data);
    } catch {
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.username.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              System Audit & Activity Logs
            </h2>
            <p className="text-xs text-amber-200/80">
              Immutable audit trail recording administrative and financial actions
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl border border-gold-500/30 glass-mandapam flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-amber-300/60" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-amber-200/70 font-mono">
          Total Logs: {filteredLogs.length}
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-2xl border border-gold-500/30 shadow-mandapam">
        <table className="w-full text-xs text-left text-slate-700 dark:text-amber-100">
          <thead className="bg-maroon-900 text-gold-300 font-cinzel text-xs uppercase border-b border-gold-500/30">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">User & Role</th>
              <th className="p-3">Action</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/10 bg-white dark:bg-maroon-950">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-maroon-900/40 transition">
                <td className="p-3 font-mono text-[10px] text-slate-500 dark:text-amber-300/70">
                  {log.timestamp ? log.timestamp.replace('T', ' ').split('.')[0] : 'Just now'}
                </td>
                <td className="p-3 font-semibold">
                  <span className="text-slate-900 dark:text-amber-100 block">{log.username}</span>
                  <span className="text-[10px] text-gold-500 font-mono">{log.userRole || 'ADMIN'}</span>
                </td>
                <td className="p-3 font-bold text-saffron-600 dark:text-gold-300 font-mono">
                  {log.action}
                </td>
                <td className="p-3 text-slate-600 dark:text-amber-200 max-w-xs truncate">
                  {log.details || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
