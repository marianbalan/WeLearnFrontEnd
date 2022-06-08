import { IUser } from './../models/user';
import { INonAttendanceViewModel } from './../models/non-attendance-view-model.model';
import { IGradeViewModel } from './../models/grade-view-model.model';
import { IGrade } from './../models/grade.model';
import { INonAttendance } from './../models/non-attendance.model';
import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { SituationService } from './../services/situation-service/situation.service';
import { SessionServiceService } from './../services/session/session-service.service';
import { SubjectService } from './../services/subject/subject.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ISubjectViewModel } from './../models/subject-view-model.model';
import { Component, OnInit } from '@angular/core';
import { ISubjectStuationViewModel } from '../models/subject-situation-view-model.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subject-situation',
  templateUrl: './subject-situation.component.html',
  styleUrls: ['./subject-situation.component.css']
})
export class SubjectSituationComponent implements OnInit {
  private _subjectId: number | undefined;
  public subject: ISubjectViewModel | undefined;
  public situation: MatTableDataSource<ISubjectStuationViewModel> | undefined;
  private _currentNonAttendance: INonAttendanceViewModel | undefined;

  public mode: string = 'grades';
  public modalMode: string = 'Add';
  public showModal: boolean = false;
  public showDeleteModal: boolean = false;
  public showNonAttendanceModal: boolean = false;
  public showMotivateNonAttendanceModal: boolean = false;

  private _student: IUserViewModel | undefined;
  private _grade: IGradeViewModel | undefined;

  public requiredMessage: string = 'This field is required.'
  public invalidGradeMessage: string = 'The grade needs to be between 1 and 10.'

  public unmotivatedNonAttendances: number = 0;
  public totalAverageScore: string = '0';
  public totalNonAttendances: number = 0;
  public totalUnmotivatedNonAttendances: number = 0;

  public displayedGradeColumns = ['name', 'pin', 'grades', 'averageScore'];
  public displayedNonAttendanceColumns = ['name', 'pin', 'nonAttendances'];

  public nameFilter: FormControl = new FormControl('');
  public pinFilter: FormControl = new FormControl('');
  private filteredValues = {
    name: '',
    pin: ''
  }

  public filterNameMessage = 'Filter name';
  public filterPinMessage = 'Filter personal indentification number';

