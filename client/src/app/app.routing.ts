import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { CreateQuestionComponent } from './create_questions/create_question.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreateReplyComponent } from './create_reply/create_reply.compontent';

const appRoutes: Routes = [
    { path: '', component: QuestionsComponent},
    { path: 'create_question', component: CreateQuestionComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'logout', redirectTo: '/', pathMatch: 'full' },
    { path: 'create_reply/:id', component: CreateReplyComponent},
    { path: 'delete_reply/:id', redirectTo: '/', pathMatch: 'full'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);