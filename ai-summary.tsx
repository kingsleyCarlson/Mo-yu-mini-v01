import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

export default function AiSummary() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: insights, isLoading } = useQuery({
    queryKey: ["/api/ai-insights", "daily_summary"],
    retry: false,
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/ai-insights/daily-summary", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI summary generated successfully",
      });
      // The query will automatically refetch due to invalidation
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
        description: "Failed to generate AI summary",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const latestInsight = insights?.[0];

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-xl mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Daily Summary</h3>
            <p className="text-sm text-slate-500">Generated insights from your activity</p>
          </div>
        </div>

        {latestInsight ? (
          <>
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-slate-700 text-sm leading-relaxed">
                {latestInsight.content}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {latestInsight.data?.productivity && (
                  <div className="text-sm text-slate-600">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Productivity: {latestInsight.data.productivity}%
                  </div>
                )}
                {latestInsight.data?.wellbeing && (
                  <div className="text-sm text-slate-600">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Wellbeing: {latestInsight.data.wellbeing}
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-600 hover:text-purple-700"
                onClick={() => generateSummaryMutation.mutate()}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Refresh"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 mb-4 text-center">
              <p className="text-slate-600 text-sm mb-4">
                No AI summary available yet. Generate your first personalized insight!
              </p>
              <Button 
                onClick={() => generateSummaryMutation.mutate()}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  "Generate AI Summary"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
