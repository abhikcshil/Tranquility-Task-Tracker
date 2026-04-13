import { prisma } from '@/lib/prisma';
import { validateNoteInput, type NoteInput } from '@/lib/validation';

export type NoteListItem = {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function getToggledPinnedValue(currentValue: boolean): boolean {
  return !currentValue;
}

export async function getPinnedNotes(): Promise<NoteListItem[]> {
  return prisma.note.findMany({
    where: { pinned: true },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getNotes(): Promise<NoteListItem[]> {
  return prisma.note.findMany({
    orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
  });
}

export async function createNote(input: NoteInput): Promise<NoteListItem> {
  const valid = validateNoteInput(input);

  return prisma.note.create({
    data: {
      title: valid.title,
      content: valid.content,
    },
  });
}

export async function updateNote(noteId: number, input: NoteInput): Promise<NoteListItem> {
  const valid = validateNoteInput(input);

  return prisma.note.update({
    where: { id: noteId },
    data: {
      title: valid.title,
      content: valid.content,
    },
  });
}

export async function toggleNotePin(noteId: number): Promise<NoteListItem> {
  const note = await prisma.note.findUniqueOrThrow({ where: { id: noteId } });

  return prisma.note.update({
    where: { id: noteId },
    data: {
      pinned: getToggledPinnedValue(note.pinned),
    },
  });
}

export async function deleteNote(noteId: number): Promise<void> {
  await prisma.note.delete({ where: { id: noteId } });
}
