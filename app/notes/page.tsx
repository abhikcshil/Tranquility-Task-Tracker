import { PageShell } from '@/components/page-shell';
import { getNotes } from '@/services/noteService';

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <PageShell title="Notes" description="Your saved notes.">
      {notes.length === 0 ? (
        <p className="text-sm text-zinc-300">No notes yet.</p>
      ) : (
        <ul className="space-y-2 text-sm text-zinc-200">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-zinc-800 p-3">
              <p className="font-medium">
                {note.title} {note.pinned ? <span className="text-xs text-yellow-400">• pinned</span> : null}
              </p>
              <p className="text-xs text-zinc-400">{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
