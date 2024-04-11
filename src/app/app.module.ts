import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),     
    AppRoutingModule, provideFirebaseApp(() => initializeApp({"projectId":"tpdesarrollomovil","appId":"1:617749772734:web:34f020b308602e453e21ef","storageBucket":"tpdesarrollomovil.appspot.com","apiKey":"AIzaSyCvzX08UW34Qj5IZ36CleaOCj80F92pzGw","authDomain":"tpdesarrollomovil.firebaseapp.com","messagingSenderId":"617749772734"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
