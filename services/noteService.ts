import { prisma } from '@/lib/prisma';

export type NoteListItem = {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

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
