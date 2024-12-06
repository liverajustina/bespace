import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container, Row, Col } from 'react-bootstrap';
import { TaskInput } from './components/TaskInput';
import { TaskBank } from './components/TaskBank';
import { TodaysList } from './components/TodaysList';
import { useTasks } from './hooks/useTasks';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    availableTasks,
    todaysTasks,
    addTask,
    moveTask,
    toggleTask,
    updateTask,
    deleteTask,
    setTaskTimer,
    toggleTaskTimer,
    resetTaskTimer
  } = useTasks();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Container className="py-5">
        <Row className="justify-content-between align-items-center mb-4">
          <Col>
            <h1 className="text-center mb-4">BeSpace</h1>
          </Col>
          <Col xs="auto">
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn btn-outline-danger"
            >
              Sign Out
            </button>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10}>
            <TaskInput onAdd={addTask} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} className="mb-4">
            <h2 className="h4 mb-3">Suggested Activities</h2>
            <TaskBank
              tasks={availableTasks}
              onMoveTask={moveTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </Col>
          <Col xs={12} md={6}>
            <h2 className="h4 mb-3">Just One Thing Today</h2>
            <TodaysList
              tasks={todaysTasks}
              onMoveTask={moveTask}
              onToggle={toggleTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onSetTimer={setTaskTimer}
              onToggleTimer={toggleTaskTimer}
              onResetTimer={resetTaskTimer}
            />
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
}