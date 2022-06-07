import { jsPDF } from 'jspdf';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { SituationService } from './../services/situation-service/situation.service';
import { SessionServiceService } from './../services/session/session-service.service';
import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { UserServiceService } from './../services/user-service/user-service.service';
import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStuationViewModel } from 'src/app/models/situation-view-model.model';
import 'jspdf-autotable';

declare var require: any;

@Component({
  selector: 'app-situation',
  templateUrl: './situation.component.html',
  styleUrls: ['./situation.component.css']
})
export class SituationComponent implements OnInit {
  private _studentId: number | undefined;
  public student: IUserViewModel | undefined;
  public situation: MatTableDataSource<IStuationViewModel> | undefined;
  public mode: string = 'grades';

  public unmotivatedNonAttendances: number = 0;

  public displayedGradeColumns = ['subject', 'grades', 'averageScore'];
  public displayedNonAttendanceColumns = ['subject', 'nonAttendances'];

  public subjectFilter: FormControl = new FormControl('');
  private filteredValues = {
    subject: ''
  };

  public totalAverageScore: string = '0';
  public totalNonAttendances: number = 0;
  public totalUnmotivatedNonAttendances: number = 0;

  public filterSubjectMessage = 'Filter subject';

  private situationtable: ElementRef | undefined;

  @ViewChild('situationtable', { static: false }) set content(content: ElementRef) {
    if (content) {
      this.situationtable = content;
    }
  };;

  private fillFilterPredicate(): void {
    this.subjectFilter.valueChanges.subscribe(
      value => {
        this.filteredValues['subject'] = value.trim().toLowerCase();
        this.situation!.filter = JSON.stringify(this.filteredValues);
        this.filterSubjectMessage = '';
        if (value === '') {
          this.filterSubjectMessage = 'Filter subject';
        }
      }
    );

    this.situation!.filterPredicate = this.customFilterPredicate();
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private sessionService: SessionServiceService,
    private situationService: SituationService
  ) { 
    this.route.params.subscribe(params => this._studentId = params['id']);
  }

  ngOnInit() {
    this.getStudentAndSituation();
  }

  private customFilterPredicate() {
    const filterPredicate = (data: IStuationViewModel, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return data.subject.name.trim().toLowerCase().indexOf(searchString.subject) !== -1;
    }

    return filterPredicate;
  }

  private getStudentAndSituation(): void {
    this.userService.getUserById(this._studentId!)
      .subscribe(
        student => {
           this.student = student;
           this.getSituation();
        }
      );
  }

  private getSituation(): void {
    this.situationService.getSituationByStudent(
      this.student!.id,
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

    return (averageScores.reduce(
        (partialSum, averageScore) => averageScore != null ? partialSum! + averageScore : partialSum
    )! / averageScoresLenght).toFixed(2);
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

  public updateNonAttendanceMotivatedStatus(id: number, statusBefore: boolean): void {
    let text: string = 'motivate';
    if (statusBefore === true) {
      text = 'unmotivate';
    }

    if (confirm('Are you sure you want to ' + text + ' the selected non-attendance?')) {
      this.situationService.updateNonAttendanceMotivatedStatus(id, !statusBefore)
        .subscribe(
          () => this.situation!.data.forEach(situation => {
            situation.nonAttendances.forEach(nonAttendance => {
              if (nonAttendance.id === id) {
                nonAttendance.motivated = !statusBefore;
                this.totalUnmotivatedNonAttendances = this.countTotalUnmotivatedNonAttendances();
                return;
              }
            })
          })
        );
    }
  }

  public hasMotivateNonAttendanceAccess(): boolean {
    return this.sessionService.hasRoleDirector() ||
      this.sessionService.hasRoleClassMaster() ||
      this.sessionService.hasRoleTeacher();
  }

  public downloadSituationPdfFile(): void {
    // (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    // const htmlToText = require('html-to-text');

    // this.situationService.downloadGradesSituationPdfByStudent(this.student!.id).subscribe(
    //   html => pdfMake.createPdf({
    //     content: [
    //       {
    //         text: htmlToText.fromString(html, { wordwrap: 130 }),
    //         style: '.table { border: 1px solid black }'
    //       }
    //     ]
    //   }).download()
    // );

    var doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(18);
    doc.text('Grades Situation', pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(11);
    doc.text('Student: ' + this.student!.firstName + ' ' + this.student!.lastName, 20, 30);
    doc.text('PIN: ' + this.student!.pin, 20, 40);
    doc.text('Date: ' + new Date().toLocaleDateString(), 20, 50);

    doc.setTextColor(100);

    let headers = [['Subject', 'Grades', 'Average Score']]; 
    let body: string[][] = [];
    this.situation!.data.forEach(sit => {
      let bodyRow = [sit.subject.name];

      let grades = '';
      sit.grades.forEach(grade => {
        grades = grades.concat(grade.grade + '\t');
      });
      bodyRow.push(grades);

      bodyRow.push(sit.averageScore != null ? sit.averageScore.toString() : '');

      body.push(bodyRow);
    });

    (doc as any).autoTable({
      head: headers,
      body: body,
      theme: 'grid',
      startY: 70,
      startX: 20
    })

    doc.text('Average Score: ' + this.totalAverageScore, 20, (doc as any).lastAutoTable.finalY + 10);

    doc.output('dataurlnewwindow')

    doc.save('table.pdf');
  }

}
