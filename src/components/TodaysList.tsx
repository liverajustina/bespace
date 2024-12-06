import { useDrop } from 'react-dnd';
import { Task } from '../types/task';
import { DraggableTaskCard } from './DraggableTaskCard';
import { Card } from 'react-bootstrap';
import { useRef } from 'react';

interface TodaysListProps {
  tasks: Task[];
  onMoveTask: (taskId: string, from: 'available' | 'today', to: 'available' | 'today', toIndex?: number) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onSetTimer: (id: string, duration: number) => void;
  onToggleTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
}

export function TodaysList({
  tasks,
  onMoveTask,
  onToggle,
  onUpdate,
  onDelete,
  onSetTimer,
  onToggleTimer,
  onResetTimer
}: TodaysListProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string; source: 'available' | 'today' }) => {
      if (item.source !== 'today') {
        onMoveTask(item.id, item.source, 'today');
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`todays-list ${isOver ? 'bg-light' : ''}`}
    >
      {tasks.length === 0 ? (
        <Card className="text-center p-4">
          <div className="text-start text-muted">
            <p className="mb-3">
              Life pulls us in many directions, but there's power in focusing on just one thing—a single, intentional act to slow down, breathe, and reconnect with yourself.
            </p>
            <p className="mb-0">
              Drag a suggested activity to this list to start on it, or create your own just 'be' activity.
            </p>
          </div>
        </Card>
      ) : (
        tasks.map((task, index) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            index={index}
            source="today"
            onMoveTask={onMoveTask}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSetTimer={onSetTimer}
            onToggleTimer={onToggleTimer}
            onResetTimer={onResetTimer}
          />
        ))
      )}
    </div>
  );
}