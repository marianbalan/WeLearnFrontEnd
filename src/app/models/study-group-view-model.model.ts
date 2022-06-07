import { IUserViewModel } from './user-view-model.model';

export interface IStudyGroupViewModel {
    id: number,
    number: number,
    name: string,
    specialization: string,
    classMaster: IUserViewModel
}