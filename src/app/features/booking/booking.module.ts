import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
@NgModule({
  declarations: [
    BookingFormComponent
  ],
  imports: [
    BookingRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CommonModule,
    DividerModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  exports:[
    BookingFormComponent
  ]
})
export class BookingModule { }
