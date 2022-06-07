import { ISubject } from './../../models/subject.model';
import { ISubjectViewModel } from './../../models/subject-view-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private _apiUrl = environment.baseUrl;

  constructor(
    private _httpClient: HttpClient
  ) { }

  public getSubjectsByStudyGroup(studyGroupId: number): Observable<ISubjectViewModel[]> {
    return this._httpClient.get<ISubjectViewModel[]>(`${this._apiUrl}/subjects/study-group/${studyGroupId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  public addSubject(subject: ISubject): Observable<ISubjectViewModel> {
    const body: string = JSON.stringify(subject);

    return this._httpClient.post<ISubjectViewModel>(this._apiUrl + '/subject', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    });
  }

  public updateSubject(id: number, subject: ISubject): Observable<ISubjectViewModel> {
    const body: string = JSON.stringify(subject);

    return this._httpClient.put<ISubjectViewModel>(this._apiUrl + '/subject/' + id, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    });
  }

  public deleteSubject(id: number): Observable<ISubjectViewModel> {
    return this._httpClient.delete<ISubjectViewModel>(this._apiUrl + '/subject/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  public getSubjectsBySchool(schoolId: number): Observable<ISubjectViewModel[]> {
    return this._httpClient.get<ISubjectViewModel[]>(`${this._apiUrl}/subjects/school/${schoolId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  public getSubjectsByTeacher(teacherId: number): Observable<ISubjectViewModel[]> {
    return this._httpClient.get<ISubjectViewModel[]>(`${this._apiUrl}/subjects/teacher/${teacherId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  public getSubjectById(id: number): Observable<ISubjectViewModel> {
    return this._httpClient.get<ISubjectViewModel>(`${this._apiUrl}/subjects/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
  }

}
