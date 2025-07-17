import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JournalEntryCardProps {
  entry: any;
}

export default function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const getMoodColor = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'happy': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-blue-100 text-blue-800';
      case 'energized': return 'bg-green-100 text-green-800';
      case 'calm': return 'bg-purple-100 text-purple-800';
      case 'anxious': return 'bg-red-100 text-red-800';
      case 'grateful': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'energized': return '⚡';
      case 'calm': return '🧘';
      case 'anxious': return '😰';
      case 'grateful': return '🙏';
      default: return '😐';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-slate-800">{entry.title}</h4>
                <p className="text-sm text-slate-500">
                  {formatDate(entry.createdAt)} • {getTimeAgo(entry.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-3">
              {truncateContent(entry.content)}
            </p>
          </div>
          {entry.imageUrl && (
            <div className="ml-4 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
              <img 
                src={entry.imageUrl} 
                alt="Journal entry" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {entry.mood && (
              <div className="flex items-center space-x-1 text-sm text-slate-500">
                <span>{getMoodIcon(entry.mood)}</span>
                <span>{entry.mood}</span>
              </div>
            )}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex items-center space-x-1 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{entry.tags.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600">
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
