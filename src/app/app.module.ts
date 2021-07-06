import { UserModule } from './user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { MessagingService } from './service/messaging.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { NavComponent } from './block/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './block/footer/footer.component';
import { CreateCausesComponent } from './pages/causes/create-causes/create-causes.component';
import { DefaultLayoutComponent } from './block/default-layout/default-layout.component';
import { CausesComponent } from './pages/causes/causes/causes.component';
import { Package1DetailComponent } from './pages/causes/package1-detail/package1-detail.component';
import { NewsComponent } from './pages/news/news/news.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail.component';
import { authInterceptorProviders } from './auth.interceptor';
import { Package2DetailComponent } from './pages/causes/package2-detail/package2-detail.component';
import { CausesDetailComponent } from './pages/causes/causes-detail/causes-detail.component';
import { AngularFireStorageModule ,AngularFireStorage} from '@angular/fire/storage'
import {AngularFireModule} from '@angular/fire';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { GoogleLoginProvider,AuthServiceConfig, FacebookLoginProvider, SocialLoginModule } from "angular4-social-login";
import { FacebookModule } from 'ng2-facebook-sdk';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AsyncPipe } from '@angular/common';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireAuthModule, AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreModule,AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { FcmPushService } from './service/fcm-push.service';
import { ChatService } from './service/chat.service';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
let configs = new AuthServiceConfig([
  // {
  //   id: GoogleLoginProvider.PROVIDER_ID,
  //   provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
  // },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("1567123180016188")
  }
]);
export function provideConfig(){
  // return configs
}
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    FooterComponent,
    CreateCausesComponent,
    DefaultLayoutComponent,
    Package1DetailComponent,
    CausesComponent,
    NewsComponent,
    NewsDetailComponent,
    Package2DetailComponent,
    CausesDetailComponent,



  ],
  imports: [
    BrowserModule,
    AdminModule,
    UserModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    Ng2OrderModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireMessagingModule,
    ChatModule,
    // SocketIoModule.forRoot(config),

    SocialLoginModule.initialize(configs),
    FacebookModule.forRoot(),

    AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireAuthModule,
      AngularFireDatabaseModule,

    ToastrModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,

  ],
  providers: [
    {provide:authInterceptorProviders,
      useFactory:provideConfig},
      MessagingService,AsyncPipe,
      AngularFirestore,
      AngularFireStorage,
      FcmPushService,
      AngularFireAuth,
      ChatService
    ],

  bootstrap: [AppComponent],
})
export class AppModule { }

// {
//   apiKey: "AIzaSyBpIOS3f66VUT5obTFPS7kx19AoECVd3JA",
//   authDomain: "webtuthien.firebaseapp.com",
//   projectId: "webtuthien",
//   storageBucket: "webtuthien.appspot.com",
//   messagingSenderId: "102889078940",
//   appId: "1:102889078940:web:77826010eb1b66d0db6d59",
//   measurementId: "G-16R93YQK98"
//   }
