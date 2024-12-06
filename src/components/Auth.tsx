import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      setMessage({
        type: 'success',
        text: 'Check your email for the login link!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={6} lg={4}>
          <div className="text-center mb-4">
            <h1 className="h3 mb-3">Welcome to BeSpace</h1>
            <p className="text-muted mb-0">Discover the simplicity of being—sign in to reconnect with yourself and the present moment.</p>
          </div>

          {message && (
            <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="mb-4">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Form.Text className="text-muted">
                We'll send you a magic link to sign in
              </Form.Text>
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending magic link...' : 'Send magic link'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}