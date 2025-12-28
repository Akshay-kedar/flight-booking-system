export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  baseFare: number;
  discountedFare: number;
}

export interface Flight {
  id: string;
  fromCity: string;
  toCity: string;
  departureDate: Date;
  passengers: Passenger[];
}