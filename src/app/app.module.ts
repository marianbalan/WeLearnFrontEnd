import { NetworkInterceptor } from './http-interceptors/network.interceptor';
import { RoleAuthGuard } from './authentication-guard/role-authentication-guard';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container/sidebar-container.component';
import { SidebarElementComponent } from './sidebar/sidebar-element/sidebar-element.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainDirectorComponent } from './main-director/main-director.component';
import { StudyGroupComponent } from './study-group/study-group.component';
import { AuthenticationGuard } from './authentication-guard/authentication-guard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubjectComponent } from './subject/subject.component';
import { StudentsComponent } from './students/students.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SituationComponent } from './situation/situation.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { HomeComponent } from './home/home.component';
import { SubjectSituationComponent } from './subject-situation/subject-situation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AssignmentsComponent } from './assignments/assignments.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RegisterConfirmationComponent } from './register-confirmation/register-confirmation.component';

@NgModule({
  declarations: [																
    AppComponent,
    RegisterComponent,
    SidebarElementComponent,
    SidebarContainerComponent,
    NavbarComponent,
    LayoutComponent,
    LoginComponent,
    MainDirectorComponent,
    StudyGroupComponent,
    SubjectComponent,
    StudentsComponent,
    SituationComponent,
    ActivateAccountComponent,
    SetPasswordComponent,
    HomeComponent,
    SubjectSituationComponent,
    AssignmentsComponent,
      RegisterConfirmationComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    AuthenticationGuard,
    RoleAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
