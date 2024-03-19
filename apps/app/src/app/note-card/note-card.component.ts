import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Output, ViewChild, input, viewChild } from '@angular/core';
import { INote } from '../interfaces/note';
import { DateFnsModule } from 'ngx-date-fns';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutofocusDirective } from '../directives/autofocus.directive';
// import "@types/dom-speech-recognition";

@Component({
	standalone: true,
	imports: [DateFnsModule, FontAwesomeModule, AutofocusDirective],
	selector: 'app-note-card',
	template: `
		<button (click)="dialog.showModal()" class="flex flex-col text-left rounded-md bg-slate-800 p-5 space-y-3 overflow-hidden relative cursor-pointer outline-none transition-all hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-300">
			<h4 class="text-sm font-medium text-slate-300">
				{{ note().date | dfnsFormatDistanceToNow : { addSuffix: true } }}
			</h4>
			<p class="text-sm leading-6 text-slate-400 ">
				{{ note().text }}
			</p>
			<div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-black/0 pointer-events-none"></div>
		</button>
		
		<dialog #dialog class="backdrop:bg-black/60  w-[100dvw] h-[100dvh] max-w-none max-h-none  bg-slate-700 md:max-w-2xl md:w-full md:h-[60vh] md:rounded-md open:flex open:flex-col relative" (click)="$event.stopPropagation()">
			<div class="flex flex-1 flex-col gap-3 p-5">
				<div class="flex">
					<h4 class="flex-1 text-sm font-medium text-slate-300">
						{{ note().date | dfnsFormatDistanceToNow : { addSuffix: true } }}
					</h4>
					
					<button autofocus type="button" class="size-5 text-slate-300 hover:text-slate-50 outline-none focus-visible:text-lime-300" (click)="dialog.close()"> 
						<fa-icon [icon]="icons.faTimes"></fa-icon> 
					</button>
				</div>
				<p class="text-sm leading-6 text-slate-400 ">
					{{ note().text }}
				</p>
			</div>
			<button type="button" class="w-full bg-slate-800 py-4 text-sm text-slate-300 outline-none font-medium group" (click)="onDeleteNote()"> 
				Deseja <span class="text-red-400 group-hover:underline">apagar essa nota</span>? 
			</button>
		</dialog>
	`,
	styles: ` :host { display: contents } `,
})
export class NoteCardComponent {


	private static number = 0;
	id = `note-card-${++NoteCardComponent.number}`

	icons = { faTimes };

	@HostBinding('tabindex') tabindex = 0

	dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

	note = input.required<INote>();

	@Output() delete = new EventEmitter();

	onDeleteNote() {
		this.delete.emit();
		this.dialog()?.nativeElement.close();
	}
}
