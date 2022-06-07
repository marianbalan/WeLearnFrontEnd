import { UserServiceService } from './../services/user-service/user-service.service';
import { ILocation } from '../models/location';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../models/user';
import { ISchool } from '../models/school';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  optionMenu = 'PersonalInfo';
  invalidPasswords = false;

  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
  ]);
  password: FormControl = new FormControl('', [Validators.required]);
  confirmPassword: FormControl = new FormControl('', [Validators.required]);
  firstName: FormControl = new FormControl('', [Validators.required]);
  lastName: FormControl = new FormControl('', [Validators.required]);
  pin: FormControl = new FormControl('', [Validators.required]);
  phoneNumber: FormControl = new FormControl('', [Validators.required]);

  name: FormControl = new FormControl('', [Validators.required]);
  cui: FormControl = new FormControl('', [Validators.required]);
  county: FormControl = new FormControl('', [Validators.required]);
  city: FormControl = new FormControl('', [Validators.required]);
  street: FormControl = new FormControl('', [Validators.required]);
  number: FormControl = new FormControl('', [Validators.required]);

  registerForm: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
    firstName: this.firstName,
    lastName: this.lastName,
    pin: this.pin,
    phoneNumber: this.phoneNumber,
    name: this.name,
    cui: this.cui,
    county: this.county,
    city: this.city,
    street: this.street,
    number: this.number
  });

  requiredMessage: string = 'This field is required.';
  emailMessage: string = 'Please insert a valid email address.'

  constructor(
    private userService: UserServiceService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  register(): void {
    if (!this.registerForm.valid) {
      alert('Fields are invalid!');
      return;
    } 

    if (this.password.value !== this.confirmPassword.value) {
      this.invalidPasswords = true;
      return;
    }

    const user = {
      email: this.email.value,
      password: this.password.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      pin: this.pin.value,
      phoneNumber: this.phoneNumber.value
    } as IUser;

    const location = {
      county: this.county.value,
      city: this.city.value,
      street: this.street.value,
      number: this.number.value
    } as ILocation;

    const school = {
      name: this.name.value,
      cui: this.cui.value,
      location: location
    } as ISchool;

    this.userService.register(user, school).subscribe(
      () => {
        this.invalidPasswords = false;
        this.registerForm.reset();

        this.router.navigate(['/registration-confirmation']);
      },
    );
  }
}
