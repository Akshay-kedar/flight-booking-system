import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  private destroy$ = new Subject<void>();
  totalCost$!: Observable<number>;

  displaySummary: boolean = false;

  bookingForm!: FormGroup;

  isSubmitting: boolean = false;

  cities = [
    { label: 'New York', value: 'NYC' },
    { label: 'London', value: 'LDN' },
    { label: 'Paris', value: 'PAR' },
  ];

  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  get flights(): FormArray {
    return this.bookingForm.get('flights') as FormArray;
  }

  getPassengers(flightIndex: number): FormArray {
    return this.flights.at(flightIndex).get('passengers') as FormArray;
  }

  get summaryData() {
    const rawValue = this.bookingForm.getRawValue();
    return {
      totalFlights: rawValue.flights.length,
      totalPassengers: rawValue.flights.reduce((accum: number, f: any) => {
        return (accum += f.passengers.length);
      }, 0),
      flights: rawValue.flights,
    };
  }

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.bookingForm = this.fb.group({
      // This is the top-level array of flights
      flights: this.fb.array([this.initFlight()]),
    });

    this.totalCost$ = this.bookingForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith(this.bookingForm.value),
      // Calculate total cost whenever form changes
      // Sum up all discounted fares from all passengers in all flights
      map((formValue) => {
        let total = 0;
        formValue.flights?.forEach((flight: any) => {
          flight.passengers?.forEach((passenger: any) => {
            total += passenger.discountedFare || 0;
          });
        });
        return total;
      })
    );
  }

  // 1. Factory for Flight
  initFlight(): FormGroup {
    return this.fb.group({
      fromCity: ['', Validators.required],
      toCity: ['', Validators.required],
      departureDate: [null, Validators.required],
      // Each flight has its own passenger array
      passengers: this.fb.array([this.initPassenger()]),
    });
  }
  initPassenger(): FormGroup {
    const group = this.fb.group({
      name: ['', Validators.required],
      age: [null, Validators.required],
      gender: ['', Validators.required],
      baseFare: [500], //default base fare
      discountedFare: [500], //default discounted fare
    });

    group
      .get('age')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((age) => {
        if (age === null || age === undefined) {
          return;
        }
        const baseFare = group.get('baseFare')?.value || 0;

        const finalFare = age < 12 ? baseFare * 0.5 : baseFare;

        group
          .get('discountedFare')
          ?.patchValue(finalFare, { emitEvent: false });
      });

    return group;
  }
  addFlight() {
    this.flights.push(this.initFlight());
  }
  addPassenger(flightIndex: number) {
    this.getPassengers(flightIndex).push(this.initPassenger());
  }

  removePassenger(flightIndex: number, passengerIndex: number) {
    this.getPassengers(flightIndex).removeAt(passengerIndex);
  }

  removeFlight(flightIndex: number) {
    this.flights.removeAt(flightIndex);
  }

  onSubmit() {
    //need to oper summury dialog here
    if (this.bookingForm.valid) {
      this.displaySummary = true;
    }
    console.log(this.bookingForm.value);
  }

  resetBookingForm() {
    // 1. Clear the Flight FormArray
    // We loop backwards or simply set a new FormArray
    this.bookingForm.setControl('flights', this.fb.array([this.initFlight()]));

    // 2. Reset the visual state of the form (removes 'touched' or 'dirty' classes)
    this.bookingForm.reset();

    // 3. IMPORTANT: After .reset(), all values become null.
    // We need to patch the default structure back in.
    this.bookingForm.patchValue({
      flights: [
        {
          fromCity: '',
          toCity: '',
          passengers: [
            {
              baseFare: 500,
              discountedFare: 500,
            },
          ],
        },
      ],
    });
  }

  confirmFinalBooking() {
    // 1. Start the loading state
    this.isSubmitting = true;

    // 2. Simulate an API call using RxJS
    // We pipe a timer to wait 2 seconds, then execute our logic
    timer(2000).subscribe({
      next: () => {
        // 3. Success! Stop the loading state
        this.isSubmitting = false;
        this.displaySummary = false;

        // 4. Show a success notification
        this.messageService.add({
          severity: 'success',
          summary: 'Booking Confirmed',
          icon: 'pi pi-check',
          detail: 'Your flight has been successfully booked!',
          styleClass: 'custom-success-message',
        });

        this.resetBookingForm();
        this.displaySummary = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        // Handle errors (stop loading even if it fails)
        this.isSubmitting = false;
        console.error('Booking failed', err);
      },
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
