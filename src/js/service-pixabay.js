import axios from 'axios';

const API_KEY = '29140475-66441d6b682f1f986b480bf70';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1
  }
  
  async fetchPhotoCards() {    
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    })
      .toString();

    const url = `${BASE_URL}?${searchParams}`;    
    const newGallery = await axios.get(url)
      .then(({ data }) => {
        this.page += 1;
        return data;
      });
          
    return newGallery;      
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}