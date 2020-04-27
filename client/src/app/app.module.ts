import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { QuestionsComponent } from './questions/questions.component';
import { CreateQuestionComponent } from './create_questions/create_question.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreateReplyComponent } from './create_reply/create_reply.compontent';

@NgModule({
  declarations: [
    AppComponent, QuestionsComponent, CreateQuestionComponent, RegisterComponent, LoginComponent, CreateReplyComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
