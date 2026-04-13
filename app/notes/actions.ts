'use server';

import { revalidatePath } from 'next/cache';
import { createNote, deleteNote, toggleNotePin, updateNote } from '@/services/noteService';

export async function createNoteAction(formData: FormData) {
  await createNote({
    title: String(formData.get('title') ?? ''),
    content: String(formData.get('content') ?? ''),
  });

  revalidatePath('/notes');
  revalidatePath('/');
}

export async function updateNoteAction(formData: FormData) {
  const noteId = Number(formData.get('noteId'));
  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new Error('Note id is invalid.');
  }

  await updateNote(noteId, {
    title: String(formData.get('title') ?? ''),
    content: String(formData.get('content') ?? ''),
  });

  revalidatePath('/notes');
  revalidatePath('/');
}

export async function toggleNotePinAction(formData: FormData) {
  const noteId = Number(formData.get('noteId'));
  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new Error('Note id is invalid.');
  }

  await toggleNotePin(noteId);

  revalidatePath('/notes');
  revalidatePath('/');
}

export async function deleteNoteAction(formData: FormData) {
  const noteId = Number(formData.get('noteId'));
  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new Error('Note id is invalid.');
  }

  await deleteNote(noteId);

  revalidatePath('/notes');
  revalidatePath('/');
}
