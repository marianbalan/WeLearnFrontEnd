import { ISubjectViewModel } from './subject-view-model.model';

export interface IGradeViewModel {
    id: number,
    grade: number,
    date: number,
    subject: ISubjectViewModel
}
