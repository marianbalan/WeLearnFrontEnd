import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { IUser } from 'src/app/models/user';
import { SessionServiceService } from '../services/session/session-service.service';
import { UserServiceService } from '../services/user-service/user-service.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-main-director',
  templateUrl: './main-director.component.html',
  styleUrls: ['./main-director.component.css']
})
export class MainDirectorComponent implements OnInit {
  mode = 'Add';
  editId: number | undefined;

  currentTeacher: IUserViewModel | undefined;

  requiredMessage = 'This field is required.'
  emailMessage = 'Please insert a valid email address.'

  teachers: IUserViewModel[] = [] as IUserViewModel[];
  loggedUserId: number | undefined;
  schoolId: number | undefined;
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'phoneNumber', 'activated', 'actions'];

  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
  ]);
  firstName: FormControl = new FormControl('', [Validators.required]);
  lastName: FormControl = new FormControl('', [Validators.required]);
  pin: FormControl = new FormControl('', [Validators.required]);
  phoneNumber: FormControl = new FormControl('', [Validators.required]);

  addTeacherForm: FormGroup = new FormGroup({
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    pin: this.pin,
    phoneNumber: this.phoneNumber,
  })

  constructor(
    private userService: UserServiceService,
    private sessionService: SessionServiceService
  ) { }

  ngOnInit() {
    this.loggedUserId = this.sessionService.getLoggedUserId()!;
    this.schoolId = this.sessionService.getLoggedUserSchoolId()!;
    this.getTeachers();
  }

  getTeachers(): void {
    this.userService.getUsersBySchoolIdAndRole(this.schoolId!, 'ROLE_TEACHER').subscribe(
      teachers => {
        this.teachers = teachers
      }
    );
  }

  openModal(): void {
    this.showModal = true;
  }

  openDeleteModal(teacher: IUserViewModel): void {
    this.currentTeacher = teacher;
    this.showDeleteModal = true;
  }

  cancelDeleteModal(): void {
    this.showDeleteModal = false;
  }

  cancelModal(): void {
    if (this.showModal) {
      this.showModal = false;
    }
    this.addTeacherForm.reset();
  }

  submit(): void {
    if (!this.addTeacherForm.valid) {
      alert('Invalid form!');
      return;
    }

    const teacher = {
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      pin: this.pin.value,
      phoneNumber: this.phoneNumber.value,
      roles: ['ROLE_TEACHER']
    } as IUser

    if (this.mode === 'Add') {
      this.addTeacher(teacher);
    } else {
      this.editTeacher(teacher);
    }
  }

  private addTeacher(teacher: IUser): void {
    this.userService.addUser(teacher).subscribe(
      teacher => {
        this.teachers = this.teachers.concat([teacher]);
        this.cancelModal();
      },
    );
  }

  private editTeacher(teacher: IUser): void {
    this.userService.updateUser(this.editId!, teacher).subscribe(
      teacher => {
        const teacherIndex = this.teachers.findIndex(x => x.id == this.editId);
        this.teachers[teacherIndex] = teacher;
        this.teachers = this.teachers.concat([]);
        
        this.cancelModal();
      },
    );
  }

  openEditTeacher(teacher: IUserViewModel): void {
    this.mode = 'Edit';
    this.editId = teacher.id;

    this.addTeacherForm.get('email')?.setValue(teacher.email);
    this.addTeacherForm.get('firstName')?.setValue(teacher.firstName);
    this.addTeacherForm.get('lastName')?.setValue(teacher.lastName);
    this.addTeacherForm.get('pin')?.setValue(teacher.pin);
    this.addTeacherForm.get('phoneNumber')?.setValue(teacher.phoneNumber);

    this.openModal();  
  }

  openAddTeacher(): void {
    this.mode = 'Add';
    this.openModal();
  }

  removeTeacher(): void {
    this.userService.removeUser(this.currentTeacher!.id).subscribe(
      () => {
        this.teachers = this.teachers.filter(x => x != this.currentTeacher!);
        this.cancelDeleteModal();
      }
    );
  }

  getModalTitle(): string {
    return this.mode + ' Teacher';
  }

  getDirectorId(): number {
    return this.sessionService.getLoggedUserId()!;
  }
}
