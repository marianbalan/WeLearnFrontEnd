import { Router } from '@angular/router';
import { StudyGroupService } from './../services/study-group/study-group.service';
import { ISubject } from './../models/subject.model';
import { SessionServiceService } from './../services/session/session-service.service';
import { UserServiceService } from './../services/user-service/user-service.service';
import { SubjectService } from './../services/subject/subject.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { ISubjectViewModel } from './../models/subject-view-model.model';
import { IStudyGroupViewModel } from 'src/app/models/study-group-view-model.model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  public mode = 'Add';
  private _subjectToEdit: ISubjectViewModel | undefined;
  private currentSubject: ISubjectViewModel | undefined;

  public requiredMessage = 'This field is required.';

  // public subjects: ISubjectViewModel[] = [] as ISubjectViewModel[];
  public subjects: MatTableDataSource<ISubjectViewModel> | undefined;
  public teachers: IUserViewModel[] = [] as IUserViewModel[];
  public studyGroups: IStudyGroupViewModel[] = [] as IStudyGroupViewModel[];

  public showModal: boolean = false;
  public showDeleteModal: boolean = false;
  public displayedColumns: string[] = ['name', 'studyGroup'];

  public name: FormControl = new FormControl('', [Validators.required]);
  public teacher: FormControl = new FormControl('', [Validators.required]);
  public studyGroup: FormControl = new FormControl('', [Validators.required]);
  public form: FormGroup = new FormGroup({
    name: this.name,
    teacher: this.teacher,
    studyGroup: this.studyGroup,
  });

  public nameFilter: FormControl = new FormControl('');
  public teacherFilter: FormControl = new FormControl('');
  public studyGroupFilter: FormControl = new FormControl('');
  private filteredValues = {
    name: '',
    teacher: '',
    studyGroup: '' 
  };

  public filterNameMessage = 'Filter name';
  public filterTeacherMessage = 'Filter teacher';
  public filterStudyGroupMessage = 'Filter study-group';

  constructor(
    private subjectService: SubjectService,
    private userService: UserServiceService,
    private studyGroupService: StudyGroupService,
    private sessionService: SessionServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.hasRoleDirector()) {
      this.displayedColumns.push('teacher');
      this.displayedColumns.push('actions');

      this.getTeachers();
      this.getStudyGroups();
    }

    this.getSubjects();
  }

  private fillFilterPredicate(): void {
    this.nameFilter.valueChanges.subscribe(
      value => {
        this.filteredValues['name'] = value.trim().toLowerCase();
        this.subjects!.filter = JSON.stringify(this.filteredValues);
        this.filterNameMessage = '';
        if (value === '') {
          this.filterNameMessage = 'Filter name';
        }
      }
    );

    this.teacherFilter.valueChanges.subscribe(
      value => {
        this.filteredValues['teacher'] = value.trim().toLowerCase();
        this.subjects!.filter = JSON.stringify(this.filteredValues);
        this.filterTeacherMessage = '';
        if (value === '') {
          this.filterTeacherMessage = 'Filter name';
        }
      }
    );

    this.studyGroupFilter.valueChanges.subscribe(
      value => {
        this.filteredValues['studyGroup'] = value.trim().toLowerCase();
        this.subjects!.filter = JSON.stringify(this.filteredValues);
        this.filterStudyGroupMessage = '';
        if (value === '') {
          this.filterStudyGroupMessage = 'Filter study-group';
        }
      }
    );

    this.subjects!.filterPredicate = this.customFilterPredicate();
  }

  private getSubjects(): void {
    let request = this.subjectService.getSubjectsByTeacher(
      this.sessionService.getLoggedUserId()!
    );

    if (this.hasRoleDirector()) {
      request = this.subjectService.getSubjectsBySchool(
        this.sessionService.getLoggedUserSchoolId()!
      );
    }

    request.subscribe(
      subjects => {
        this.subjects = new MatTableDataSource(subjects);

        this.fillFilterPredicate();
      }
    )
  }

  private getStudyGroups(): void {
    this.studyGroupService.getStudyGroupsBySchoolId(
      this.sessionService.getLoggedUserSchoolId()!
    ).subscribe(
      studyGroups => {
        this.studyGroups = studyGroups;
      }
    )
  }

  private getTeachers(): void {
    this.userService.getUsersBySchoolIdAndRole(
      this.sessionService.getLoggedUserSchoolId()!,
      'ROLE_TEACHER',
    ).subscribe(
      teachers => {
        this.teachers = teachers
          .sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));
      }
    );
  }

  private openModal(): void {
    this.showModal = true;
  }

  public cancelModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  public openDeleteModal(current: ISubjectViewModel): void {
    this.currentSubject = current;
    this.showDeleteModal = true;
  }

  public cancelDeleteModal(): void {
    this.showDeleteModal = false;
  }

  public getModalTitle(): string {
    return this.mode + ' Subject';
  }

  public openAddSubject(): void {
    this.mode = 'Add';
    this.openModal();
  }

  public openEditSubject(subject: ISubjectViewModel): void {
    this.mode = 'Edit';
    this._subjectToEdit = subject;

    this.form.patchValue({
      name: subject.name,
      teacher: subject.teacher.id,
      studyGroup: subject.studyGroup.id
    })

    this.openModal();
  }

  public removeSubject(): void {
    this.subjectService.deleteSubject(this.currentSubject!.id)
        .subscribe(
          () => { 
            this.subjects!.data = this.subjects!.data.filter(x => x != this.currentSubject!);
            this.cancelDeleteModal();
          }
        );
  }

  private addSubject(subject: ISubject): void {
    this.subjectService.addSubject(subject)
      .subscribe(
        subject => {
          this.subjects!.data = this.subjects!.data.concat([subject])
            .sort((a,b) => a.name.localeCompare(b.name));

          this.cancelModal();
        }
      );
  }

  private editSubject(subject: ISubject): void {
    this.subjectService.updateSubject(this._subjectToEdit!.id, subject)
      .subscribe(
        subject => {
          const subjectIndex: number = this.subjects!.data.findIndex(x => x.id === this._subjectToEdit!.id);
          
          this.subjects!.data[subjectIndex] = subject;
          this.subjects!.data = this.subjects!.data.concat([]);

          this.cancelModal();
        }
      )
  }

  public submit(): void {
    if (this.form.invalid) {
      alert('Invalid form!');
    }

    const subject = {
      name: this.name.value,
      studyGroupId: parseInt(this.studyGroup.value),
      teacherId: parseInt(this.teacher.value)
    } as ISubject;

    switch(this.mode) {
      case 'Add':
        this.addSubject(subject);
        break;
      default:
        this.editSubject(subject);
    }
  }

  private customFilterPredicate() {
    const filterPredicate = (data: ISubjectViewModel, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return data.name.trim().toLowerCase().indexOf(searchString.name) !== -1 &&
        (data.teacher.firstName + data.teacher.lastName).trim().toLowerCase().indexOf(searchString.teacher) !== -1 &&
        (data.studyGroup.number + data.studyGroup.name).trim().toLowerCase().indexOf(searchString.studyGroup) !== -1;
    }

    return filterPredicate;
  }

  public toSituation(i: number): void {
    this.router.navigate([`/subjects/${this.subjects!.data[i].id}/situation`]);
  }

  public hasRoleDirector(): boolean {
    return this.sessionService.hasRoleDirector();
  }

  public hasRoleTeacher(): boolean {
    return this.sessionService.hasRoleTeacher();
  }

}
