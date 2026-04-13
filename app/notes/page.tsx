import { SectionCard } from '@/components/ui/section-card';
import { EmptyState } from '@/components/ui/empty-state';
import { createNoteAction, deleteNoteAction, toggleNotePinAction, updateNoteAction } from '@/app/notes/actions';
import { getNotes } from '@/services/noteService';

export default async function NotesPage() {
  const notes = await getNotes();
  const pinnedNotes = notes.filter((note) => note.pinned);

  return (
    <div className="space-y-4">
      <header className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-100">Notes</h1>
        <p className="text-sm text-zinc-400">Capture context, pin what matters, and prune old entries.</p>
      </header>

      <SectionCard title="New note" description="Keep it short and actionable.">
        <form action={createNoteAction} className="space-y-2 text-sm">
          <input required name="title" placeholder="Note title" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100" />
          <textarea
            name="content"
            rows={3}
            placeholder="Write your note..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          />
          <button type="submit" className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm text-sky-300">
            Save note
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Pinned notes" description="Top priority context.">
        {pinnedNotes.length === 0 ? (
          <EmptyState title="No pinned notes" message="Pin important notes to keep them visible." />
        ) : (
          <ul className="space-y-2 text-sm">
            {pinnedNotes.map((note) => (
              <li key={note.id} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-100">{note.title}</p>
                  <form action={toggleNotePinAction}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                      Unpin
                    </button>
                  </form>
                </div>
                <p className="mt-1 text-xs text-zinc-400">{note.content}</p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="All notes" description="Edit, pin, or delete.">
        {notes.length === 0 ? (
          <EmptyState title="No notes yet" message="Create a note above to get started." />
        ) : (
          <ul className="space-y-2 text-sm">
            {notes.map((note) => (
              <li key={note.id} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-100">{note.title}</p>
                  <div className="flex gap-2">
                    <form action={toggleNotePinAction}>
                      <input type="hidden" name="noteId" value={note.id} />
                      <button type="submit" className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                        {note.pinned ? 'Unpin' : 'Pin'}
                      </button>
                    </form>
                    <form action={deleteNoteAction}>
                      <input type="hidden" name="noteId" value={note.id} />
                      <button type="submit" className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-500">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>

                <details className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                  <summary className="cursor-pointer text-xs text-zinc-400">Edit note</summary>
                  <form action={updateNoteAction} className="mt-2 space-y-2 text-xs">
                    <input type="hidden" name="noteId" value={note.id} />
                    <input required name="title" defaultValue={note.title} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100" />
                    <textarea
                      name="content"
                      defaultValue={note.content}
                      rows={3}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                    />
                    <button type="submit" className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300">
                      Save changes
                    </button>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
