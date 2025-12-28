import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingFormComponent } from './components/booking-form/booking-form.component';


@NgModule({
  declarations: [
    BookingFormComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
