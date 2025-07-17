import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddHabitDialog from "@/components/dialogs/add-habit-dialog";

export default function Habits() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [addHabitOpen, setAddHabitOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey: ["/api/habits"],
    retry: false,
  });

  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ["/api/habit-completions"],
    retry: false,
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async (habitId: number) => {
      const today = new Date().toISOString().split('T')[0];
      const existingCompletion = completions?.find((c: any) => 
        c.habitId === habitId && c.completedDate === today
      );

      if (existingCompletion) {
        await apiRequest("DELETE", `/api/habit-completions/${existingCompletion.id}`);
      } else {
        await apiRequest("POST", "/api/habit-completions", {
          habitId,
          completedDate: today,
          amount: 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habit-completions"] });
      toast({
        title: "Success",
        description: "Habit updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getHabitStreak = (habitId: number) => {
    if (!completions) return 0;
    
    const habitCompletions = completions
      .filter((c: any) => c.habitId === habitId)
      .sort((a: any, b: any) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < habitCompletions.length; i++) {
      const completionDate = new Date(habitCompletions[i].completedDate);
      const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const isCompletedToday = (habitId: number) => {
    if (!completions) return false;
    const today = new Date().toISOString().split('T')[0];
    return completions.some((c: any) => c.habitId === habitId && c.completedDate === today);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      book: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      dumbbell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41 1.41M5.106 17.757l1.414-1.414m12.844-1.414l1.414 1.414M18.894 5.106l1.414 1.414M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      brain: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      check: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    };
    return iconMap[iconName] || iconMap.check;
  };

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Habits</h1>
          <p className="text-slate-600">Build lasting habits, one day at a time</p>
        </div>
        <Button 
          onClick={() => setAddHabitOpen(true)}
          className="bg-primary-500 hover:bg-primary-600"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Habit
        </Button>
      </div>

      {habitsLoading || completionsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3 mb-3"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : habits && habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit: any) => {
            const completed = isCompletedToday(habit.id);
            const streak = getHabitStreak(habit.id);
            
            return (
              <Card key={habit.id} className={`hover:shadow-lg transition-all ${completed ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        habit.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                        habit.color === 'secondary' ? 'bg-secondary-100 text-secondary-600' :
                        habit.color === 'accent' ? 'bg-accent-100 text-accent-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {getIconComponent(habit.icon)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{habit.name}</h4>
                        <p className="text-xs text-slate-500">{habit.targetAmount} {habit.unit}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={completed ? "default" : "outline"}
                      onClick={() => toggleHabitMutation.mutate(habit.id)}
                      disabled={toggleHabitMutation.isPending}
                      className={`w-8 h-8 p-0 ${
                        completed 
                          ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                          : 'border-2 border-slate-200 hover:border-primary-500 hover:text-primary-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </Button>
                  </div>
                  
                  {habit.description && (
                    <p className="text-sm text-slate-600 mb-3">{habit.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {streak}-day streak
                      </Badge>
                      {!habit.isActive && (
                        <Badge variant="outline">Paused</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabitMutation.mutate(habit.id)}
                      disabled={deleteHabitMutation.isPending}
                      className="text-red-600 hover:text-red-700 p-1 h-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No habits yet</h3>
            <p className="text-slate-600 mb-4">Start building positive habits today</p>
            <Button onClick={() => setAddHabitOpen(true)} className="bg-primary-500 hover:bg-primary-600">
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      )}

      <AddHabitDialog open={addHabitOpen} onOpenChange={setAddHabitOpen} />
    </div>
  );
}
