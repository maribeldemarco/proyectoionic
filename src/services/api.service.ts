import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apikey = "R92mAvgFs3ezQwGZhyvvEatUgxxpSjz15q97jbfhMmidxRTx7K49OZNf";

  constructor() { }

  // Fetch con la api de imágenes pexels
  async loadImages(searchText: string, page: number, perPage: number): Promise<any> {
    let url = `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
    if (searchText) {
      url = `https://api.pexels.com/v1/search?query=${searchText}&page=${page}&per_page=${perPage}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': this.apikey
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }
}
