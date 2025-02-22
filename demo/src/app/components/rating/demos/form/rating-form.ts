import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-rating-form',
	imports: [NgbRatingModule, ReactiveFormsModule],
	templateUrl: './rating-form.html',
})
export class NgbdRatingForm {
	ctrl = new FormControl<number | null>(null, Validators.required);

	toggle() {
		if (this.ctrl.disabled) {
			this.ctrl.enable();
		} else {
			this.ctrl.disable();
		}
	}
}
