import { EventEmitterService } from './../services/event-emitter/event-emitter.service';
import { SessionServiceService } from './../services/session/session-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  title: string = "We Learn";
  isLoggedIn: boolean = false;

  constructor(
    private sessionService: SessionServiceService,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.sessionService.activeSession();

    this.eventEmitterService.getEmitter('onLogin')?.subscribe(
      () => this.isLoggedIn = this.sessionService.activeSession()
    );
  }

  logout() {
    this.isLoggedIn = false;
    this.eventEmitterService.getEmitter('onLogout')?.emit()
    this.sessionService.logout();
  }
}
