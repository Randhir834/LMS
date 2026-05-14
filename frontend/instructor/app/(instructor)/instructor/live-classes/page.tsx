'use client';

import { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { liveClassService } from '@/services/liveClassService';
import type { LiveClass } from '@/types';

export default function InstructorLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);

  useEffect(() => {
    liveClassService.getLiveClasses().then((d) => setClasses(d.liveClasses)).catch(() => setClasses([]));
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Live Classes</h1>
      <Card>
        <CardHeader><CardTitle>Scheduled Classes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {classes.length === 0 && <p className="text-sm text-text-muted">No live classes scheduled.</p>}
            {classes.map((c) => (
              <div key={c.id} className="border-b border-border-soft py-2">
                <p className="text-sm font-medium text-text-primary">{c.title}</p>
                <p className="text-xs text-text-muted">{new Date(c.scheduled_at).toLocaleString()}</p>
                <a className="text-xs font-medium text-primary-500 hover:text-primary-600" href={c.meet_link} target="_blank" rel="noreferrer">Open Google Meet</a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
