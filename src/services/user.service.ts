import { Injectable } from "@angular/core";
import { Image } from '../app/home/home.page';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
        });
    }

    get favoritesChanged() {
        return this.favoritesSubject.asObservable();
    }

    getUserId(): string | null {
        return this.userId;
    }

    setFavorites(favorites: Image[]) {
        this.favorites = favorites;
        this.favoritesSubject.next(favorites);
    }

    register({ email, password }: any) {
        return createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            // Una vez que el usuario se registra, crea el documento del usuario en Firestore
            const userId = userCredential.user.uid;
            return this.createUserDocument(userId);
        });
    }
  
    loginWithGoogle() {
        return signInWithPopup(this.auth, new GoogleAuthProvider())
        .then(async (userCredential) => {
            // Una vez que el usuario inicia sesión con Google, verifica si es la primera vez que se registra
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

    logout() {
        return signOut(this.auth);
    }

    resetPassword(email:string){
        return sendPasswordResetEmail(this.auth, email)
    }

    // Guarda los favoritos en la base de datos
    async synchronizeFavoritesWithDatabase() {
        const userId = this.getUserId();
        if (!userId) return;

        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
            favorites: this.favorites
        });
    }

    // Inicializa los favoritos desde la base de datos
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

    // Crea el documento del usuario en Firestore
    private createUserDocument(userId: string) {
        const userDoc = this.firestore.doc(`users/${userId}`);
        return userDoc.set({
            favorites: []
        });
    }
}