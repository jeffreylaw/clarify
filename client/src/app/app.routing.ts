import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionComponent } from './question/question.component';
import { CreateQuestionComponent } from './create_question/create_question.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreateReplyComponent } from './create_reply/create_reply.component';
import { AdminComponent } from './admin/admin.component'

const appRoutes: Routes = [
    { path: '', component: CoursesComponent },
    { path: 'courses/:id', component: QuestionsComponent },
    { path: 'courses/question/:id', component: QuestionComponent },
    { path: 'create_question', component: CreateQuestionComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', redirectTo: '/', pathMatch: 'full' },
    { path: 'create_reply/:id', component: CreateReplyComponent },
    { path: 'delete_reply/:id', redirectTo: '/', pathMatch: 'full' },
    { path: 'admin', component: AdminComponent },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);