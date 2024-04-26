import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { RouteReuseStrategy } from '@angular/router';
import { RegistrousuarioPageModule } from './registrousuario/registrousuario.module';
import { LoginPageModule } from './login/login.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ImageModalModule } from './image-modal/image-modal.module'; 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { ResetpasswordPageModule } from './resetpassword/resetpassword.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    HttpClientModule,
    IonicModule.forRoot(), 
    RegistrousuarioPageModule,
    LoginPageModule,
    ResetpasswordPageModule,
    AngularFirestoreModule,
    ImageModalModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),     
    AppRoutingModule, provideFirebaseApp(() => initializeApp({"projectId":"tpdesarrollomovil","appId":"1:617749772734:web:34f020b308602e453e21ef","storageBucket":"tpdesarrollomovil.appspot.com","apiKey":"AIzaSyCvzX08UW34Qj5IZ36CleaOCj80F92pzGw","authDomain":"tpdesarrollomovil.firebaseapp.com","messagingSenderId":"617749772734"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {} 
