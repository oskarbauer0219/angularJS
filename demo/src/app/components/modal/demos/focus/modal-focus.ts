import { Component, inject, Type } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-confirm',
	template: `
		<div class="modal-header">
			<h4 class="modal-title" id="modal-title">Profile deletion</h4>
			<button
				type="button"
				class="btn-close"
				aria-describedby="modal-title"
				(click)="modal.dismiss('Cross click')"
			></button>
		</div>
		<div class="modal-body">
			<p>
				<strong>Are you sure you want to delete <span class="text-primary">"John Doe"</span> profile?</strong>
			</p>
			<p>
				All information associated to this user profile will be permanently deleted.
				<span class="text-danger">This operation can not be undone.</span>
			</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
			<button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
		</div>
	`,
})
export class NgbdModalConfirm {
	modal = inject(NgbActiveModal);
}

@Component({
	selector: 'ngbd-modal-confirm-autofocus',
	template: `
		<div class="modal-header">
			<h4 class="modal-title" id="modal-title">Profile deletion</h4>
			<button
				type="button"
				class="btn-close"
				aria-label="Close button"
				aria-describedby="modal-title"
				(click)="modal.dismiss('Cross click')"
			></button>
		</div>
		<div class="modal-body">
			<p>
				<strong>Are you sure you want to delete <span class="text-primary">"John Doe"</span> profile?</strong>
			</p>
			<p>
				All information associated to this user profile will be permanently deleted.
				<span class="text-danger">This operation can not be undone.</span>
			</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
			<button type="button" ngbAutofocus class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
		</div>
	`,
})
export class NgbdModalConfirmAutofocus {
	modal = inject(NgbActiveModal);
}

const MODALS: { [name: string]: Type<any> } = {
	focusFirst: NgbdModalConfirm,
	autofocus: NgbdModalConfirmAutofocus,
};

@Component({ selector: 'ngbd-modal-focus', templateUrl: './modal-focus.html' })
export class NgbdModalFocus {
	private modalService = inject(NgbModal);

	open(name: string) {
		this.modalService.open(MODALS[name]);
	}
}
