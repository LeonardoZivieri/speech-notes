import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewNoteCardComponent } from './new-note-card.component';

describe('NewNoteCardComponent', () => {
	let component: NewNoteCardComponent;
	let fixture: ComponentFixture<NewNoteCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NewNoteCardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NewNoteCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
