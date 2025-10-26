import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const JobCard = ({ job, index, onClick }) => {
  const priority = (job.priority || 'medium').toLowerCase();
  const priorityMeta = {
    high: { color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', label: 'High' },
    medium: { color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium' },
    low: { color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Low' }
  }[priority];

  const tags = Array.isArray(job.tags) ? job.tags : (job.tags ? String(job.tags).split(',').map(s => s.trim()).filter(Boolean) : []);

  const getDueBadge = () => {
    if (!job.dueDate) return null;
    try {
      const today = new Date();
      const due = new Date(job.dueDate);
      // Normalize time to avoid TZ surprises
      today.setHours(0,0,0,0);
      due.setHours(0,0,0,0);
      const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
      let label = '';
      let classes = 'text-xs px-2 py-1 rounded-full flex items-center gap-1 ';
      if (diffDays < 0) {
        label = `${Math.abs(diffDays)}d overdue`;
        classes += 'text-red-600 bg-red-50';
      } else if (diffDays === 0) {
        label = 'Due today';
        classes += 'text-amber-700 bg-amber-100';
      } else {
        label = `Due in ${diffDays}d`;
        classes += 'text-blue-700 bg-blue-50';
      }
      return (
        <span className={classes}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {label}
        </span>
      );
    } catch {
      return null;
    }
  };

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(job)}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 cursor-pointer transition-all duration-200 border border-gray-100 dark:border-gray-700 group dark:text-gray-100
            ${snapshot.isDragging 
              ? 'shadow-2xl rotate-2 scale-105 ring-2 ring-blue-400 dark:ring-blue-500' 
              : 'hover:shadow-xl hover:-translate-y-1'
            }`}
        >
          {/* Company Name with Priority Dot and Drag Indicator */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${priorityMeta.color}`} aria-hidden />
                <h4 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                  {job.company}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">{job.role}</p>
            </div>
            <div className="ml-2 text-gray-300 group-hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
              </svg>
            </div>
          </div>

          {/* Badges Row: priority, due, link, notes */}
          <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {/* Priority */}
            <span className={`text-xs ${priorityMeta.text} ${priorityMeta.bg} px-2 py-1 rounded-full`}>{priorityMeta.label}</span>

            {/* Due */}
            {getDueBadge()}

            {/* Link */}
            {job.url && (
              <span className="text-xs text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Link
              </span>
            )}

            {/* Notes */}
            {job.notes && (
              <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/60 px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Notes
              </span>
            )}

            {/* Tags */}
            {tags.slice(0, 2).map((t, i) => (
              <span key={i} className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">#{t}</span>
            ))}
            {tags.length > 2 && (
              <span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">+{tags.length - 2}</span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;
