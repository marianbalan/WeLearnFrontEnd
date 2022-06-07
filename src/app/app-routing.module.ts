import { RegisterConfirmationComponent } from './register-confirmation/register-confirmation.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { HomeComponent } from './home/home.component';
import { Role } from './models/user-role.model';
import { RoleAuthGuard } from './authentication-guard/role-authentication-guard';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { SituationComponent } from './situation/situation.component';
import { StudentsComponent } from './students/students.component';
import { SubjectComponent } from './subject/subject.component';
import { AuthenticationGuard } from './authentication-guard/authentication-guard';
import { StudyGroupComponent } from './study-group/study-group.component';
import { MainDirectorComponent } from './main-director/main-director.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectSituationComponent } from './subject-situation/subject-situation.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'registration-confirmation',
    component: RegisterConfirmationComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.User ]}
  },
  {
    path: 'teachers',
    component: MainDirectorComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [Role.Director] }
  },
  {
    path: 'study-groups',
    component: StudyGroupComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.Director ]}
  },
  {
    path: 'subjects',
    component: SubjectComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.Director, Role.Teacher ]}
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.Director, Role.ClassMaster ]}
  },
  {
    path: 'students/:id/situation',
    component: SituationComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.Director, Role.ClassMaster, Role.Student ]}
  },
  {
    path: 'subjects/:id/situation',
    component: SubjectSituationComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.Director, Role.Teacher ]}
  },
  {
    path: 'activate-account/:token',
    component: ActivateAccountComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'set-password/:token',
    component: SetPasswordComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'assignments',
    component: AssignmentsComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: [ Role.Teacher, Role.Student ]}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
