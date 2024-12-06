import { useState } from 'react';
import { Form, Button, InputGroup, Modal } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';

interface TaskInputProps {
  onAdd: (title: string, description: string) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setShowModal(true);
    }
  };

  const handleSave = () => {
    if (title.trim()) {
      onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setDescription('');
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="How do you let go of the need to 'do' and just 'be'?"
          />
          <Button type="submit" variant="primary" className="d-flex align-items-center">
            <FiPlus className="me-2" /> Let Me Be
          </Button>
        </InputGroup>
      </Form>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your mindfulness activity..."
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Activity
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}