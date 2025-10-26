import React from 'react';

const JobDetailModal = ({ job, onClose, onEdit, onDelete }) => {
  if (!job) return null;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the application for ${job.company}?`)) {
      onDelete(job);
      onClose();
    }
  };

  const priority = (job.priority || 'medium').toLowerCase();
  const priorityMeta = {
    high: { color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', label: 'High' },
    medium: { color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium' },
    low: { color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Low' }
  }[priority];

  const tags = Array.isArray(job.tags) ? job.tags : (job.tags ? String(job.tags).split(',').map(s => s.trim()).filter(Boolean) : []);

  const dueBadge = (() => {
    if (!job.dueDate) return null;
    try {
      const today = new Date();
      const due = new Date(job.dueDate);
      today.setHours(0,0,0,0);
      due.setHours(0,0,0,0);
      const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return { label: `${Math.abs(diffDays)} days overdue`, class: 'text-red-700 bg-red-50' };
      if (diffDays === 0) return { label: 'Due today', class: 'text-amber-700 bg-amber-100' };
      return { label: `Due in ${diffDays} days`, class: 'text-blue-700 bg-blue-50' };
    } catch {
      return null;
    }
  })();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-lg w-full relative animate-scale-in dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{job.company}</h2>
              <h3 className="text-lg text-gray-600 dark:text-gray-300">{job.role}</h3>
            </div>
          </div>
        </div>

        {/* Key Meta */}
        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs ${priorityMeta.text} ${priorityMeta.bg} px-2 py-1 rounded-full`}>
              Priority: {priorityMeta.label}
            </span>
            {dueBadge && (
              <span className={`text-xs ${dueBadge.class} px-2 py-1 rounded-full flex items-center gap-1`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {dueBadge.label}
              </span>
            )}
          </div>
          {tags.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span key={i} className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">#{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="space-y-4">
          {/* View Posting Button */}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Job Posting
            </a>
          )}

          {/* Notes Section */}
          {job.notes && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">Notes</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {job.notes}
              </p>
            </div>
          )}

          {!job.notes && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">No notes added yet</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              onClose();
              onEdit(job);
            }}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
