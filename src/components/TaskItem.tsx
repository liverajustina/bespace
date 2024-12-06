import { useState } from 'react';
import { Task } from '../types/task';
import { Card, Form, Button } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSubmit = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  return (
    <Card className="task-card mb-2">
      <Card.Body className="d-flex align-items-center">
        <Form.Check
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="me-3"
        />
        
        {isEditing ? (
          <div className="d-flex flex-grow-1 gap-2">
            <Form.Control
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
            />
            <Button
              variant="success"
              size="sm"
              onClick={handleSubmit}
              className="d-flex align-items-center"
            >
              <FiCheck />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              className="d-flex align-items-center"
            >
              <FiX />
            </Button>
          </div>
        ) : (
          <>
            <span className={task.completed ? 'completed-task flex-grow-1' : 'flex-grow-1'}>
              {task.title}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="me-2 d-flex align-items-center"
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
          </>
        )}
      </Card.Body>
    </Card>
  );
}