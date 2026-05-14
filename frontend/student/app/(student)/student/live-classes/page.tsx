'use client';

import { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { liveClassService } from '@/services/liveClassService';
import type { LiveClass } from '@/types';

export default function StudentLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);

  useEffect(() => {
    liveClassService.getLiveClasses().then((d) => setClasses(d.liveClasses)).catch(() => setClasses([]));
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Live Classes</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">Join your scheduled live classes</p>
        </div>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Upcoming Classes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {classes.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-text-muted">No upcoming live classes.</p>
              </div>
            )}
            {classes.map((c) => (
              <div key={c.id} className="border border-border rounded-lg p-3 sm:p-4 hover:border-primary-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-text-primary truncate">{c.title}</p>
                    <p className="text-xs sm:text-sm text-text-muted">{new Date(c.scheduled_at).toLocaleString()}</p>
                  </div>
                  <a 
                    className="inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors min-h-[44px] sm:min-h-0" 
                    href={c.meet_link} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    Join Google Meet
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
