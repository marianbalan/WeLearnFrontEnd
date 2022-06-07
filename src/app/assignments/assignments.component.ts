import { IAssignmentResponseViewModel } from './../models/assignment-response-view-model.model';
import { IAssignmentResponse } from './../models/assignment-response.model';
import { INlpOutput } from './../models/nlp-output.model';
import { IAssignment } from './../models/assignment.model';
import { SubjectService } from './../services/subject/subject.service';
import { ISubjectViewModel } from './../models/subject-view-model.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SessionServiceService } from './../services/session/session-service.service';
import { IAssignmentViewModel } from './../models/assignment-view-model.model';
import { AssignmentService } from './../services/assignment/assignment.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  public assignments: IAssignmentViewModel[] = [] as IAssignmentViewModel[];
  public selectedAssignment: IAssignmentViewModel | undefined;
  private _assignmentToDelete: IAssignmentViewModel | undefined;
  private _assignmentResponseToDelete: IAssignmentResponseViewModel | undefined;
  public subjects: ISubjectViewModel[] = [] as ISubjectViewModel[];
  public similarityReport: INlpOutput[] | undefined;
  public assignmentToEdit: IAssignmentViewModel | undefined;

  public showModal: boolean = false;
  public showSimilarityModal: boolean = false;
  public showDeleteModal: boolean = false;
  public showDeleteResponseModal: boolean = false;
  public mode: string = 'Add';
  public todayDate = new Date();
  public oneYearAfterTodayDate = new Date(this.todayDate.getFullYear() + 1, this.todayDate.getMonth(), this.todayDate.getDate());
  public displayedColumns = ['name1', 'pin1', 'download1', 'name2', 'pin2', 'download2', 'similarity'];

  public fileName: string = '';
  public file: FormData | undefined;

  public requiredMessage: string = 'This field is required.';

  public title: FormControl = new FormControl('', [Validators.required]);
  public description: FormControl = new FormControl('');
  public dueTo: FormControl = new FormControl('', [Validators.required]);
  public subject: FormControl = new FormControl('', [Validators.required]);

  public form: FormGroup = new FormGroup({
    title: this.title,
    description: this.description,
    dueTo: this.dueTo,
    subject: this.subject
  });

  constructor(
    private assignmentService: AssignmentService,
    private sessionService: SessionServiceService,
    private subjectService: SubjectService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.getAssignments();
    if (this.hasRoleTeacher()) {
      this.getSubjects();
    }
  }

  private getAssignments(): void {
    this.assignmentService.getAssignmentsByUserId(this.sessionService.getLoggedUserId()!).subscribe(
      assignments => { this.assignments = assignments; }
    );
  }

  private getSubjects(): void {
    this.subjectService.getSubjectsByTeacher(this.sessionService.getLoggedUserId()!).subscribe(
      subjects => this.subjects = subjects
    );
  }

  private getSimilarityReport(assignment: IAssignmentViewModel): void {
    this.assignmentService.getSimilarityReport(assignment.id).subscribe(
      similarityReport => this.similarityReport = similarityReport
    );
  }
  
  public convertTimestampToLocaleDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('ro-RO');
  }

  public downloadAssignmentFile(path: string): void {
    this.assignmentService.getAssignmentFileByPath(path).subscribe(
      fileBinary => {
        var file = new Blob([fileBinary], { type: 'application/pdf' });
        var fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = path;
        anchor.click();
      }
    );
  }

  public onAssignmentClick(assignment: IAssignmentViewModel): void {
    if (this.selectedAssignment !== undefined && this.selectedAssignment.id === assignment.id) {
      this.selectedAssignment = undefined;
      return;
    }

    this.selectedAssignment = assignment;
  }

  public getModalTitle(): string {
    return this.mode + ' Assignment';
  }

  public hasRoleTeacher(): boolean {
    return this.sessionService.hasRoleTeacher();
  }

  public hasRoleStudent(): boolean {
    return this.sessionService.hasRoleStudent();
  }

  public openAddAssignment(): void {
    this.mode = 'Add';
    this.showModal = true;
  }

  public cancelModal(): void {
    this.form.reset();
    this.file = undefined;
    this.showModal = false;
  }

  public submit(): void {
    if (this.form.invalid) {
      alert('Invalid form!');
      return;
    }
    
    const assignment = {
      title: this.title.value,
      description: this.description.value,
      date: this.mode === 'Add' ? ~~ (new Date().getTime() / 1000) : this.assignmentToEdit!.date,
      dueTo: ~~ (new Date(this.dueTo.value).getTime() / 1000),
      subjectId: parseInt(this.subject.value)
    } as IAssignment;

    switch (this.mode) {
      case 'Add':
        this.addAssignment(assignment);
        break;
      default:
        this.editAssignment(assignment);
    }

  }

  private addAssignment(assignment: IAssignment): void {
    this.assignmentService.addAssignment(assignment).subscribe(
      assignment => {
        if (this.file !== undefined) {
          this.assignmentService.addAssignmentAttachment(assignment.id, this.file).subscribe(
            fileName => {
              assignment.requirementFilePath = fileName;
              this.assignments = this.assignments.concat([assignment]);
              this.fileName = '';
              this.cancelModal();
            }
          );
        } else {
          this.assignments = this.assignments.concat([assignment]);
          this.cancelModal();
        }
      }
    );
  }

  public removeAssignment(): void {
    this.assignmentService.removeAssignment(this._assignmentToDelete!.id).subscribe(
      assignment => {
        this.assignments = this.assignments.filter(x => x.id !== assignment.id);
        this.cancelDeleteModal();
      }
    );
  }

  private editAssignment(assignment: IAssignment): void {
    this.assignmentService.updateAssignment(this.assignmentToEdit!.id, assignment).subscribe(
      assignment => {
        const index = this.assignments.findIndex(x => x.id === assignment.id);
        assignment.responses = this.assignments[index].responses;
        this.assignments[index] = assignment;
        this.assignments = this.assignments.concat([]);

        this.cancelModal();
      }
    )
  }

  public onFileSelected(event: any, assignment: IAssignmentViewModel | undefined = undefined): void{
    const file: File = event.target.files[0];
    console.log('aici0');

    if (!file) {
      this.snackBar.open('Invalid file.', '', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      this.snackBar.open('Only pdf and txt file formats are accepted.', '', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.fileName = file.name;

    const formData = new FormData();
    formData.append('thumbnail', file);

    this.file = formData;
    console.log('aici');

    if (this.hasRoleStudent() && assignment !== undefined) {
      console.log('aici2');
      const assignmentResponse = {
        date: ~~(new Date().getTime() / 1000),
        assignmentId: assignment.id,
        studentId: this.sessionService.getLoggedUserId()!
      } as IAssignmentResponse;

      this.addAssignmentResponse(assignmentResponse);
    }
  }

  public isPastDue(dueTo: number): boolean {
    return dueTo + 24*60*60 < this.todayDate.getTime() / 1000;
  }

  public openEditAssignment(assignment: IAssignmentViewModel): void {
    this.mode = 'Edit';
    this.showModal = true;

    this.form.patchValue({
      title: assignment.title,
      description: assignment.description,
      dueTo: new Date(assignment.dueTo * 1000),
      subject: assignment.subject.id
    });

    this.assignmentToEdit = assignment;
  }

  public updateAssignmentClosed(assignment: IAssignmentViewModel): void {
    this.assignmentService.updateAssignmentClosed(assignment.id, !assignment.closed).subscribe(
      () => {
        const index = this.assignments.findIndex(x => x.id === assignment.id);
        this.assignments[index].closed = !assignment.closed;
        this.assignments = this.assignments.concat([]);
      }
    )
  }

  private addAssignmentResponse(assignmentResponse: IAssignmentResponse): void {
    this.assignmentService.addAssignmentResponse(assignmentResponse).subscribe(
      assignmentResponse => {
        if (this.file !== undefined) {
          this.assignmentService.addAssignmentResponseAttachment(assignmentResponse.id, this.file).subscribe(
            fileName => {
              assignmentResponse.filePath = fileName;
              const index = this.assignments.findIndex(x => x.id === assignmentResponse.assignmentId);
              this.assignments[index].responses.push(assignmentResponse);
              this.assignments = this.assignments.concat([]);

              this.cancelModal();
            }
          );
        } else {
            const index = this.assignments.findIndex(x => x.id === assignmentResponse.assignmentId);
            this.assignments[index].responses.push(assignmentResponse);
            this.assignments = this.assignments.concat([]);
            
            this.cancelModal();
        }
      }
    );
  }

  public removeAssignmentResponse(): void {
    this.assignmentService.removeAssignmentResponse(this._assignmentResponseToDelete!.id).subscribe(
      assignmentResponse => {
        const index = this.assignments.findIndex(x => x.id === assignmentResponse.assignmentId);
        this.assignments[index].responses = this.assignments[index].responses.filter(x => x.id !== assignmentResponse.id);
        this.cancelDeleteResponseModal();
      }
    )
  }

  public getAttachedFileName(assignment: IAssignmentViewModel): string | undefined {
    if (assignment.responses.length !== 0) {
      return assignment.responses[0].filePath!
    }

    return undefined;
  }

  public downloadAssignmentResponse(path: string): void {
    this.assignmentService.getAssignmentResponseFileByPath(path).subscribe(
      fileBinary => {
        var file = new Blob([fileBinary], { type: 'application/pdf' });
        var fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = path;
        anchor.click();
      }
    );
  }

  public showSimilarityPopup(assignment: IAssignmentViewModel): void {
    this.showSimilarityModal = true;
    this.getSimilarityReport(assignment);
  }

  public cancelSimilarityPopup(): void {
    this.showSimilarityModal = false;
    this.similarityReport = undefined;
  }

  public getStudentSimilarityRate(): number {
    return this.similarityReport![0].similarityRate * 100 | 0;
  }

  public formatSimilarityRate(output: number) {
    return output * 100 | 0;
  }

  public openDeleteModal(current: IAssignmentViewModel): void {
    this._assignmentToDelete = current;
    this.showDeleteModal = true;
  }

  public cancelDeleteModal(): void {
    this.showDeleteModal = false;
  }
  
  public openDeleteResponseModal(current: IAssignmentResponseViewModel): void {
    this._assignmentResponseToDelete = current;
    this.showDeleteResponseModal = true;
  }

  public cancelDeleteResponseModal(): void {
    this.showDeleteResponseModal = false;
  }
}
