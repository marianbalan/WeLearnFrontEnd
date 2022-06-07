import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from './../services/user-service/user-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {

  activationToken: string = '';
  statusMessage: string = 'Activating your account. Please wait!';

  constructor(
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedRoute.params.subscribe(params => this.activationToken = params['token']);
  }

  ngOnInit() {
    this.activateAccount();
  }

  private activateAccount(): void {
    this.userService.activateAccount(this.activationToken).subscribe(
      () => this.toLogin(),
      () => this.statusMessage = 'An error has occured while activating your account. Try again!'
    );
  }

  private toLogin(): void {
    this.router.navigate(['/login']);
  }

}
