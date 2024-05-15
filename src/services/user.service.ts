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
    private images: Image[] = [];
    private imagesSubject = new BehaviorSubject<Image[]>([]);
    
    constructor(private auth: Auth, private firestore: AngularFirestore) { 
        this.auth.onAuthStateChanged(user => {
            this.userId = user ? user.uid : null;
            if (this.userId) {
                this.loadImagesFromDatabase(); // Cargar imágenes al cambiar el estado de autenticación
            } else {
                this.images = []; // Limpiar imágenes si el usuario cierra sesión
                this.imagesSubject.next([]); // Notificar a los suscriptores que las imágenes se han limpiado
            }
        });
    }

    get favoritesChanged() {
        return this.favoritesSubject.asObservable();
    }

    get imagesChanged() {
        return this.imagesSubject.asObservable();
    }

    getUserId(): string | null {
        return this.userId;
    }

    setFavorites(favorites: Image[]) {
        this.favorites = favorites;
        this.favoritesSubject.next(favorites);
    }

    saveImage(image: Image) {
        this.images.push(image);
        this.imagesSubject.next(this.images.slice());
        this.synchronizeImagesWithDatabase(); // Guardar imágenes en la base de datos
    }

    register({ email, password }: any) {
        return createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            return this.createUserDocument(userId);
        });
    }
  
    loginWithGoogle() {
        return signInWithPopup(this.auth, new GoogleAuthProvider())
        .then(async (userCredential) => {
            const userId = userCredential.user.uid;
            const userDoc = this.firestore.doc(`users/${userId}`);
            const snapshot = await firstValueFrom(userDoc.get());
            if (snapshot.exists) {
                await this.initFavoritesAndImagesFromDatabase();
            } else {
                await this.createUserDocument(userId);
            }
        });
    }  

    async login({ email, password }: any) {
        const loginResult = await signInWithEmailAndPassword(this.auth, email, password);
        await this.initFavoritesAndImagesFromDatabase();
        return loginResult;
    }

    logout() {
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

    async synchronizeImagesWithDatabase() {
        const userId = this.getUserId();
        if (!userId) return;

        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
            images: this.images
        });
    }

    async initFavoritesAndImagesFromDatabase() {
        await this.loadImagesFromDatabase();
        await this.initFavoritesFromDatabase();
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

    async loadImagesFromDatabase() {
        const userId = this.getUserId();
        if (!userId) return;

        const userDoc = this.firestore.doc(`users/${userId}`);
        const snapshot = await firstValueFrom(userDoc.get());
        const userData = snapshot.data() as { images?: Image[] };
        const images = userData?.images || [];
        this.images = images;
        this.imagesSubject.next(images);
    }

    private createUserDocument(userId: string) {
        const userDoc = this.firestore.doc(`users/${userId}`);
        return userDoc.set({
            favorites: [],
            images: []
        });
    }
}
