import { useDrag } from 'react-dnd';
import { Task } from '../types/task';
import { Card, Form, Button, ButtonGroup } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { Timer } from './Timer';

interface DraggableTaskCardProps {
  task: Task;
  index: number;
  source: 'available' | 'today';
  onMoveTask?: (taskId: string, from: 'available' | 'today', to: 'available' | 'today', toIndex?: number) => void;
  onToggle?: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onSetTimer?: (id: string, duration: number) => void;
  onToggleTimer?: (id: string) => void;
  onResetTimer?: (id: string) => void;
}

export function DraggableTaskCard({
  task,
  source,
  onMoveTask,
  onToggle,
  onUpdate,
  onDelete,
  onSetTimer,
  onToggleTimer,
  onResetTimer
}: DraggableTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [showDurationSelect, setShowDurationSelect] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, source },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSubmit = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, editedTitle.trim(), editedDescription.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const handleSetTimer = (duration: number) => {
    if (onSetTimer) {
      onSetTimer(task.id, duration);
      setShowDurationSelect(false);
    }
  };

  return (
    <Card
      ref={drag}
      className={`task-card mb-2 ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          {isEditing ? (
            <div className="flex-grow-1">
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Task title"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Task description"
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleSubmit}
                  className="d-flex align-items-center"
                >
                  <FiCheck className="me-1" /> Save
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleCancel}
                  className="d-flex align-items-center"
                >
                  <FiX className="me-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <span className="flex-grow-1">
                  {task.title}
                </span>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="d-flex align-items-center"
                  >
                    <FiEdit2 />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="d-flex align-items-center"
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </div>
              <Card.Text className="text-muted small mb-0">
                {task.description}
              </Card.Text>

              {source === 'today' && onSetTimer && (
                <div className="mt-3">
                  {!task.timerDuration ? (
                    <>
                      <Button 
                        variant="primary" 
                        className="w-100" 
                        onClick={() => setShowDurationSelect(true)}
                      >
                        Experience this life fully
                      </Button>
                      {showDurationSelect && (
                        <>
                          <p className="text-center mt-3 mb-2">
                            How much time do you want to give to yourself?
                          </p>
                          <ButtonGroup className="w-100">
                            <Button variant="outline-primary" onClick={() => handleSetTimer(5)}>5 mins</Button>
                            <Button variant="outline-primary" onClick={() => handleSetTimer(10)}>10 mins</Button>
                            <Button variant="outline-primary" onClick={() => handleSetTimer(15)}>15 mins</Button>
                          </ButtonGroup>
                        </>
                      )}
                    </>
                  ) : (
                    <Timer
                      duration={task.timerDuration}
                      isActive={task.timerActive || false}
                      onComplete={() => onResetTimer?.(task.id)}
                      onToggle={() => onToggleTimer?.(task.id)}
                      onReset={() => onResetTimer?.(task.id)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}