import { Component, computed, effect, signal } from '@angular/core';
import { NoteCardComponent } from './note-card/note-card.component';
import { NewNoteCardComponent } from './new-note-card/new-note-card.component';
import { INote } from './interfaces/note';
import SuperJSON from 'superjson';

@Component({
  standalone: true,
  imports: [NewNoteCardComponent, NoteCardComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  notes = signal<Array<INote>>(SuperJSON.parse(localStorage.getItem('notes') ?? SuperJSON.stringify([])))

  search = signal('');
  filteredNotes = computed(() => {
    const searchText = this.search().toLocaleLowerCase().split(' ');
    console.log({ notes: this.notes() })
    return this.notes().filter((note) => {
      const noteText = note.text.toLocaleLowerCase().split(' ')
      return searchText.every(word => noteText.some(noteWord => noteWord.includes(word)))
    })
  })

  constructor() {
    effect(() => {
      const notes = this.notes();
      console.log(notes);
      localStorage.setItem('notes', SuperJSON.stringify(notes))
    })
  }

  onCreatedNote(note: INote) {
    this.notes.update((notes) => {
      notes.unshift(note);
      return notes.slice();
    });
  }

  onDeleteNote(toDeleteNote: INote) {
    this.notes.update(notes => notes.filter(note => note !== toDeleteNote))
  }
}
