import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from './../services/user-service/user-service.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

  activationToken: string = '';
  requiredMessage: string = 'This field is required.'
  invalidPasswords: boolean = false;
  activationError: boolean = false;

  password: FormControl = new FormControl('', [Validators.required]);
  confirmPassword: FormControl = new FormControl('', [Validators.required]);

  form: FormGroup = new FormGroup({
    password: this.password,
    confirmPassword: this.confirmPassword
  });

  constructor(
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedRoute.params.subscribe(params => this.activationToken = params['token']);
  }

  ngOnInit() {
  }

  public submit(): void {
    if (!this.form.valid) {
      alert('Fields are invalid!');
      return;
    } 

    if (this.password.value !== this.confirmPassword.value) {
      this.invalidPasswords = true;
      return;
    }

    this.userService.setPassword(this.activationToken, this.password.value).subscribe(
      () =>  { 
        this.invalidPasswords = false;
        this.activationError = false;
        this.toLogin(); 
      },
      () => this.activationError = true
    );
  }

  private toLogin(): void {
    this.router.navigate(['/login']);
  }

}
