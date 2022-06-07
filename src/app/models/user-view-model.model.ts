import { IStudyGroupViewModel } from './study-group-view-model.model';
export interface IUserViewModel {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    pin: string,
    phoneNumber: string,
    activated: string,
    studyGroup?: IStudyGroupViewModel 
}