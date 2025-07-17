import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: any;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'On Track';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  const getTimeLeft = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{goal.title}</CardTitle>
            <p className="text-sm text-slate-600 mb-3">{goal.description}</p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              {goal.targetDate && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Due {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              )}
              {goal.targetDate && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{getTimeLeft(goal.targetDate)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold text-slate-800">{goal.progress || 0}%</div>
            <div className="text-xs text-slate-500">Complete</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-800 font-medium">{goal.progress || 0}%</span>
          </div>
          <Progress value={goal.progress || 0} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(goal.status)}>
              {getStatusLabel(goal.status)}
            </Badge>
            <span className="text-xs text-slate-500">3 of 4 milestones complete</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
