import { IUserViewModel } from 'src/app/models/user-view-model.model';
import { IGradeViewModel } from './grade-view-model.model';
import { INonAttendanceViewModel } from './non-attendance-view-model.model';

export interface ISubjectStuationViewModel {
    user: IUserViewModel,
    grades: IGradeViewModel[],
    nonAttendances: INonAttendanceViewModel[],
    averageScore?: number
}