import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { initialTasks } from '../data/initialTasks';
import { supabase } from '../lib/supabase';

export function useTasks() {
  const [availableTasks, setAvailableTasks] = useState<Task[]>(initialTasks);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const userTasks = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          timerDuration: task.timer_duration,
          timerActive: task.timer_active
        }));

        // Separate tasks into available and today's tasks
        const today = userTasks.filter(task => task.timerDuration !== null);
        const available = userTasks.filter(task => task.timerDuration === null);

        setTodaysTasks(today);
        setAvailableTasks([...initialTasks, ...available]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  const addTask = async (title: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newTask = {
        title,
        description,
        user_id: user.id,
        completed: false,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const task: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          completed: data.completed,
        };
        setAvailableTasks([...availableTasks, task]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const moveTask = async (
    taskId: string,
    from: 'available' | 'today',
    to: 'available' | 'today',
    toIndex?: number
  ) => {
    if (from === to) return;

    try {
      const sourceList = from === 'available' ? availableTasks : todaysTasks;
      const task = sourceList.find(t => t.id === taskId);
      
      if (!task) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (from === 'available' && to === 'today') {
        if (todaysTasks.length > 0) {
          const existingTask = todaysTasks[0];
          await supabase
            .from('tasks')
            .update({ timer_duration: null, timer_active: false })
            .eq('id', existingTask.id);

          setAvailableTasks([...availableTasks.filter(t => t.id !== taskId), existingTask]);
        } else {
          setAvailableTasks(availableTasks.filter(t => t.id !== taskId));
        }
        setTodaysTasks([task]);
      } else if (from === 'today' && to === 'available') {
        await supabase
          .from('tasks')
          .update({ timer_duration: null, timer_active: false })
          .eq('id', task.id);

        setTodaysTasks([]);
        if (typeof toIndex === 'number') {
          const newAvailableTasks = [...availableTasks];
          newAvailableTasks.splice(toIndex, 0, task);
          setAvailableTasks(newAvailableTasks);
        } else {
          setAvailableTasks([...availableTasks, task]);
        }
      }
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = todaysTasks.find(t => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;

      setTodaysTasks(todaysTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const updateTask = async (id: string, title: string, description: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ title, description })
        .eq('id', id);

      if (error) throw error;

      setAvailableTasks(availableTasks.map(task =>
        task.id === id ? { ...task, title, description } : task
      ));
      setTodaysTasks(todaysTasks.map(task =>
        task.id === id ? { ...task, title, description } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAvailableTasks(availableTasks.filter(task => task.id !== id));
      setTodaysTasks(todaysTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const setTaskTimer = async (id: string, duration: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ timer_duration: duration, timer_active: false })
        .eq('id', id);

      if (error) throw error;

      setTodaysTasks(todaysTasks.map(task =>
        task.id === id ? { ...task, timerDuration: duration, timerActive: false } : task
      ));
    } catch (error) {
      console.error('Error setting timer:', error);
    }
  };

  const toggleTaskTimer = async (id: string) => {
    try {
      const task = todaysTasks.find(t => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ timer_active: !task.timerActive })
        .eq('id', id);

      if (error) throw error;

      setTodaysTasks(todaysTasks.map(task =>
        task.id === id ? { ...task, timerActive: !task.timerActive } : task
      ));
    } catch (error) {
      console.error('Error toggling timer:', error);
    }
  };

  const resetTaskTimer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ timer_active: false })
        .eq('id', id);

      if (error) throw error;

      setTodaysTasks(todaysTasks.map(task =>
        task.id === id ? { ...task, timerActive: false } : task
      ));
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  };

  return {
    availableTasks,
    todaysTasks,
    loading,
    addTask,
    moveTask,
    toggleTask,
    updateTask,
    deleteTask,
    setTaskTimer,
    toggleTaskTimer,
    resetTaskTimer,
  };
}