  public grade: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(10)
  ]);
  public gradeForm: FormGroup = new FormGroup({
    grade: this.grade
  });

  private fillFilterPredicate(): void {
    this.nameFilter.valueChanges.subscribe(
      value => {
        this.filteredValues['name'] = value.trim().toLowerCase();
        this.situation!.filter = JSON.stringify(this.filteredValues);
        this.filterNameMessage = '';
        if (value === '') {
          this.filterNameMessage = 'Filter name';
        }
      }
    );

    this.pinFilter.valueChanges.subscribe(
      value => {
        this.filteredValues['pin'] = value.trim().toLowerCase();
        this.situation!.filter = JSON.stringify(this.filteredValues);
        this.filterPinMessage = '';
        if (value === '') {
          this.filterPinMessage = 'Filter personal indentification number';
        }
      }
    );

    this.situation!.filterPredicate = this.customFilterPredicate();
  }

  private customFilterPredicate() {
    const filterPredicate = (data: ISubjectStuationViewModel, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return (data.user.firstName + data.user.lastName).trim().toLowerCase().indexOf(searchString.name) !== -1 &&
      data.user.pin.trim().toLowerCase().indexOf(searchString.pin) !== -1;
    }

    return filterPredicate;
  }

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private sessionService: SessionServiceService,
    private situationService: SituationService
  ) {
    this.route.params.subscribe(params => this._subjectId = params['id']); 
  }

  ngOnInit() {
    this.getSubjectAndSituation();
  }

  private getSubjectAndSituation(): void {
    this.subjectService.getSubjectById(this._subjectId!)
      .subscribe(
        subject => {
          this.subject = subject;
          if (this.isTeachingSubject()) {
            this.displayedGradeColumns.push('add');
            this.displayedNonAttendanceColumns.push('add');
          }

          this.getSituation();
        }
      );
  }

  private getSituation(): void {
    this.situationService.getSituationBySubject(
      this.subject!.id
    ).subscribe(
      situation => {
        this.situation = new MatTableDataSource(situation);

        this.totalAverageScore = this.computeTotalAverageScore();
        this.totalNonAttendances = this.countTotalNonAttendances();
        this.totalUnmotivatedNonAttendances = this.countTotalUnmotivatedNonAttendances();
        
        this.fillFilterPredicate();
      }
    );
  }

  public convertTimestampToLocaleDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('ro-RO');
  }

  private computeTotalAverageScore(): string {
    const averageScores = this.situation!.data.map(situation => situation.averageScore);
    const averageScoresLenght = averageScores.filter(x => x !== null && x !== undefined).length;

    const averageScore = (averageScores.reduce(
        (partialSum, averageScore) => averageScore != null ? partialSum! + averageScore : partialSum
    )! / averageScoresLenght).toFixed(2);

    return averageScore !== 'NaN' ? averageScore : '0';
  }

  private countTotalNonAttendances(): number {
    return this.situation!.data.map(situation => situation.nonAttendances.length)
      .reduce(
        (partialSum, nonAttendancesCount) => partialSum + nonAttendancesCount
      );
  }

  private countTotalUnmotivatedNonAttendances(): number {
    return this.situation!.data.map(
      situation => situation.nonAttendances.filter(x => x.motivated === false).length
    ).reduce(
      (partialSum, nonAttendancesCount) => partialSum + nonAttendancesCount
    );
  }

  public updateNonAttendanceMotivatedStatus(): void {
    const id = this._currentNonAttendance!.id;
    const newStatus = !this._currentNonAttendance!.motivated;

    this.situationService.updateNonAttendanceMotivatedStatus(id, newStatus)
      .subscribe(
        () => {
          this.situation!.data.forEach(situation => {
            situation.nonAttendances.forEach(nonAttendance => {
              if (nonAttendance.id === id) {
                nonAttendance.motivated = newStatus;
                this.totalUnmotivatedNonAttendances = this.countTotalUnmotivatedNonAttendances();
              }
            })
          });
          this.cancelMotivateNonAttendanceModal();
        }
      );
  }

  public hasMotivateNonAttendanceAccess(): boolean {
    return this.sessionService.hasRoleDirector() ||
      this.sessionService.hasRoleClassMaster() ||
      this.sessionService.hasRoleTeacher();
  }

  public isTeachingSubject(): boolean {
    return this.subject !== undefined &&
     this.subject!.teacher.id === this.sessionService.getLoggedUserId()!;
  }

  public openAddGrade(student: IUserViewModel): void {
    this.modalMode = 'Add';
    this._student = student;
    this.showModal = true;
  }

  public cancelModal(): void {
    this.showModal = false;
    this.gradeForm.reset();
  }

  public addNonAttendance(): void {
    console.log(this._student);

    const nonAttendance: INonAttendance = {
      date: ~~ (new Date().getTime() / 1000),
      subjectId: this.subject!.id,
      studentId: this._student!.id,
      motivated: false
    } as INonAttendance;

    this.situationService.addNonAttendance(nonAttendance)
      .subscribe(
        nonAttendance => {
          this.situation!.data.forEach(situation => {
            if (situation.user.id === this._student!.id) {
              situation.nonAttendances.push(nonAttendance);
            }
          });

          this.totalNonAttendances++;
          this.totalUnmotivatedNonAttendances++;
          this.cancelNonAttendanceModal();
        }
      );
  }

  public submit(): void {
    if (this.gradeForm.invalid) {
      alert('Invalid form!');
      return;
    }

    const toAddGrade: IGrade = {
      grade: this.grade.value,
      date: ~~ (new Date().getTime() / 1000),
      subjectId: this.subject!.id,
      studentId: this._student!.id,
    } as IGrade;

    if (this.modalMode === 'Add') {
      this.situationService.addGrade(toAddGrade)
        .subscribe(
          grade => {
            this.situation!.data.forEach(situation => {
              if (situation.user.id === toAddGrade.studentId) {
                situation.grades.push(grade);
                situation.averageScore = this.calculateAverageScoreFromGrades(situation.grades);
              }
            });

            this.totalAverageScore = this.computeTotalAverageScore();

            this.cancelModal();
          }
        );
    } else {
      const newGrade = this.grade.value;
      this.situationService.updateGradeMark(this._grade!.id, newGrade)
        .subscribe(() => {
          this.situation!.data.forEach(situation => {
            situation.grades.forEach(grade => {
              if (grade.id === this._grade!.id) {
                grade.grade = newGrade;
                situation.averageScore = this.calculateAverageScoreFromGrades(situation.grades);
                this.cancelModal();
              }
            });
          });

          this.totalAverageScore = this.computeTotalAverageScore();
        });
    }
  }

  private calculateAverageScoreFromGrades(grades: IGradeViewModel[]): number | undefined
  {
    const gradesLenght = grades.length;
    if (gradesLenght === 0) {
      return undefined;
    }

    return Math.round(grades.map(x => x.grade)
      .reduce((partialSum, grade) => partialSum + grade, 0) / gradesLenght);
  }

  public openEditGrade(grade: IGradeViewModel, studentIndex: number): void {
    if (!this.isTeachingSubject()) {
      return;
    }

    this.modalMode = 'Edit';
    this._student = this.situation!.data[studentIndex].user;
    this._grade = grade;

    this.gradeForm.patchValue({
      grade: grade.grade
    });

    this.showModal = true;
  }

  public hasDirectorAccess(): boolean {
    return this.sessionService.hasRoleDirector();
  }

  public deleteGrade(): void {
    const gradeId = this._grade!.id;
    this.situationService.removeGrade(gradeId)
      .subscribe(() => {
        this.situation!.data.forEach(situation => {
          situation.grades.forEach(grade => {
            if (grade.id === gradeId) {
              situation.grades = situation.grades.filter(x => x.id !== gradeId);
              situation.averageScore = this.calculateAverageScoreFromGrades(situation.grades);
              this.cancelModal();
              this.cancelDeleteModal();
            }
          });
        }) 

        this.totalAverageScore = this.computeTotalAverageScore();
      });
  }

  public openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  public cancelDeleteModal(): void {
    this.showDeleteModal = false;
  }

  public openNonAttendanceModal(student: IUserViewModel): void {
    this._student = student;
    this.showNonAttendanceModal = true;
  }

  public cancelNonAttendanceModal(): void {
    this.showNonAttendanceModal = false;
  }

  public openMotivateNonAttendanceModal(nonAttendance: INonAttendanceViewModel): void {
    this._currentNonAttendance = nonAttendance;
    this.showMotivateNonAttendanceModal = true;
  }

  public cancelMotivateNonAttendanceModal(): void {
    this.showMotivateNonAttendanceModal = false;
  }

}
