import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function InstructorQuizzesPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Quizzes / Tests</h1>
      <Card>
        <CardHeader><CardTitle>Create Quizzes</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Create quizzes/tests and manage questions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
