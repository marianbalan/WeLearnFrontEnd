import { ISubjectViewModel } from "./subject-view-model.model";

export interface INonAttendanceViewModel {
    id: number,
    motivated: boolean,
    date: number,
    subject: ISubjectViewModel
}