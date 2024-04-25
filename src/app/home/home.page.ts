import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { Subscription } from 'rxjs';

export interface Image {
  src: { large: string };
  photographer: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  apikey = "R92mAvgFs3ezQwGZhyvvEatUgxxpSjz15q97jbfhMmidxRTx7K49OZNf";
  searchText: string = "";
  images: Image[] = [];
  page_num: number = 1;
  per_page: number = 14;
  search: boolean = false;
  loading: boolean = true;
  fav: Image[] = []; 
  favImages:boolean=false;
  defaultImages:boolean=true;
  busqueda:boolean = true;
  favoritos: boolean=false;
  buscar: boolean= true;

  private favoritesSubscription: Subscription | null = null;

  
  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController
  ) {
      this.favoritesSubscription = this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
      this.fav = favorites;
    });
  }

  ngOnDestroy(): void {
    //  desuscribirse para evitar pérdidas de memoria
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }


  
  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  ionViewDidEnter() {
   this.loadImages();
  }

  loadImages() {
    let url = `https://api.pexels.com/v1/curated?page=${this.page_num}&per_page=${this.per_page}`;
    if (this.searchText) {
      //this.search = true;
      url = `https://api.pexels.com/v1/search?query=${this.searchText}&page=${this.page_num}&per_page=${this.per_page}`;
    }
    const headers = new HttpHeaders({
      'Authorization': this.apikey
    });
    this.http.get<any>(url, { headers }).subscribe(
      response => {
        this.images = this.images.concat(response.photos);
        this.loading = false;
      },
      error => {
        console.error('Error fetching images:', error);
      }
    );
  }

  onSearchChange(event: any) {
    this.images = [];
    this.page_num = 1;
    this.loading = true;
    this.loadImages();
  }

  loadMore() {
    this.page_num++;
    this.loadImages();
  }

  isFavorite(image: Image): boolean {
    return this.fav.some((favImage: Image) => favImage.src.large === image.src.large);
  }

  // Es un doble proceso. No se se habría que cambiar
  async onImageClick(image: Image) {  
    const userId = this.userService.getUserId;
    if (userId !== null) {
      if (!this.isFavorite(image)) {
        this.userService.addFavorite(image);
      } else {
        this.userService.removeFavorite(image);
      }  
    } else {
        console.error('No se puede agregar favorito: no hay usuario autenticado.');
    }
  }

  verFav() {
    this.favImages = !this.favImages;
    this.defaultImages = !this.defaultImages;
    this.busqueda = !this.busqueda;
    this.favoritos = !this.favoritos;
    this.buscar = !this.buscar;

    if (!this.favImages) {
      this.loadImages();
    }
  }

  async openImageModal(imageUrl: string, photographer: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        image: { src: { large: imageUrl }, photographer: photographer }, 
        
      }
    });
    return await modal.present();
  }
  
  onCorazon(image:Image){
    this.onImageClick(image)
  }


}
