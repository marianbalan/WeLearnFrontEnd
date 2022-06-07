import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { IStudyGroupViewModel } from 'src/app/models/study-group-view-model.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private _student: IUserViewModel | undefined;

  constructor() { }

  public setStudent(student: IUserViewModel): void {
    this._student = student;
  }

  public getStudent(): IUserViewModel | undefined {
    return this._student;
  }
  
}
