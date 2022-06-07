import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {
  private apiUrl: string = environment.baseUrl;
  private token: string = '';

  constructor(
    private httpClient: HttpClient,
  ) { 
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/login', {
      email: email,
      password: password
    }, httpOptions);
  }

  saveToken(newToken: string): void {
    window.localStorage.removeItem(this.token);
    window.localStorage.setItem(this.token, newToken);
  }

  getToken(): string | null {
    return window.localStorage.getItem(this.token);
  }

  getDecodedToken(): any {
    return jwtDecode(this.getToken()!);
  }

  activeSession(): boolean {
    return this.getToken() != null;
  }

  getLoggedUserId(): number | null {
    return this.getDecodedToken().id;
  }

  getLoggedUserSchoolId(): number | null {
    return this.getDecodedToken().schoolId;
  }

  getLoggedUserStudyGroupId(): number | null {
    return this.getDecodedToken().studyGroupId;
  }

  getLoggedUserRoles(): string[]{
    return this.getDecodedToken().roles;
  }

  hasRoleDirector(): boolean {
    return this.getLoggedUserRoles().includes('ROLE_DIRECTOR');
  }

  hasRoleTeacher(): boolean {
    return this.getLoggedUserRoles().includes('ROLE_TEACHER');
  }

  hasRoleClassMaster(): boolean {
    return this.getLoggedUserRoles().includes('ROLE_CLASS_MASTER');
  }

  hasRoleStudent(): boolean {
    return this.getLoggedUserRoles().includes('ROLE_STUDENT');
  }

  logout(): void {
    window.localStorage.clear();
  }
}
