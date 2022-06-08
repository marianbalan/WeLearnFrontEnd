import { Role } from './../models/user-role.model';
import { EventEmitterService } from './../services/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { SessionServiceService } from './../services/session/session-service.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  requiredMessage: string = 'This field is required.';
  emailMessage: string = 'Please insert a valid email address.';
  invalidLogin: boolean = false;

  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
  ]);
  password: FormControl = new FormControl('', [Validators.required]);

  loginForm: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor(
    private sessionService: SessionServiceService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    if (this.sessionService.activeSession()) {
      this.toHome();
    }
  }

  submit(): void {
    if (!this.loginForm.valid) {
      alert('Form is invalid');
      return;
    }

    this.sessionService.login(this.email.value, this.password.value).subscribe(
      (response) => {
        this.sessionService.saveToken(response);
        this.invalidLogin = false;
        this.eventEmitterService.getEmitter('onLogin')?.emit();
        this.toHome();
      },
      () => {
        // this.invalidLogin = true;
        this.loginForm.reset();
      }
    );
  }

  toHome(): void {
    let homeRoute = '/';
    
    if (this.sessionService.hasRoleStudent()) {
      homeRoute = '/students/' + this.sessionService.getLoggedUserId()! + '/situation';
    }
    if (this.sessionService.hasRoleTeacher() || this.sessionService.hasRoleClassMaster()) {
      homeRoute = '/subjects';
    }
    if (this.sessionService.hasRoleDirector()) {
      homeRoute = '/teachers';
    }

    this.router.navigate([homeRoute]).then(() => {
      this.loginForm.reset();
    });
  }
}
