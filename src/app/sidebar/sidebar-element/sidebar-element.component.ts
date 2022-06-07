import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-element',
  templateUrl: './sidebar-element.component.html',
  styleUrls: ['./sidebar-element.component.css']
})
export class SidebarElementComponent  {
  @Input() title = '';
  @Input() icon = '';
  @Input() route = '';
  @Input() isSidebarActive = false;

  constructor() { }
}
