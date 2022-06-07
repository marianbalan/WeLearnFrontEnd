import { IUserViewModel } from 'src/app/models/user-view-model.model';

export interface IAssignmentResponseViewModel {
    id: number,
    date: number,
    assignmentId: number,
    student: IUserViewModel,
    filePath?: string
}