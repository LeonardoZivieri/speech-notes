import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AutofocusDirective } from '../directives/autofocus.directive';

@Component({
	standalone: true,
	imports: [FontAwesomeModule, FormsModule, AutofocusDirective],
	selector: 'app-new-note-card',
	template: `
		<button (click)="dialog.showModal()" class="flex flex-col text-left rounded-md bg-slate-700 hover:bg-slate-600 p-5 space-y-3 outline-none transition-all hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-300">
			<h4 class="text-sm font-medium text-slate-200">
				Adicionar Nota
			</h4>
			<p class="text-sm leading-6 text-slate-400">
				Grave uma nota em áudio que será convertida para texto
				automaticamente.
			</p>
		</button>

		<dialog #dialog class="backdrop:bg-black/60 max-w-2xl w-full h-[60vh] bg-slate-700 rounded-md relative" (click)="$event.stopPropagation()"  (close)="shouldShowOnboarding.set(true)">
			<form class="flex flex-col h-full" #form="ngForm" (ngSubmit)="onSubmit(form)">
				<div class="flex flex-1 flex-col gap-3 p-5">
					<div class="flex">
						<h4 class="flex-1 text-sm font-medium text-slate-300">
							Adicionar nota
						</h4>
						
						<button autofocus type="button" class="size-5 text-slate-300 hover:text-slate-50 outline-none focus-visible:text-lime-300" (click)="dialog.close()"> 
							<fa-icon [icon]="icons.faTimes"></fa-icon> 
						</button>
					</div>
					@if (shouldShowOnboarding()) {
						<p class="text-sm leading-6 text-slate-400 ">
							Comece 
							<button class="font-medium text-lime-400 hover:underline focus-visible:underline" (click)="shouldShowOnboarding.set(false)">
								gravando uma nota
							</button> 
							em áudio ou se preferir 
							<button class="font-medium text-lime-400 hover:underline focus-visible:underline" (click)="shouldShowOnboarding.set(false)">
								utilize apenas texto
							</button>.
						</p>
					} @else {
						<textarea
							name="text"
							ngModel
							autofocus
							class="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
							(input)="checkResetOnboarding($event)"
						></textarea>
					}
				</div>
				<button type="submit" class="w-full bg-lime-400 py-4 text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"> 
					Salvar nota
				</button>
			</form>
		</dialog>
	`,
	styles: ` :host { display: contents } `,
})
export class NewNoteCardComponent {
	icons = { faTimes };

	shouldShowOnboarding = signal(true);

	checkResetOnboarding(event: Event) {
		if (event instanceof InputEvent) {
			const { value } = event.target as HTMLInputElement | HTMLTextAreaElement;
			if (!value) {
				this.shouldShowOnboarding.set(true)
			}
		}
	}

	onSubmit(form: NgForm) {
		console.log(form.value, { form })
	}
}
