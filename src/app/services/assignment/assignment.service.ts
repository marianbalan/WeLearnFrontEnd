import { INlpOutput } from './../../models/nlp-output.model';
import { IAssignmentResponseViewModel } from './../../models/assignment-response-view-model.model';
import { IAssignmentResponse } from './../../models/assignment-response.model';
import { IAssignment } from './../../models/assignment.model';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAssignmentViewModel } from 'src/app/models/assignment-view-model.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAssignmentsByUserId(userId: number): Observable<IAssignmentViewModel[]> {
    return this.httpClient.get<IAssignmentViewModel[]>(
      this.apiUrl + '/assignments/user/' + userId
    );
  }

  public getAssignmentFileByPath(path: string): Observable<Blob> {
    const params = new HttpParams().set('path', path);

    return this.httpClient.get(
      this.apiUrl + '/assignments/file', {
        params: params,
        responseType: 'blob'
      },
    );
  }

  public addAssignment(assignment: IAssignment): Observable<IAssignmentViewModel> {
    const body: string = JSON.stringify(assignment);

    return this.httpClient.post<IAssignmentViewModel>(this.apiUrl + '/assignments', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    });
  }

  public addAssignmentAttachment(id: number, file: FormData): Observable<any> {
    return this.httpClient.post(
      this.apiUrl + '/assignments/' + id + '/file', file, {
        responseType: 'text'
      }
    );
  }

  public updateAssignment(id: number, assignment: IAssignment): Observable<IAssignmentViewModel> {
    const body: string = JSON.stringify(assignment);

    return this.httpClient.put<IAssignmentViewModel>(this.apiUrl + '/assignments/' + id, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  public updateAssignmentClosed(id: number, closed: boolean): Observable<any> {
    return this.httpClient.patch(
      this.apiUrl + '/assignments/' + id,
      { closed: closed },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  public addAssignmentResponse(assignmentResponse: IAssignmentResponse): Observable<IAssignmentResponseViewModel> {
    const body: string = JSON.stringify(assignmentResponse);

    return this.httpClient.post<IAssignmentResponseViewModel>(this.apiUrl + '/assignment-responses?XDEBUG_SESSION_START=PHPSTORM', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    });
  }

  public addAssignmentResponseAttachment(id: number, file: FormData): Observable<any> {
    return this.httpClient.post(
      this.apiUrl + '/assignment-responses/' + id + '/file', file, {
        responseType: 'text'
      }
    );
  }

  public getAssignmentResponseFileByPath(path: string): Observable<Blob> {
    const params = new HttpParams().set('path', path);

    return this.httpClient.get(
      this.apiUrl + '/assignment-responses/file', {
        params: params,
        responseType: 'blob'
      },
    );
  }

  public getSimilarityReport(assignmentId: number): Observable<INlpOutput[]> {
    return this.httpClient.get<INlpOutput[]>(
      this.apiUrl + '/assignments/' + assignmentId + '/similarity-report'
    );
  }

  public removeAssignment(assignmentId: number): Observable<IAssignmentViewModel> {
    return this.httpClient.delete<IAssignmentViewModel>(
      this.apiUrl + '/assignments/' + assignmentId
    );
  }

  public removeAssignmentResponse(assignmentResponseId: number): Observable<IAssignmentResponseViewModel> {
    return this.httpClient.delete<IAssignmentResponseViewModel>(
      this.apiUrl + '/assignment-responses/' + assignmentResponseId
    );
  }
}
