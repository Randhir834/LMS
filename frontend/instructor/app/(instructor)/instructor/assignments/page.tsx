import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function InstructorAssignmentsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Assignments</h1>
      <Card>
        <CardHeader><CardTitle>Create Assignments</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Create assignments and review student submissions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
