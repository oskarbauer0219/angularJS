import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-progressbar-stacked',
	standalone: true,
	imports: [NgbProgressbarModule],
	templateUrl: './progressbar-stacked.html',
})
export class NgbdProgressbarStacked {}
