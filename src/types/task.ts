export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timerDuration?: number; // Duration in minutes
  timerActive?: boolean;
}