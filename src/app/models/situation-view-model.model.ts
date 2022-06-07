import { ISubjectViewModel } from './subject-view-model.model';
import { IGradeViewModel } from './grade-view-model.model';
import { INonAttendanceViewModel } from './non-attendance-view-model.model';

export interface IStuationViewModel {
    subject: ISubjectViewModel,
    grades: IGradeViewModel[],
    nonAttendances: INonAttendanceViewModel[],
    averageScore?: number
}