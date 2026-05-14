'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function PdfViewerPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">PDF Viewer</h1>
      <Card>
        <CardHeader><CardTitle>Course Material</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">PDF content will be rendered here.</p>
          <div className="mt-4 aspect-[3/4] bg-hover rounded-lg flex items-center justify-center">
            <span className="text-sm text-text-muted">PDF Preview</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
