import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {

  private  destroy$=new Subject<void>()

bookingForm!:FormGroup
cities = [
  { label: 'New York', value: 'NYC' },
  { label: 'London', value: 'LDN' },
  { label: 'Paris', value: 'PAR' }
];

genders = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' }
];

get flights():FormArray{
  return this.bookingForm.get('flights')as FormArray;
}

getPassengers(flightIndex:number):FormArray{
  return this.flights.at(flightIndex).get('passengers')as FormArray;
}


  constructor(private fb: FormBuilder) { }

  ngOnInit(){

    this.bookingForm=this.fb.group({
      // This is the top-level array of flights
      flights:this.fb.array([this.initFlight()])
    })
  }


// 1. Factory for Flight
  initFlight(): FormGroup {
    return this.fb.group({
      fromCity: ['',Validators.required],
      toCity: ['',Validators.required],
      departureDate: [null,Validators.required],
      // Each flight has its own passenger array
      passengers: this.fb.array([this.initPassenger()])
    });

  }
  initPassenger(): FormGroup {
  const group= this.fb.group({
    name: ['',Validators.required],
    age: [null,Validators.required],
    gender: ['',Validators.required],
    baseFare:[500],//default base fare
    discountedFare:[500]//default discounted fare
  });

  group.get('age')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(age=>{
    
    if(age===null||age===undefined){
      return;
    }
    const baseFare=group.get('baseFare')?.value||0;
    
    const finalFare=age<12?baseFare*0.5:baseFare;
   
    group.get('discountedFare')?.patchValue(finalFare,{emitEvent:false});
  })


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
  this.flights.removeAt(flightIndex); }

  onSubmit(){
    console.log(this.bookingForm.value);
  } 

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
