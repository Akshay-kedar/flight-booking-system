import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!:FormGroup;
  loading:boolean=false;
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router){ }
  ngOnInit(): void {
  
    this.signupForm=this.fb.group(
      {
        name:['',Validators.required],
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required,Validators.minLength(6)]]
      }
    );
  }

  onSignup(){
    if(this.signupForm.valid){
      this.loading=true;
      //use auth Service
      this.auth.login(this.signupForm.value).subscribe(()=>{
        this.loading=false;
        this.router.navigate(['/booking']);
      })
    }
    else{
      this.signupForm.markAllAsTouched();
    
    }
  }


}
