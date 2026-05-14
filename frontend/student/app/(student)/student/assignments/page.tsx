import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function StudentAssignmentsPage() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Assignments</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">View and submit your assignments</p>
        </div>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Submit Assignments</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-text-muted">View assignments and submit your work.</p>
        </CardContent>
      </Card>
    </div>
  );
}
