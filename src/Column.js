import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import JobCard from './JobCard';

const columnColors = {
  'column-1': 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
  'column-2': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  'column-3': 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
  'column-4': 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200',
  'column-5': 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
  'column-6': 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
  'column-7': 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  'column-8': 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
};

const headerColors = {
  'column-1': 'text-purple-700',
  'column-2': 'text-blue-700',
  'column-3': 'text-cyan-700',
  'column-4': 'text-teal-700',
  'column-5': 'text-yellow-700',
  'column-6': 'text-orange-700',
  'column-7': 'text-green-700',
  'column-8': 'text-red-700',
};

const badgeColors = {
  'column-1': 'bg-purple-200 text-purple-800',
  'column-2': 'bg-blue-200 text-blue-800',
  'column-3': 'bg-cyan-200 text-cyan-800',
  'column-4': 'bg-teal-200 text-teal-800',
  'column-5': 'bg-yellow-200 text-yellow-800',
  'column-6': 'bg-orange-200 text-orange-800',
  'column-7': 'bg-green-200 text-green-800',
  'column-8': 'bg-red-200 text-red-800',
};

const Column = ({ column, tasks, onCardClick }) => {
  const bgColor = columnColors[column.id] || 'bg-gray-100 border-gray-200';
  const headerColor = headerColors[column.id] || 'text-gray-700';
  const badgeColor = badgeColors[column.id] || 'bg-gray-200 text-gray-800';

  return (
    <div className="flex-shrink-0 w-80 m-2 animate-fade-in">
      <div className={`${bgColor} rounded-xl p-4 border-2 shadow-sm h-full dark:bg-gray-900 dark:border-gray-800 dark:shadow-none`}>
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-lg ${headerColor} dark:text-gray-100`}>{column.title}</h3>
          <span className={`${badgeColor} px-2.5 py-1 rounded-full text-xs font-semibold dark:bg-gray-800 dark:text-gray-200`}>
            {tasks.length}
          </span>
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[500px] rounded-lg transition-all duration-200 ${
                snapshot.isDraggingOver 
                  ? 'bg-white bg-opacity-60 ring-2 ring-blue-400 ring-opacity-50 dark:bg-gray-800/70 dark:ring-blue-500/60' 
                  : 'dark:bg-transparent'
              }`}
            >
              {tasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
                  <p className="text-center">
                    No jobs yet<br/>
                    <span className="text-xs">Drag jobs here or add new ones</span>
                  </p>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <JobCard
                    key={task.id}
                    job={task}
                    index={index}
                    onClick={onCardClick}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
