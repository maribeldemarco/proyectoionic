import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Image {
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

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
    
  ) { }

  ngOnInit(): void {
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
      },
      error => {
        console.error('Error fetching images:', error);
      }
    );
  }

  onSearchChange(event: any) {
    this.images = [];
    this.page_num = 1;
    this.loadImages();
  }

  loadMore() {
    this.page_num++;
    this.loadImages();
  }

}
