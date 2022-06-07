import { IAssignmentResponseViewModel } from './assignment-response-view-model.model';
import { ISubjectViewModel } from './subject-view-model.model';
export interface IAssignmentViewModel {
    id: number,
    title: string,
    description?: string,
    date: number,
    dueTo: number,
    subject: ISubjectViewModel,
    requirementFilePath?: string,
    closed: boolean,
    responses: IAssignmentResponseViewModel[]
}