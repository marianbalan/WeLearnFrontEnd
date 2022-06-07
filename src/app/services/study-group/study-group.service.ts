import { IStudyGroup } from './../../models/study-group.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudyGroupViewModel } from 'src/app/models/study-group-view-model.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { NumberInput } from '@angular/cdk/coercion';

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {
  private apiUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getStudyGroupsBySchoolId(schoolId: NumberInput) {
    return this.httpClient.get<IStudyGroupViewModel[]>(
      `${this.apiUrl}/study-groups/school/${schoolId}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    });
  }
  
  addStudyGroup(studyGroup: IStudyGroup): Observable<IStudyGroupViewModel> {
    const body = JSON.stringify(studyGroup);

    return this.httpClient.post<IStudyGroupViewModel>(this.apiUrl + '/study-group', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  removeStudyGroup(id: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + '/study-group/' + id + '?XDEBUG_SESSION_START=PHPSTORM', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  updateStudyGroup(id: number, studyGroup: IStudyGroup): Observable<IStudyGroupViewModel> {
    const body = JSON.stringify(studyGroup);

    return this.httpClient.put<IStudyGroupViewModel>(this.apiUrl + '/study-group/' + id, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
