import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginObj: any = {
    userName: '',
    password: ''
  };
  isLoggingIn: boolean = false;
  showPassword: boolean = false;

  constructor(private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onLogIn(loginFrm: NgForm) {
    if (loginFrm.valid) {
      if (this.loginObj.userName == "admin" && this.loginObj.password == "admin@123") {
        this.isLoggingIn = true;
        setTimeout(() => {
          localStorage.setItem('username', this.loginObj.userName);
          this.toastr.success('Logged In Successfully');
          this.isLoggingIn = false;
          this.router.navigateByUrl('customer');
        }, 500);
      } else {
        this.toastr.error('Wrong Login Credentials!!');
      }
    } else {
      Object.values(loginFrm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onEyeClick() {
    this.showPassword = !this.showPassword;
  }
}
