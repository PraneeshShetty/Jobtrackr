import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import JobDetailModal from './JobDetailModal';
import AddJobModal from './AddJobModal';
import EditJobModal from './EditJobModal';
import initialData from './data';
import ListView from './ListView';

const Board = ({ showAddModal, setShowAddModal, searchQuery = '', statusFilter = 'all', priorityFilter = 'all', view = 'board' }) => {
  const [boardData, setBoardData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('jobTrackerData');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  // Save to localStorage whenever boardData changes
  useEffect(() => {
    localStorage.setItem('jobTrackerData', JSON.stringify(boardData));
  }, [boardData]);

  const handleCardClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setEditingJob(null);
  };

  // Add new job
  const handleAddJob = (jobData) => {
    const newJob = {
      id: `task-${Date.now()}`,
      company: jobData.company,
      role: jobData.role,
      url: jobData.url,
      notes: jobData.notes,
      columnId: jobData.columnId,
      priority: jobData.priority || 'medium',
      tags: (jobData.tags || []).filter(Boolean),
      dueDate: jobData.dueDate || ''
    };

    setBoardData(prev => {
      const column = prev[jobData.columnId];
      return {
        ...prev,
        [jobData.columnId]: {
          ...column,
          tasks: [...column.tasks, newJob]
        }
      };
    });
  };

  // Edit existing job
  const handleEditJob = (updatedJob) => {
    const oldColumnId = updatedJob.columnId;
    const newColumnId = updatedJob.newColumnId;

    setBoardData(prev => {
      // If column hasn't changed, just update the job
      if (oldColumnId === newColumnId) {
        const column = prev[oldColumnId];
        return {
          ...prev,
          [oldColumnId]: {
            ...column,
            tasks: column.tasks.map(task =>
              task.id === updatedJob.id
                ? {
                    ...task,
                    company: updatedJob.company,
                    role: updatedJob.role,
                    url: updatedJob.url,
                    notes: updatedJob.notes,
                    priority: updatedJob.priority || task.priority || 'medium',
                    tags: (updatedJob.tags || task.tags || []).filter(Boolean),
                    dueDate: updatedJob.dueDate || task.dueDate || ''
                  }
                : task
            )
          }
        };
      }

      // If column changed, remove from old and add to new
      const oldColumn = prev[oldColumnId];
      const newColumn = prev[newColumnId];

      const updatedTask = {
        id: updatedJob.id,
        company: updatedJob.company,
        role: updatedJob.role,
        url: updatedJob.url,
        notes: updatedJob.notes,
        columnId: newColumnId,
        priority: updatedJob.priority || 'medium',
        tags: (updatedJob.tags || []).filter(Boolean),
        dueDate: updatedJob.dueDate || ''
      };

      return {
        ...prev,
        [oldColumnId]: {
          ...oldColumn,
          tasks: oldColumn.tasks.filter(task => task.id !== updatedJob.id)
        },
        [newColumnId]: {
          ...newColumn,
          tasks: [...newColumn.tasks, updatedTask]
        }
      };
    });
  };

  // Delete job
  const handleDeleteJob = (job) => {
    setBoardData(prev => {
      const column = prev[job.columnId];
      return {
        ...prev,
        [job.columnId]: {
          ...column,
          tasks: column.tasks.filter(task => task.id !== job.id)
        }
      };
    });
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = boardData[source.droppableId];
    const destColumn = boardData[destination.droppableId];

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      const newColumn = {
        ...sourceColumn,
        tasks: newTasks,
      };

      setBoardData({
        ...boardData,
        [newColumn.id]: newColumn,
      });
    } else {
      // Moving to a different column
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);

      // Update the task's columnId
      const updatedTask = {
        ...movedTask,
        columnId: destination.droppableId
      };

      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, updatedTask);

      const newSourceColumn = {
        ...sourceColumn,
        tasks: sourceTasks,
      };

      const newDestColumn = {
        ...destColumn,
        tasks: destTasks,
      };

      setBoardData({
        ...boardData,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  // Derived helpers
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const columnTitleById = useMemo(() => {
    const map = {};
    Object.values(boardData).forEach(col => { map[col.id] = col.title; });
    return map;
  }, [boardData]);

  const filteredBoard = useMemo(() => {
    const shouldFilterStatus = statusFilter !== 'all';
    const shouldFilterPriority = priorityFilter !== 'all';

    const filterTask = (task) => {
      // Priority filter
      if (shouldFilterPriority) {
        const p = (task.priority || 'medium').toLowerCase();
        if (p !== priorityFilter) return false;
      }
      // Search filter
      if (normalizedQuery) {
        const hay = [task.company, task.role, task.notes, (task.tags || []).join(' ')].join(' ').toLowerCase();
        if (!hay.includes(normalizedQuery)) return false;
      }
      return true;
    };

    const result = {};
    Object.values(boardData).forEach(col => {
      // Status filter: keep only the selected column title
      if (shouldFilterStatus && columnTitleById[col.id] !== statusFilter) {
        if (view === 'board') {
          // In board view, skip non-selected columns
          return;
        }
      }
      result[col.id] = { ...col, tasks: col.tasks.filter(filterTask) };
    });
    return result;
  }, [boardData, normalizedQuery, statusFilter, priorityFilter, view, columnTitleById]);

  const allTasksFlat = useMemo(() => {
    const arr = [];
    Object.values(boardData).forEach(col => {
      col.tasks.forEach(t => arr.push({ ...t, statusTitle: col.title }));
    });
    return arr;
  }, [boardData]);

  const stats = useMemo(() => {
    const total = allTasksFlat.length;
    const byStatus = allTasksFlat.reduce((acc, t) => {
      acc[t.statusTitle] = (acc[t.statusTitle] || 0) + 1;
      return acc;
    }, {});
    const offers = byStatus['Offer'] || 0;
    const accepted = byStatus['Accepted'] || 0;
    return { total, byStatus, offers, accepted };
  }, [allTasksFlat]);

  const StatsBar = () => (
    <div className="px-4 pt-4">
      <div className="flex gap-3 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-gray-200 text-sm">Total: <b>{stats.total}</b></span>
        {['Wishlist','Applied','Phone Screen','Technical Interview','Final Round','Offer','Accepted','Rejected'].map(k => (
          <span key={k} className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-gray-200 text-sm">
            {k}: <b>{stats.byStatus[k] || 0}</b>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <StatsBar />

      {view === 'list' ? (
        <div className="p-4">
          <ListView
            tasks={allTasksFlat.filter(t => {
              const statusOk = statusFilter === 'all' || t.statusTitle === statusFilter;
              const p = (t.priority || 'medium').toLowerCase();
              const priorityOk = priorityFilter === 'all' || p === priorityFilter;
              const hay = [t.company, t.role, t.notes, (t.tags || []).join(' ')].join(' ').toLowerCase();
              const searchOk = !normalizedQuery || hay.includes(normalizedQuery);
              return statusOk && priorityOk && searchOk;
            })}
            onEdit={(job) => setEditingJob(job)}
            onDelete={handleDeleteJob}
            onOpen={(job) => setSelectedJob(job)}
          />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex overflow-x-auto p-4">
            {Object.values(filteredBoard).map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={column.tasks}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={handleCloseModal}
          onEdit={(job) => {
            setEditingJob(job);
          }}
          onDelete={handleDeleteJob}
        />
      )}

      {showAddModal && (
        <AddJobModal
          onClose={handleCloseAddModal}
          onAdd={(data) => handleAddJob({
            ...data,
            // parse tags from comma-separated string if provided
            tags: typeof data.tags === 'string' ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : data.tags
          })}
          columns={boardData}
        />
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={handleCloseEditModal}
          onSave={(data) => handleEditJob({
            ...data,
            tags: typeof data.tags === 'string' ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : data.tags
          })}
          columns={boardData}
        />
      )}
    </>
  );
};

export default Board;
