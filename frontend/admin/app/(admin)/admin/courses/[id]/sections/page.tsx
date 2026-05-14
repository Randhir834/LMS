'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminSectionsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Course Sections</h1>
      <Card>
        <CardHeader><CardTitle>Add Section</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Section Title" id="title" required />
            <Button type="submit" className="w-full sm:w-auto">Add Section</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Sections List</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">Sections will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
