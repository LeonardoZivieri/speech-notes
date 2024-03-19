import { Component, ElementRef, EventEmitter, Output, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { INote } from '../interfaces/note';
import { JsonPipe } from '@angular/common';


const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

@Component({
	standalone: true,
	imports: [ReactiveFormsModule, FontAwesomeModule, FormsModule, AutofocusDirective, JsonPipe],
	selector: 'app-new-note-card',
	template: `
		<button (click)="openModal()" class="flex flex-col text-left rounded-md bg-slate-700 hover:bg-slate-600 p-5 space-y-3 outline-none transition-all hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-300">
			<h4 class="text-sm font-medium text-slate-200">
				Adicionar Nota
			</h4>
			<p class="text-sm leading-6 text-slate-400">
				Grave uma nota em áudio que será convertida para texto
				automaticamente.
			</p>
		</button>

		<dialog #dialog class="backdrop:bg-black/60 w-[100dvw] h-[100dvh] max-w-none max-h-none relative bg-slate-700 md:max-w-2xl md:w-full md:h-[60vh] md:rounded-md" (click)="$event.stopPropagation()"  (close)="onCloseModal()">
			<form class="flex flex-col h-full">
				<div class="flex flex-1 flex-col gap-3 p-5">
					<div class="flex">
						<h4 class="flex-1 text-sm font-medium text-slate-300">
							Adicionar nota
						</h4>
						
						<button autofocus type="button" class="size-5 text-slate-300 hover:text-slate-50 outline-none focus-visible:text-lime-300" (click)="dialog.close()"> 
							<fa-icon [icon]="icons.faTimes"></fa-icon> 
						</button>
					</div>
					@if (shouldShowOnboarding() && speechRecognition) {
						<p class="text-sm leading-6 text-slate-400 ">
							Comece 
							<button type="button" class="font-medium text-lime-400 hover:underline focus-visible:underline" (click)="startRecording()">
								gravando uma nota
							</button> 
							em áudio ou se preferir 
							<button type="button" class="font-medium text-lime-400 hover:underline focus-visible:underline" (click)="shouldShowOnboarding.set(false)">
								utilize apenas texto
							</button>.
						</p>
					} @else {
						<textarea
							autofocus
							class="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
							[formControl]="textareaText"
							(input)="checkResetOnboarding()"
						></textarea>
					}
				</div>
				@if (isRecording()) {
					<button type="button" class="w-full bg-slate-900 py-4 text-sm text-slate-300 outline-none font-medium hover:text-slate-100" (click)="stopRecording()"> 
						<div class="inline-table my-auto mr-1 size-3 rounded-full bg-red-500 animate-pulse"></div>
						Gravando! (clique p/ interromper)
					</button>
				} @else {
					<button (click)="onSubmit()" class="w-full bg-lime-400 py-4 text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"> 
						Salvar nota
					</button>
				}
			</form>
		</dialog>
	`,
	styles: ` :host { display: contents } `,
})
export class NewNoteCardComponent {
	readonly speechRecognition: SpeechRecognition | null = SpeechRecognitionAPI && new SpeechRecognitionAPI()

	dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

	icons = { faTimes };

	shouldShowOnboarding = signal(true);
	textareaText = new FormControl('', [Validators.required]);

	@Output() created = new EventEmitter<INote>();

	openModal() {
		this.dialog()?.nativeElement.showModal()
	}

	checkResetOnboarding() {
		if (!this.textareaText.value) {
			this.shouldShowOnboarding.set(true)
		}
	}
	isRecording = signal(false);
	startRecording() {
		if (!this.speechRecognition) {
			return;
		}
		this.isRecording.set(true);
		this.shouldShowOnboarding.set(false);

		this.speechRecognition.lang = 'pt-BR';
		this.speechRecognition.continuous = true;
		this.speechRecognition.maxAlternatives = 1;
		this.speechRecognition.interimResults = true;

		this.speechRecognition.onresult = (event) => {
			this.shouldShowOnboarding.set(false);
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript)
			}, '')
			this.textareaText.setValue(transcription);
		}

		this.speechRecognition.onerror = (event) => {
			console.error(event)
			alert(event.error)
			this.stopRecording();
		}

		this.speechRecognition.onend = () => {
			this.stopRecording();
		}

		this.speechRecognition.start();
	}
	stopRecording() {
		this.isRecording.set(false);
		this.speechRecognition && this.speechRecognition.stop();
		this.checkResetOnboarding();
	}

	onCloseModal() {
		this.stopRecording();
		this.shouldShowOnboarding.set(true)
	}

	onSubmit() {
		if (this.textareaText.valid && this.textareaText.value) {
			this.created.emit({
				id: crypto.randomUUID(),
				date: new Date(),
				text: this.textareaText.value
			})
		}
		this.dialog()?.nativeElement.close();
		this.shouldShowOnboarding.set(false)
		this.isRecording.set(false);
	}
}
