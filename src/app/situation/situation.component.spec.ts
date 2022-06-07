/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SituationComponent } from './situation.component';

describe('SituationComponent', () => {
  let component: SituationComponent;
  let fixture: ComponentFixture<SituationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
