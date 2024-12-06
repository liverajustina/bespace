import { useDrop } from 'react-dnd';
import { Task } from '../types/task';
import { DraggableTaskCard } from './DraggableTaskCard';
import { Card } from 'react-bootstrap';
import { useRef } from 'react';

interface TaskBankProps {
  tasks: Task[];
  onMoveTask: (taskId: string, from: 'available' | 'today', to: 'available' | 'today', toIndex?: number) => void;
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function TaskBank({ tasks, onMoveTask, onUpdate, onDelete }: TaskBankProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    hover: (item: { id: string; source: 'available' | 'today' }, monitor) => {
      if (!ref.current) return;
      
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const cards = Array.from(ref.current.children);
      
      // Find the closest card based on mouse position
      let closestIdx = 0;
      let minDistance = Number.MAX_VALUE;
      
      cards.forEach((card, idx) => {
        const cardRect = (card as HTMLElement).getBoundingClientRect();
        const cardMiddle = cardRect.top + cardRect.height / 2;
        const distance = Math.abs(clientOffset.y - cardMiddle);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      if (item.source === 'today') {
        onMoveTask(item.id, item.source, 'available', closestIdx);
      }
    },
    drop: (item: { id: string; source: 'available' | 'today' }) => {
      if (item.source === 'today') {
        onMoveTask(item.id, item.source, 'available');
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
      className={`task-bank ${isOver ? 'bg-light' : ''}`}
    >
      {tasks.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Text className="text-muted">
            Drag activities here to remove them from your Be List
          </Card.Text>
        </Card>
      ) : (
        tasks.map((task, index) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            index={index}
            source="available"
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}