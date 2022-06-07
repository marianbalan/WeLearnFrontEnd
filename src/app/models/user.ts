export interface IUser {
    id?: number,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    pin: string,
    phoneNumber: string,
    roles: Array<string>,
    studyGroupId?: number
}