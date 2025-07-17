import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface HabitCardProps {
  habit: any;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleHabitMutation = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      if (isCompleted) {
        // Remove completion (simplified - would need to track completion ID)
        return;
      } else {
        await apiRequest("POST", "/api/habit-completions", {
          habitId: habit.id,
          completedDate: today,
          amount: 1
        });
      }
    },
    onSuccess: () => {
      setIsCompleted(!isCompleted);
      queryClient.invalidateQueries({ queryKey: ["/api/habit-completions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: isCompleted ? "Habit unmarked" : "Habit completed!",
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

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      book: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      dumbbell: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41 1.41M5.106 17.757l1.414-1.414m12.844-1.414l1.414 1.414M18.894 5.106l1.414 1.414M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      brain: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      check: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    };
    return iconMap[iconName] || iconMap.check;
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary-100 text-primary-500';
      case 'secondary': return 'bg-secondary-100 text-secondary-500';
      case 'accent': return 'bg-accent-100 text-accent-500';
      default: return 'bg-primary-100 text-primary-500';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(habit.color)}`}>
              {getIconComponent(habit.icon)}
            </div>
            <div>
              <h4 className="font-medium text-slate-800">{habit.name}</h4>
              <p className="text-xs text-slate-500">{habit.targetAmount} {habit.unit}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isCompleted ? "default" : "outline"}
            onClick={() => toggleHabitMutation.mutate()}
            disabled={toggleHabitMutation.isPending}
            className={`w-6 h-6 p-0 ${
              isCompleted 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'border-2 border-slate-200 hover:border-primary-500 hover:text-primary-500'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">7-day streak</div>
          <div className="flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < 5 ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
