import React from 'react';

const PriorityDot = ({ level = 'medium' }) => {
  const map = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-emerald-500',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${map[level] || map.medium}`}></span>;
};

const formatDue = (dueDate) => {
  if (!dueDate) return '—';
  const today = new Date();
  const due = new Date(dueDate);
  const diffMs = due.setHours(0,0,0,0) - today.setHours(0,0,0,0);
  const days = Math.ceil(diffMs / (1000*60*60*24));
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  return `${days}d`;
};

const ListView = ({ tasks, onEdit, onDelete, onOpen }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Due</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Tags</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tasks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">No jobs match your filters</td>
              </tr>
            )}
            {tasks.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3">
                  <button onClick={() => onOpen(t)} className="text-gray-900 dark:text-gray-100 font-semibold hover:text-blue-600 dark:hover:text-blue-400">
                    {t.company}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.role}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.statusTitle}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <PriorityDot level={(t.priority || 'medium').toLowerCase()} />
                  <span className="capitalize">{t.priority || 'medium'}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDue(t.dueDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(t.tags || []).slice(0,3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">{tag}</span>
                    ))}
                    {(t.tags || []).length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">+{(t.tags || []).length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(t)} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50">Edit</button>
                    <button onClick={() => onDelete(t)} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
