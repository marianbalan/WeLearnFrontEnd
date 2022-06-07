import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from 'src/app/models/user';
import { ISchool } from 'src/app/models/school';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserViewModel } from 'src/app/models/user-view-model.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { 
  }

  register(user: IUser, school: ISchool): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/register', {
      user: user,
      school: school
    }, {responseType: "text", headers: new HttpHeaders({"Content-Type": "application/json"})});
  }

  getUsersBySchoolIdAndRole(schoolId: number, role: string): Observable<IUserViewModel[]> {
    return this.httpClient.get<IUserViewModel[]>(`${this.apiUrl}/users/school/${schoolId}/role/${role}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  addUser(user: IUser): Observable<IUserViewModel> {
    const body: string = JSON.stringify(user);

    return this.httpClient.post<IUserViewModel>(this.apiUrl + '/user', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  getNonClassMasterTeachersBySchoolId(schoolId: number): Observable<IUserViewModel[]> {
    return this.httpClient.get<IUserViewModel[]>(`${this.apiUrl}/users/school/${schoolId}/non-class-master-teachers`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  removeUser(id: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + '/user/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  updateUser(id: number, user: IUser): Observable<IUserViewModel> {
    const body: string = JSON.stringify(user);

    return this.httpClient.put<IUserViewModel>(this.apiUrl + '/user/' + id, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  getUsersByStudyGroupIdAndRole(studyGroupId: number, role: string): Observable<IUserViewModel[]> {
    return this.httpClient.get<IUserViewModel[]>(`${this.apiUrl}/users/study-group/${studyGroupId}/role/${role}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  getUserById(id: number): Observable<IUserViewModel>{
    return this.httpClient.get<IUserViewModel>(
      this.apiUrl + "/users/" + id,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  activateAccount(token: string): Observable<IUserViewModel> {
    return this.httpClient.post<IUserViewModel>(this.apiUrl + '/activate-account', token, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  setPassword(token: string, password: string): Observable<IUserViewModel> {
    return this.httpClient.post<IUserViewModel>(this.apiUrl + '/set-password', {
      'token': token,
      'password': password
    },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
