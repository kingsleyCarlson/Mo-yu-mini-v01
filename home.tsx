import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import StatsCard from "@/components/stats-card";
import HabitCard from "@/components/habit-card";
import GoalCard from "@/components/goal-card";
import JournalEntryCard from "@/components/journal-entry-card";
import AiSummary from "@/components/ai-summary";
import FinancialSummary from "@/components/financial-summary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  const { data: journalEntries, isLoading: journalLoading } = useQuery({
    queryKey: ["/api/journal-entries"],
    retry: false,
  });

  const { data: aiInsights, isLoading: aiLoading } = useQuery({
    queryKey: ["/api/ai-insights"],
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

  const userName = user?.firstName || "there";
  const activeHabits = habits?.filter((habit: any) => habit.isActive)?.slice(0, 3) || [];
  const activeGoals = goals?.filter((goal: any) => goal.status === 'active')?.slice(0, 2) || [];
  const recentEntries = journalEntries?.slice(0, 2) || [];

  return (
    <div className="pb-6">
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Good morning, {userName}! 🌱</h2>
          <p className="text-white/90 mb-4">Ready to grow today? You're on a {stats?.currentStreak || 0}-day streak!</p>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-sm font-medium">Today's Focus</div>
              <div className="text-xs opacity-90">
                {activeGoals.length} goals • {activeHabits.length} habits • {recentEntries.length} entries
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Quick Entry
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Current Streak"
            value={stats?.currentStreak || 0}
            icon="fire"
            color="primary"
            loading={statsLoading}
          />
          <StatsCard
            title="Goals Progress"
            value={`${stats?.goalProgress || 0}%`}
            icon="target"
            color="secondary"
            loading={statsLoading}
          />
          <StatsCard
            title="Habits"
            value={`${stats?.habitsCompleted || 0}/${stats?.totalHabits || 0}`}
            icon="check-circle"
            color="accent"
            loading={statsLoading}
          />
          <StatsCard
            title="Income"
            value={`$${stats?.monthlyIncome || 0}`}
            icon="dollar-sign"
            color="green"
            loading={statsLoading}
          />
        </div>
      </section>

      {/* Today's Habits */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Today's Habits</h3>
          <Button variant="ghost" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            View All
          </Button>
        </div>
        {habitsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeHabits.map((habit: any) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </section>

      {/* Active Goals */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Active Goals</h3>
          <Button variant="ghost" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Goal
          </Button>
        </div>
        {goalsLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map((goal: any) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Journal Entries */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Recent Journal Entries</h3>
          <Button variant="ghost" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Entry
          </Button>
        </div>
        {journalLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentEntries.map((entry: any) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>

      {/* Financial Summary */}
      <section className="mb-8">
        <FinancialSummary />
      </section>

      {/* AI Daily Summary */}
      <section className="mb-8">
        <AiSummary />
      </section>
    </div>
  );
}
