import { Injectable } from "@angular/core";
import { Image } from '../app/home/home.page';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, sendEmailVerification } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userId: string | null = null;
    private favorites: Image[] = [];
    private favoritesSubject = new BehaviorSubject<Image[]>([]);
    
    constructor(private auth: Auth, private firestore: AngularFirestore) { 
        this.auth.onAuthStateChanged(user => {
            this.userId = user ? user.uid : null;
            if (this.userId) {
                this.loadFavorites();
            }
        });
    }

    getUserId(): string | null {
        return this.userId;
    }

    getFavorites(): Image[] {
        return this.favorites;
    }

    get favoritesChanged() {
        return this.favoritesSubject.asObservable();
    }

    register({ email, password }: any) {
        return createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            // Una vez que el usuario se ha registrado con éxito, crea el documento del usuario en Firestore
            const userId = userCredential.user.uid;
            return this.createUserDocument(userId);
        });
    }
  

    loginWithGoogle() {
        return signInWithPopup(this.auth, new GoogleAuthProvider())
        .then(async (userCredential) => {
            // Una vez que el usuario ha iniciado sesión con éxito con Google, verifica si es la primera vez que se registra
            const userId = userCredential.user.uid;
            const userDoc = this.firestore.doc(`users/${userId}`);
            const snapshot = await firstValueFrom(userDoc.get());
            if (snapshot.exists) {
                // Si el documento del usuario ya existe, carga los favoritos
                await this.initFavoritesFromDatabase();
            } else {
                // Si es la primera vez que se registra, crea el documento del usuario en Firestore
                await this.createUserDocument(userId);
            }
        });
    }
    

    

    async login({ email, password }: any) {
        const loginResult = await signInWithEmailAndPassword(this.auth, email, password);
        await this.initFavoritesFromDatabase(); // Cargar los favoritos al iniciar sesión
        return loginResult;
    }

    async logout() {
        await this.synchronizeFavoritesWithDatabase(); // Actualizar los favoritos en la base de datos al cerrar sesión
        return signOut(this.auth);
    }

    resetPassword(email:string){
        return sendPasswordResetEmail(this.auth, email)
    }

    async synchronizeFavoritesWithDatabase() {
        const userId = this.getUserId();
        if (!userId) return;

        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
            favorites: this.favorites
        });
    }

    async initFavoritesFromDatabase() {
        const userId = this.getUserId();
        if (!userId) return;

        const userDoc = this.firestore.doc(`users/${userId}`);
        const snapshot = await firstValueFrom(userDoc.get());
        const userData = snapshot.data() as { favorites?: Image[] };
        const favorites = userData?.favorites || [];
        this.favorites = favorites;
        this.favoritesSubject.next(favorites);
    }

    async addFavorite(favorite: Image) {
        const userId = this.getUserId();
        if (!userId) return;
    
        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
          favorites: firebase.firestore.FieldValue.arrayUnion(favorite)
        });
        // Actualizar la lista de favoritos y emitir el cambio
        this.loadFavorites();
    }

    async removeFavorite(favorite: Image) {
        const userId = this.getUserId();
        if (!userId) return;
    
        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
          favorites: firebase.firestore.FieldValue.arrayRemove(favorite)
        });
        // Actualizar la lista de favoritos y emitir el cambio
        this.loadFavorites();
    }

    private async loadFavorites() {
        const userId = this.getUserId();
        if (!userId) return;
    
        const userDoc = this.firestore.doc(`users/${userId}`);
        const snapshot = await firstValueFrom(userDoc.get());
        const userData = snapshot.data() as { favorites?: Image[] };
        const favorites = userData?.favorites || [];
        this.favoritesSubject.next(favorites);
    }  

    setFavorites(favorites: Image[]) {
        this.favorites = favorites;
        this.favoritesSubject.next(favorites);
    }

    private createUserDocument(userId: string) {
        const userDoc = this.firestore.doc(`users/${userId}`);
        return userDoc.set({
            favorites: []
        });
    }
}