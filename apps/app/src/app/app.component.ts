import { Component } from '@angular/core';
import { NoteCardComponent } from './note-card/note-card.component';
import { NewNoteCardComponent } from './new-note-card/new-note-card.component';
import { Note } from './interfaces/note';

@Component({
  standalone: true,
  imports: [NewNoteCardComponent, NoteCardComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  notes: Array<Note> = [
    { date: new Date(2024, 1, 23), text: 'Hello World' },
    { date: new Date(2024, 0, 20), text: 'Test' },
  ]
}
