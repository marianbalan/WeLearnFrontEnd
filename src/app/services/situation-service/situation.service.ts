import { INonAttendanceViewModel } from './../../models/non-attendance-view-model.model';
import { INonAttendance } from './../../models/non-attendance.model';
import { IGrade } from './../../models/grade.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStuationViewModel } from 'src/app/models/situation-view-model.model';
import { environment } from 'src/environments/environment';
import { ISubjectStuationViewModel } from 'src/app/models/subject-situation-view-model.model';
import { IGradeViewModel } from 'src/app/models/grade-view-model.model';
import { NumberFormatStyle } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SituationService {
  private _apiUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getSituationByStudent(studentId: number): Observable<IStuationViewModel[]>{
    return this.httpClient.get<IStuationViewModel[]>(
      this._apiUrl + '/situation/user/' + studentId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public getSituationBySubject(subjectId: number): Observable<ISubjectStuationViewModel[]>{
    return this.httpClient.get<ISubjectStuationViewModel[]>(
      this._apiUrl + '/situation/subject/' + subjectId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public updateNonAttendanceMotivatedStatus(id: number, isMotivated: boolean): Observable<any> {
    return this.httpClient.patch<any>(
      this._apiUrl + '/non-attendance/' + id,
      {
        motivated: isMotivated
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public addGrade(grade: IGrade): Observable<IGradeViewModel>
  {
    const requestBody = JSON.stringify(grade);

    return this.httpClient.post<IGradeViewModel>(
      this._apiUrl + '/grade',
      requestBody,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    )
  }

  public addNonAttendance(nonAttendance: INonAttendance): Observable<INonAttendanceViewModel> {
    const requestBody = JSON.stringify(nonAttendance);

    return this.httpClient.post<INonAttendanceViewModel>(
      this._apiUrl + '/non-attendance',
      requestBody,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public removeGrade(id: NumberFormatStyle): Observable<IGradeViewModel> {
    return this.httpClient.delete<IGradeViewModel>(
      this._apiUrl + '/grades/' + id,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public updateGradeMark(id: number, grade: number): Observable<any> {
    return this.httpClient.patch<any>(
      this._apiUrl + '/grades/' + id,
      {
        grade: grade
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public downloadGradesSituationPdfByStudent(studentId: number): Observable<any>{
    return this.httpClient.get(
      this._apiUrl + '/situation/user/' + studentId + '/pdf',
      {
        responseType: 'text'
      }
    );
  }

  public downlaodFile(studentId: number) {
    const blob = new Blob()
  }

}
