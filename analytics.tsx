import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey: ["/api/habits"],
    retry: false,
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/goals"],
    retry: false,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ["/api/habit-completions"],
    retry: false,
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

  const getHabitPerformance = () => {
    if (!habits || !completions) return [];
    
    return habits.map((habit: any) => {
      const habitCompletions = completions.filter((c: any) => c.habitId === habit.id);
      const last7Days = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const completed = habitCompletions.some((c: any) => c.completedDate === dateStr);
        last7Days.push(completed);
      }
      
      const completionRate = (last7Days.filter(Boolean).length / 7) * 100;
      
      return {
        ...habit,
        completionRate,
        last7Days
      };
    });
  };

  const getGoalAnalytics = () => {
    if (!goals) return { total: 0, completed: 0, active: 0, averageProgress: 0 };
    
    const total = goals.length;
    const completed = goals.filter((g: any) => g.status === 'completed').length;
    const active = goals.filter((g: any) => g.status === 'active').length;
    const averageProgress = goals.reduce((sum: number, g: any) => sum + (g.progress || 0), 0) / total;
    
    return { total, completed, active, averageProgress };
  };

  const getFinancialAnalytics = () => {
    if (!transactions) return { totalIncome: 0, totalExpenses: 0, netIncome: 0, transactionCount: 0 };
    
    const income = transactions.filter((t: any) => t.type === 'income');
    const expenses = transactions.filter((t: any) => t.type === 'expense');
    
    const totalIncome = income.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    const totalExpenses = expenses.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    const netIncome = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, netIncome, transactionCount: transactions.length };
  };

  const habitPerformance = getHabitPerformance();
  const goalAnalytics = getGoalAnalytics();
  const financialAnalytics = getFinancialAnalytics();

  return (
    <div className="pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-600">Track your progress and identify patterns</p>
      </div>

      {/* Overview Stats */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current Streak</p>
                  <p className="text-2xl font-bold text-slate-800">{stats?.currentStreak || 0}</p>
                </div>
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Habit Rate</p>
                  <p className="text-2xl font-bold text-slate-800">{stats?.habitCompletionRate || 0}%</p>
                </div>
                <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Goal Progress</p>
                  <p className="text-2xl font-bold text-slate-800">{Math.round(goalAnalytics.averageProgress)}%</p>
                </div>
                <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Net Income</p>
                  <p className="text-2xl font-bold text-slate-800">${Math.round(financialAnalytics.netIncome)}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Habit Performance */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Habit Performance</h2>
        {habitsLoading || completionsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {habitPerformance.map((habit: any) => (
              <Card key={habit.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-slate-800">{habit.name}</h3>
                      <p className="text-sm text-slate-500">7-day completion rate</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-800">{Math.round(habit.completionRate)}%</div>
                    </div>
                  </div>
                  <Progress value={habit.completionRate} className="h-2 mb-3" />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {habit.last7Days.map((completed: boolean, index: number) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            completed ? 'bg-primary-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant={habit.completionRate >= 70 ? 'default' : 'secondary'}>
                      {habit.completionRate >= 70 ? 'On Track' : 'Needs Attention'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Goal Analytics */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Goal Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Goal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Goals</span>
                  <span className="font-semibold">{goalAnalytics.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Goals</span>
                  <span className="font-semibold">{goalAnalytics.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed Goals</span>
                  <span className="font-semibold">{goalAnalytics.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Progress</span>
                  <span className="font-semibold">{Math.round(goalAnalytics.averageProgress)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Income</span>
                  <span className="font-semibold text-green-600">${Math.round(financialAnalytics.totalIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Expenses</span>
                  <span className="font-semibold text-red-600">${Math.round(financialAnalytics.totalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Net Income</span>
                  <span className={`font-semibold ${financialAnalytics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.round(financialAnalytics.netIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transactions</span>
                  <span className="font-semibold">{financialAnalytics.transactionCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
