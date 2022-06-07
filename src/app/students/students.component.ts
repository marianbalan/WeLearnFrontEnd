import { StudyGroupService } from './../services/study-group/study-group.service';
import { MatTableDataSource } from '@angular/material/table';
import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IStudyGroupViewModel } from '../models/study-group-view-model.model';
import { ISubjectViewModel as IStudentViewModel } from '../models/subject-view-model.model';
import { DataSharingService } from '../services/data-sharing/data-sharing.service';
import { SessionServiceService } from '../services/session/session-service.service';
import { UserServiceService } from '../services/user-service/user-service.service';
import { IUser } from '../models/user';
import { Role } from '../models/user-role.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  public mode = 'Add';
  private _studentToEdit: IUserViewModel | undefined;

  public requiredMessage = 'This field is required.';
  public emailMessage = 'Please insert a valid email address.'

  public students: MatTableDataSource<IUserViewModel> | undefined;
  public studyGroups: IStudyGroupViewModel[] = [] as IStudyGroupViewModel[];

  public showModal: boolean = false;
  public showDeleteModal: boolean = false;
  public displayedColumns: string[] = ['email', 'firstName', 'lastName', 'studyGroup', 'activated', 'actions', 'situation'];

  public email: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
  ]);
  public firstName: FormControl = new FormControl('', [Validators.required]);
  public lastName: FormControl = new FormControl('', [Validators.required]);
  public pin: FormControl = new FormControl('', [Validators.required]);
  public phoneNumber: FormControl = new FormControl('', [Validators.required]);
  public studyGroup: FormControl = new FormControl('', [Validators.required]);
  public form: FormGroup = new FormGroup({
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    pin: this.pin,
    phoneNumber: this.phoneNumber,
    studyGroup: this.studyGroup
  })

  public emailFilter: FormControl = new FormControl('');
  public firstNameFilter: FormControl = new FormControl('');
  public lastNameFilter: FormControl = new FormControl('');
  public phoneNumberFilter: FormControl = new FormControl('');
  public studyGroupFilter: FormControl = new FormControl('');
  public activatedFilter: FormControl = new FormControl('');
  private _filteredValues = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    studyGroup: '',
    activated: ''
  }

  public filterEmailMessage = 'Filter email';
  public filterFirstNameMessage = 'Filter first name';
  public filterLastNameMessage = 'Filter last name';
  public filterPhoneNumberMessage = 'Filter phone number';
  public filterStudyGroupMessage = 'Filter study-group';
  public filterActivatedMessage = 'Filter activated';

  constructor(
    private userService: UserServiceService,
    private sessionService: SessionServiceService,
    private studyGroupService: StudyGroupService,
    private router: Router    
  ) { }

  ngOnInit() {
    this.getStudents();

    if (this.hasRoleDirector()) {
      this.getStudyGroups();
    }
  }

  private fillFilterPredicate(): void {
    this.emailFilter.valueChanges.subscribe(
      value => {
        this._filteredValues['email'] = value.trim().toLowerCase();
        this.students!.filter = JSON.stringify(this._filteredValues);
        this.filterEmailMessage = '';
        if (value === '') {
          this.filterEmailMessage = 'Filter email';
        }
      }
    );

    this.firstNameFilter.valueChanges.subscribe(
      value => {
        this._filteredValues['firstName'] = value.trim().toLowerCase();
        this.students!.filter = JSON.stringify(this._filteredValues);
        this.filterFirstNameMessage = '';
        if (value === '') {
          this.filterFirstNameMessage = 'Filter first name';
        }
      }
    );

    this.lastNameFilter.valueChanges.subscribe(
      value => {
        this._filteredValues['lastName'] = value.trim().toLowerCase();
        this.students!.filter = JSON.stringify(this._filteredValues);
        this.filterLastNameMessage = '';
        if (value === '') {
          this.filterLastNameMessage = 'Filter last name';
        }
      }
    );

    this.phoneNumberFilter.valueChanges.subscribe(
      value => {
        this._filteredValues['phoneNumber'] = value.trim().toLowerCase();
        this.students!.filter = JSON.stringify(this._filteredValues);
        this.filterPhoneNumberMessage = '';
        if (value === '') {
          this.filterPhoneNumberMessage = 'Filter phone number';
        }
      }
    );

    this.studyGroupFilter.valueChanges.subscribe(
      value => {
        this._filteredValues['studyGroup'] = value.trim().toLowerCase();
        this.students!.filter = JSON.stringify(this._filteredValues);
        this.filterStudyGroupMessage = '';
        if (value === '') {
          this.filterStudyGroupMessage = 'Filter study-group';
        }
      }
    );

    this.activatedFilter.valueChanges.subscribe(
      value => {
        this._filteredValues['activated'] = value.trim().toLowerCase();
        this.students!.filter = JSON.stringify(this._filteredValues);
        this.filterActivatedMessage = '';
        if (value === '') {
          this.filterActivatedMessage = 'Filter activated';
        }
      }
    );

    this.students!.filterPredicate = this.customFilterPredicate();
  }

  private customFilterPredicate() {
    const filterPredicate = (data: IUserViewModel, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return data.email.trim().toLowerCase().indexOf(searchString.email) !== -1 &&
        data.firstName.trim().toLowerCase().indexOf(searchString.firstName) !== -1 &&
        data.lastName.trim().toLowerCase().indexOf(searchString.lastName) !== -1 &&
        data.phoneNumber.trim().toLowerCase().indexOf(searchString.phoneNumber) !== -1 &&
        (data.studyGroup!.number + '' + data.studyGroup!.name).trim().toLowerCase().indexOf(searchString.phoneNumber) !== -1 &&
        data.activated.trim().toLowerCase().indexOf(searchString.activated) !== -1;
    }

    return filterPredicate;
  }

  private getStudents(): void {
    let request = this.userService.getUsersByStudyGroupIdAndRole(
      this.sessionService.getLoggedUserStudyGroupId()!,
      Role.Student,
    );

    if (this.hasRoleDirector()) {
      request = this.userService.getUsersBySchoolIdAndRole(
        this.sessionService.getLoggedUserSchoolId()!,
        Role.Student
      );
    }

    request.subscribe(
      students => {
        this.students = new MatTableDataSource(students);

        this.fillFilterPredicate();
      }
    );
  }

  private openModal(): void {
    this.showModal = true;

    if (this.hasRoleDirector() === false) {
      this.studyGroup.clearValidators();
    }
  }

  public cancelModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  public openDeleteModal(current: IUserViewModel): void {
    this._studentToEdit = current;
    this.showDeleteModal = true;
  }

  public cancelDeleteModal(): void {
    this.showDeleteModal = false;
  }

  public getModalTitle(): string {
    return this.mode + ' Subject';
  }

  public openAddStudent(): void {
    this.mode = 'Add';
    this.openModal();
  }

  public openEditStudent(student: IUserViewModel): void {
    this.mode = 'Edit';
    this._studentToEdit = student;

    this.form.patchValue({
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      pin: student.pin,
      phoneNumber: student.phoneNumber,
      studyGroup: student.studyGroup!.id
    });

    this.openModal();
  }

  public removeStudent(): void {
    this.userService.removeUser(this._studentToEdit!.id)
        .subscribe(
          () => {
            this.students!.data = this.students!.data.filter(x => x != this._studentToEdit!);
            this.cancelDeleteModal();
          }
        );
  }

  private addStudent(student: IUser): void {
    this.userService.addUser(student)
      .subscribe(
        student => {
          this.students!.data = this.students!.data.concat([student])
            .sort((a,b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));

          this.cancelModal();
        }
      );
  }

  private editStudent(student: IUser): void {
    this.userService.updateUser(this._studentToEdit!.id, student)
      .subscribe(
        student => {
          const subjectIndex: number = this.students!.data.findIndex(x => x.id === this._studentToEdit!.id);
          
          this.students!.data[subjectIndex] = student;
          this.students!.data = this.students!.data.concat([]);

          this.cancelModal();
        }
      )
  }

  public submit(): void {
    if (this.form.invalid) {
      alert('Invalid form!');
    }

    const student = {
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      pin: this.pin.value,
      phoneNumber: this.phoneNumber.value,
      roles: ['ROLE_STUDENT'],
      studyGroupId: this.hasRoleDirector() 
        ? parseInt(this.studyGroup.value) : this.sessionService.getLoggedUserStudyGroupId()!
    } as IUser

    switch(this.mode) {
      case 'Add':
        this.addStudent(student);
        break;
      default:
        this.editStudent(student);
    }
  }

  public openSituation(student: IUserViewModel): void {
    this.router.navigate([`/students/${student.id}/situation`]);
  }

  public getStudyGroups(): void {
    this.studyGroupService.getStudyGroupsBySchoolId(
      this.sessionService.getLoggedUserSchoolId()!,
    ).subscribe(
      studyGroups => {
        this.studyGroups = studyGroups;
      }
    );
  }

  public hasRoleDirector(): boolean {
    return this.sessionService.hasRoleDirector();
  }
}
