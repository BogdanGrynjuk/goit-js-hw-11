import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayApiService from './js/service-pixabay';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more')
};

const pixabayApiService = new PixabayApiService();
const lightbox = new SimpleLightbox('.gallery a', {    
  captionDelay: 250
});

let counterOfPhoto = 0;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onGalleryClick);

hideBtn();

async function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.searchQuery.value.trim();

  if (pixabayApiService.query === '') {   
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');        
    return;
  }

  showBtn();
  disableBtn();
  clearGallery();
  pixabayApiService.resetPage();
  
  try {
    const responce = await pixabayApiService.fetchPhotoCards()
      .then(createNewGallery)    
  } catch (error) {
    console.log(error);
  }  
}

async function onLoadMore() {
  
  disableBtn();
  try {
    const responce = await pixabayApiService.fetchPhotoCards()
      .then(updateGallery)
      .then(smoothScrolling);
  } catch (error) {
    console.log(error);
  }
  
}

function createNewGallery(dataFromBackend) { 
      
    counterOfPhoto = 0;

    if (dataFromBackend.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      hideBtn();
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${dataFromBackend.totalHits} images.`);
    
    counterOfPhoto += dataFromBackend.hits.length;

    appendPhotoCardsMarkup(dataFromBackend.hits);
    enableBtn();
    lightbox.refresh();  
}

function updateGallery(dataFromBackend) {

  counterOfPhoto += dataFromBackend.hits.length;

  if (counterOfPhoto >= dataFromBackend.totalHits) {
    Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
    smoothScrolling();
    setTimeout(hideBtn, 0);            
  }
    
  appendPhotoCardsMarkup(dataFromBackend.hits);
  enableBtn();
  lightbox.refresh();
}

function appendPhotoCardsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createPhotoCardsMarkup(hits));
}

function createPhotoCardsMarkup(hits) {
  return hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
      <a href="${largeImageURL}">        
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b><br>${likes}</p>
            <p class="info-item">
              <b>Views</b><br>${views}
            </p>
            <p class="info-item">
              <b>Comments</b><br>${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b><br>${downloads}
            </p>
          </div>
        </div>
      </a>`
    })
    .join('');
}

function clearGallery () {
  refs.gallery.innerHTML = '';
}

function showBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function enableBtn() {
  refs.loadMoreBtn.disabled = false;
  refs.loadMoreBtn.textContent = 'Load more';
}

function disableBtn() {
  refs.loadMoreBtn.disabled = true;
  refs.loadMoreBtn.textContent = 'Loading...';
}

function onGalleryClick(event) {
  event.preventDefault();
}

function smoothScrolling() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 3,
  behavior: "smooth",
});
}