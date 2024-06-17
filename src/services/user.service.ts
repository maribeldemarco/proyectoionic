import { Injectable } from "@angular/core";
import { Image } from '../app/home/home.page';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

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
                this.loadImagesFromDatabase(); // Cargar imágenes desde la base de datos al cambiar el estado de autenticación
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

    /**
    * @function getUserId
    * @descripción la función devuelve el uid del usuario. (Si el usuario esta logueado el valor es el uid del usuario, si no, es null)
    * @return {string | null} devuelves el valor de la variable userId o null
    */ 
    getUserId(): string | null {
        return this.userId;
    }

    /**
    * @function setFavorites
    * @descripción recibe los valores de favoritos cuando se modifican por el usuario y los modifica en el array favorites del servicio, ademas emite la lista a los suscriptores para informar de los cambios
    * @param {Image[]} favorites
    */ 
    setFavorites(favorites: Image[]) {
        this.favorites = favorites;
        this.favoritesSubject.next(favorites);
    }

    /**
    * @function saveImage
    * @descripción guarda la imagen que recibe por parametro en el array de imagenes y emite la lista actualizada a los suscriptores para informar de los cambios. Luego llama a la función synchronizeImagesWithDatabase() para guardar la lista imagenes  en la base de datos
    * @param {Image[]} image
    */ 
    saveImage(image: Image) {
        this.images.push(image);
        this.imagesSubject.next(this.images.slice());
        this.synchronizeImagesWithDatabase(); 
    }

    /**
    * @function register
    * @descripción  Llama a la funcion createUserWithEmailAndPassword para registrar un nuevo usuario. Si es exitoso, llama a la función createUserDocument para crear un nuevo documento del usuario en la base de datos.
    * @param {any} email mail de usuario a crear
    * @param {any} password contrasena de usuario   
    */ 
    register({ email, password }: any) {
        return createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            return this.createUserDocument(userId);
        });
    }
    
    /**
    * @function login
    * @descripción La función llama a la función signInWhithEmailAndPassword de Firebase para iniciar sesión con con usuario y contraseña. 
    */ 
    async login({ email, password }: any) {
        const loginResult = await signInWithEmailAndPassword(this.auth, email, password);
        await this.initFavoritesAndImagesFromDatabase();
        return loginResult;
    }

    /**
    * @function logout
    * @descripción La función cierra la sesión activa. Llama a la función signOut de Firebase. 
    */ 
    logout() {
        return signOut(this.auth);
    }

    /**
    * @function resetPassword
    * @descripción La función envía un correo electronico para restablecer la contraseña. Llama a la función sendPasswordResetEmail de Firebase. 
    */ 
    resetPassword(email:string){
        return sendPasswordResetEmail(this.auth, email)
    }

    /**
    * @function synchronizeFavoritesWithDatabase
    * @descripción La función actualiza el array de favoritos en la base de datos. Obtiene el usuario y actualiza su lista de favoritos en Firestore. 
    */ 
    async synchronizeFavoritesWithDatabase() {
        const userId = this.getUserId();
        if (!userId) return;

        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
            favorites: this.favorites
        });
    }

    /**
    * @function synchronizeImagesWithDatabase
    * @descripción La función actualiza el array de imagenes en la base de datos. Obtiene el usuario y actualiza su lista de imagenes en Firestore. 
    */ 
    async synchronizeImagesWithDatabase() {
        const userId = this.getUserId();
        if (!userId) return;
        const userDoc = this.firestore.doc(`users/${userId}`);
        await userDoc.update({
            images: this.images
        });
    }

    /**
    * @function initFavoritesAndImagesFromDatabase
    * @descripción La función llama a las funciones loadImagesFromDatabase y initFavoritesFromDatabase para cargar el listado de imagenes y favoritos del usuario cuando este inicia sesión.	
    */ 
    async initFavoritesAndImagesFromDatabase() {
        await this.loadImagesFromDatabase();
        await this.initFavoritesFromDatabase();
    }

    /**
    * @function initFavoritesFromDatabase
    * @descripción La función obtiene el array de favoritos desde la base de datos, lo asigna a la variable favorites y luego lo emite a los subscriptores de la lista.
    */ 
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

    /**
    * @function loadImagesFromDatabase
    * @descripción La función obtiene el array de imagenes desde la base de datos, lo asigna a la variable images y luego lo emite a los subscriptores de la lista.
    */ 
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

    /**
    * @function createUserDocument
    * @descripción La función crea un nuevo documento para guardar las listas de favoritos e imagenes en la base de datos para el usuario.
    * @param {string} userId uid del usuario
    */ 
    private createUserDocument(userId: string) {
        const userDoc = this.firestore.doc(`users/${userId}`);
        return userDoc.set({
            favorites: [],
            images: []
        });
    }

    /**
    * @function deleteImage
    * @descripción La función elimina la imagen seleccionada del array de imagenes, emite el array actualizado y llama a la función synchronizeImagesWithDatabase para actualizar la base de datos.	
    * @return {Image[]}
    */     
    deleteImage(index: number): void {
        this.images.splice(index, 1);
        this.imagesSubject.next(this.images.slice());
        this.synchronizeImagesWithDatabase();
    }
}
