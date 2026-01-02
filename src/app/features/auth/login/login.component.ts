import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
      rememberMe: [false],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;

      this.auth.login(this.loginForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Login Successful',
              detail: 'You have been logged in successfully',
            });
            this.router.navigate(['/booking']);
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: err.message || 'An error occurred during login',
          });
        },
      });
    } else {
      // Trigger validation visuals
      this.loginForm.markAllAsTouched();
    }
  }
}
