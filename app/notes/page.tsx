import { NoteList } from '@/components/ui/note-list';
import { SectionCard } from '@/components/ui/section-card';
import { getNotes } from '@/services/noteService';

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Notes</h1>
        <p className="text-sm text-zinc-400">Your captured thoughts and pinned context.</p>
      </header>

      <SectionCard title="All notes" description="Pinned notes stay visible at the top.">
        <NoteList notes={notes} />
      </SectionCard>
    </div>
  );
}
