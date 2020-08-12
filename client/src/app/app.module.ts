import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { CoursesComponent } from './courses/courses.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionComponent } from './question/question.component';
import { CreateQuestionComponent } from './create_question/create_question.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreateReplyComponent } from './create_reply/create_reply.component';
import { AdminComponent } from './admin/admin.component'
import { RouteEventsService } from './route-events.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModal } from './delete_modal/delete_modal.component';
import { EditModal } from './edit_modal/edit_modal.component';
import { AuthService } from './AuthService';



@NgModule({
  declarations: [
    AppComponent, CoursesComponent, QuestionComponent, QuestionsComponent, CreateQuestionComponent, RegisterComponent, LoginComponent, CreateReplyComponent, AdminComponent, DeleteModal, EditModal
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, routing, BrowserAnimationsModule, NgbModule
  ],
  entryComponents: [ DeleteModal, EditModal ],
  providers: [RouteEventsService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
