import { IStudyGroupViewModel } from 'src/app/models/study-group-view-model.model';
import { IUserViewModel } from 'src/app/models/user-view-model.model';

export interface ISubjectViewModel {
    id: number,
    name: string,
    teacher: IUserViewModel,
    studyGroup: IStudyGroupViewModel
}
