export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1
  }
  
  fetchPhotoCards() {    
    const searchParams = new URLSearchParams({
      key: '29140475-66441d6b682f1f986b480bf70',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    }).toString();

    const url = `https://pixabay.com/api/?${searchParams}`;
    
    fetch(`${url}`)
      .then(responce => responce.json())
      .then(data => {
        this.page += 1;
      });
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