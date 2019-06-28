import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbDatepicker} from './datepicker';
import {NgbDatepickerMonthView} from './datepicker-month-view';
import {NgbDatepickerNavigation} from './datepicker-navigation';
import {NgbInputDatepicker} from './datepicker-input';
import {NgbDatepickerDayView} from './datepicker-day-view';
import {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';

export {NgbDatepicker, NgbDatepickerNavigateEvent} from './datepicker';
export {NgbInputDatepicker} from './datepicker-input';
export {NgbCalendar, NgbPeriod, NgbCalendarGregorian} from './ngb-calendar';
export {NgbCalendarIslamicCivil} from './hijri/ngb-calendar-islamic-civil';
export {NgbCalendarIslamicUmalqura} from './hijri/ngb-calendar-islamic-umalqura';
export {NgbCalendarPersian} from './jalali/ngb-calendar-persian';
export {NgbCalendarHebrew} from './hebrew/ngb-calendar-hebrew';
export {NgbDatepickerI18nHebrew} from './hebrew/datepicker-i18n-hebrew';
export {NgbDatepickerMonthView} from './datepicker-month-view';
export {NgbDatepickerDayView} from './datepicker-day-view';
export {NgbDatepickerNavigation} from './datepicker-navigation';
export {NgbDatepickerNavigationSelect} from './datepicker-navigation-select';
export {NgbDatepickerConfig} from './datepicker-config';
export {NgbDatepickerI18n} from './datepicker-i18n';
export {NgbDateStruct} from './ngb-date-struct';
export {NgbDate} from './ngb-date';
export {NgbDateAdapter} from './adapters/ngb-date-adapter';
export {NgbDateNativeAdapter} from './adapters/ngb-date-native-adapter';
export {NgbDateNativeUTCAdapter} from './adapters/ngb-date-native-utc-adapter';
export {NgbDateParserFormatter} from './ngb-date-parser-formatter';

@NgModule({
  declarations: [
    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
    NgbInputDatepicker
  ],
  exports: [NgbDatepicker, NgbInputDatepicker],
  imports: [CommonModule, FormsModule],
  entryComponents: [NgbDatepicker]
})
export class NgbDatepickerModule {
}
