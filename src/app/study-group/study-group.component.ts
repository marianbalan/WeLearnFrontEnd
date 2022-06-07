import { UserServiceService } from './../services/user-service/user-service.service';
import { IStudyGroup } from './../models/study-group.model';
import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { StudyGroupService } from './../services/study-group/study-group.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IStudyGroupViewModel } from '../models/study-group-view-model.model';
import { SessionServiceService } from '../services/session/session-service.service';

@Component({
  selector: 'app-study-group',
  templateUrl: './study-group.component.html',
  styleUrls: ['./study-group.component.css']
})
export class StudyGroupComponent implements OnInit {
  mode = 'Add';
  editId: number | undefined;
  currentStudyGroup: IStudyGroupViewModel | undefined;

  requiredMessage = 'This field is required.';

  studyGroups: IStudyGroupViewModel[] = [] as IStudyGroupViewModel[];
  teachers: IUserViewModel[] = [] as IUserViewModel[];

  loggedUserId: number | undefined;
  schoolId: number | undefined;
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  displayedColumns: string[] = ['number', 'name', 'specialization', 'classMaster', 'actions'];

  name: FormControl = new FormControl('', [Validators.required]);
  number: FormControl = new FormControl('', [Validators.required]);
  specialization: FormControl = new FormControl('', [Validators.required]);
  classMaster: FormControl = new FormControl('', [Validators.required]);

  form: FormGroup = new FormGroup({
    name: this.name,
    number: this.number,
    specialization: this.specialization,
    classMaster: this.classMaster
  })

  constructor(
    private sessionService: SessionServiceService,
    private studyGroupService: StudyGroupService,
    private userService: UserServiceService,
  ) { }

  ngOnInit() {
    this.loggedUserId = this.sessionService.getLoggedUserId()!;
    this.schoolId = this.sessionService.getLoggedUserSchoolId()!;
    this.getStudyGroups();
  }

  getStudyGroups(): void {
    this.studyGroupService.getStudyGroupsBySchoolId(this.schoolId!).subscribe(
      studyGroups => {
        this.studyGroups = studyGroups
            .sort((a,b) => a.number - b.number || a.name.localeCompare(b.name))
      }
    );
  }

  getTeachers(optionalToAdd: IUserViewModel | undefined = undefined): void {
    this.userService.getNonClassMasterTeachersBySchoolId(
      this.sessionService.getLoggedUserSchoolId()!,
    ).subscribe(
      teachers => {
        this.teachers = teachers.sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));

        if (optionalToAdd !== undefined) {
          this.teachers.unshift(optionalToAdd);
        }
      }
    );
  }

  private openModal(): void {
    this.showModal = true;
  }

  cancelModal(): void {
    if (this.showModal) {
      this.showModal = false;
    }

    if (this.mode == 'Edit') {
        this.teachers.shift();
    }

    this.form.reset();
  }

  openDeleteModal(current: IStudyGroupViewModel): void {
    this.currentStudyGroup = current;
    this.showDeleteModal = true;
  }

  cancelDeleteModal(): void {
    this.showDeleteModal = false;
  }

  submit(): void {
    if(!this.form.valid) {
      alert('Invalid form!');
    }
    
    const studyGroup = {
      number: this.number.value,
      name: this.name.value,
      specialization: this.specialization.value,
      schoolId: this.sessionService.getLoggedUserSchoolId(),
      classMasterId: parseInt(this.classMaster.value)
    } as IStudyGroup;

    if (this.mode === 'Add') {
      this.addStudyGroup(studyGroup);
    } else {
      this.editStudyGroup(studyGroup);
    }
  }

  private addStudyGroup(studyGroup: IStudyGroup): void {
    this.studyGroupService.addStudyGroup(studyGroup).subscribe(
      studyGroup => {
        this.studyGroups = this.studyGroups.concat(studyGroup)
            .sort((a,b) => a.number - b.number || a.name.localeCompare(b.name));
        this.teachers = this.teachers.filter(x => x.id != this.classMaster.value);
        this.cancelModal();
      }
    );
  }

  private editStudyGroup(studyGroup: IStudyGroup): void {
    this.studyGroupService.updateStudyGroup(this.editId!, studyGroup).subscribe(
      studyGroup => {
        const studyGroupIndex = this.studyGroups.findIndex(x => x.id == this.editId!);

        this.studyGroups[studyGroupIndex] = studyGroup;
        this.studyGroups = this.studyGroups.concat([]);

        this.cancelModal();
      }
    );
  }

  openEditStudyGroup(studyGroup: IStudyGroupViewModel): void {
    this.mode = 'Edit';
    this.editId = studyGroup.id;

    this.getTeachers(studyGroup.classMaster);

    this.form.patchValue({
      number: studyGroup.number,
      name: studyGroup.name,
      specialization: studyGroup.specialization,
      classMaster: studyGroup.classMaster.id
    });

    this.openModal();
  }

  removeStudyGroup(): void {
    this.studyGroupService.removeStudyGroup(this.currentStudyGroup!.id).subscribe(
      () => {
        this.studyGroups = this.studyGroups.filter(x => x != this.currentStudyGroup!);
        this.cancelDeleteModal();
      }
    );
  }

  openAddStudyGroup(): void {
    this.mode = 'Add';
    this.getTeachers();
    this.openModal();
  }

  getModalTitle(): string {
    return this.mode + ' Study Group';
  }
}
