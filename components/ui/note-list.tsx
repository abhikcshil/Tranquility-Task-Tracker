import type { NoteListItem } from '@/services/noteService';
import { EmptyState } from '@/components/ui/empty-state';

type NoteListProps = {
  notes: NoteListItem[];
  emptyTitle?: string;
  emptyMessage?: string;
};

export function NoteList({ notes, emptyTitle = 'No notes yet', emptyMessage = 'Your notes will appear here.' }: NoteListProps) {
  if (notes.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <ul className="space-y-2 text-sm">
      {notes.map((note) => (
        <li key={note.id} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
          <p className="font-medium text-zinc-100">
            {note.title}
            {note.pinned ? <span className="ml-2 text-xs text-amber-400">Pinned</span> : null}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{note.content}</p>
        </li>
      ))}
    </ul>
  );
}
