import { SessionServiceService } from './../../services/session/session-service.service';
import { ISidebarItem } from '../sidebar-item.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.css']
})
export class SidebarContainerComponent implements OnInit {
  @Output() closeSidebarButton = new EventEmitter<void>();

  sidebarElements: ISidebarItem[] = [] as ISidebarItem[];
  isSidebarActive = false;

  constructor(
    private sessionService: SessionServiceService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.sessionService.hasRoleDirector()) {
      this.sidebarElements.push(
        {
          title: 'Teachers',
          icon: 'ic-teacher',
          route: '/teachers'
        },
        {
          title: 'Study Groups',
          icon: 'ic-study-group',
          route: '/study-groups'
        },
      )
    }

    if (this.sessionService.hasRoleDirector() || this.sessionService.hasRoleTeacher()) {
      this.sidebarElements.push(
        {
          title: 'Subjects',
          icon: 'ic-subject',
          route: '/subjects'
        },
      )
    }

    if (this.sessionService.hasRoleDirector() || this.sessionService.hasRoleClassMaster()) {
      this.sidebarElements.push(
        {
          title: 'Students',
          icon: 'ic-student',
          route: '/students'
        },
      )
    }

    if (this.sessionService.hasRoleStudent()) {
      this.sidebarElements.push(
        {
          title: 'Situation',
          icon: 'ic-situation',
          route: `/students/${this.sessionService.getLoggedUserId()!}/situation`
        }
      );
    }

    if (this.sessionService.hasRoleTeacher() || this.sessionService.hasRoleStudent()) {
      this.sidebarElements.push(
        {
          title: 'Assignments',
          icon: 'ic-assignment',
          route: '/assignments'
        }
      )
    }
  }

  close() {
    this.closeSidebarButton.emit();
    this.isSidebarActive = !this.isSidebarActive;
  }

  changePage() {
    if(this.isSidebarActive == true) {
      this.isSidebarActive = false;
    }
  }
}
