
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar tarefas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, description: string) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            user_id: user!.id,
            title,
            description: description || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      setTodos([data, ...todos]);
      toast({
        title: 'Tarefa adicionada!',
        description: 'Sua nova tarefa foi criada com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
      
      toast({
        title: completed ? 'Tarefa concluída!' : 'Tarefa reaberta',
        description: completed ? 'Parabéns por concluir a tarefa!' : 'Tarefa marcada como pendente.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: 'Tarefa removida',
        description: 'A tarefa foi removida com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateTodo = async (id: string, title: string, description: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          title, 
          description: description || null, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, title, description } : todo
      ));
      
      toast({
        title: 'Tarefa atualizada!',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando suas tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
                <p className="text-gray-600">
                  {totalCount > 0 
                    ? `${completedCount} de ${totalCount} tarefas concluídas`
                    : 'Nenhuma tarefa ainda. Que tal adicionar uma?'
                  }
                </p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Todo Form */}
        <div className="mb-6">
          <TodoForm onSubmit={addTodo} />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
              <p className="text-gray-400 mt-2">Adicione sua primeira tarefa acima!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
