import { LoadingService } from './../services/loading/loading.service';
import { SessionServiceService } from './../services/session/session-service.service';
import { EventEmitterService } from './../services/event-emitter/event-emitter.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isSidebarToggled = false;
  isSidebarActive = false;
  isLoggedIn = false;;

  loading$ = this.loadingService.loading$;

  constructor(
    private eventEmitterService: EventEmitterService,
    private sessionService: SessionServiceService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.sessionService.activeSession();

    this.eventEmitterService.getEmitter('onLogin')?.subscribe(
      () => this.isLoggedIn = this.sessionService.activeSession()
    );

    this.eventEmitterService.getEmitter('onLogout')?.subscribe(
      () => this.isLoggedIn = false
    );
  }

  ngAfterViewInit() {
    
  }

}
