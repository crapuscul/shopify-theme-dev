if (!customElements.get('media-gallery')) {
  customElements.define(
    'media-gallery',
    class MediaGallery extends HTMLElement {
      constructor() {
        super();
        this.elements = {
          liveRegion: this.querySelector('[id^="GalleryStatus"]'),
          viewer: this.querySelector('[id^="GalleryViewer"]'),
          thumbnails: this.querySelector('[id^="GalleryThumbnails"]'),
          prevButton: this.querySelector('.slider-button--prev'),
          nextButton: this.querySelector('.slider-button--next'),
        };
        this.mql = window.matchMedia('(min-width: 750px)');
        
        if (!this.elements.thumbnails || !this.elements.viewer) return;

        // Debugging log for button setup
        console.log('Setting up button listeners');

        // Add event listeners to slider buttons
        if (this.elements.prevButton) {
          this.elements.prevButton.addEventListener('click', () => {
            console.log('Prev button clicked');
            this.moveSlide(-1);
          });
        }
        if (this.elements.nextButton) {
          this.elements.nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            this.moveSlide(1);
          });
        }

        this.elements.viewer.addEventListener('slideChanged', debounce(this.onSlideChanged.bind(this), 500));
        this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
          mediaToSwitch
            .querySelector('button')
            .addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false));
        });

        if (this.dataset.desktopLayout.includes('thumbnail') && this.mql.matches) this.removeListSemantic();
      }

      onSlideChanged(event) {
        console.log('Slide changed:', event.detail.currentElement.dataset.mediaId);
        const thumbnail = this.elements.thumbnails.querySelector(
          `[data-target="${event.detail.currentElement.dataset.mediaId}"]`
        );
        this.setActiveThumbnail(thumbnail);
      }

      setActiveMedia(mediaId, prepend) {
        console.log('Setting active media:', mediaId);
        const activeMedia =
          this.elements.viewer.querySelector(`[data-media-id="${mediaId}"]`) ||
          this.elements.viewer.querySelector('[data-media-id]');
        if (!activeMedia) {
          console.warn('No active media found for mediaId:', mediaId);
          return;
        }

        this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
          element.classList.remove('is-active');
        });
        activeMedia.classList.add('is-active');

        if (prepend) {
          activeMedia.parentElement.prepend(activeMedia);

          if (this.elements.thumbnails) {
            const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
            if (activeThumbnail) {
              activeThumbnail.parentElement.prepend(activeThumbnail);
            }
          }

          if (this.elements.viewer.slider) this.elements.viewer.slider.resetPages();
        }

        this.preventStickyHeader();
        window.setTimeout(() => {
          // Removed scroll-to functionality for image slider
        });

        this.playActiveMedia(activeMedia);

        if (this.elements.thumbnails) {
          const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
          if (activeThumbnail) {
            this.setActiveThumbnail(activeThumbnail);
            this.announceLiveRegion(activeMedia, activeThumbnail.dataset.mediaPosition);
          }
        }
      }

      setActiveThumbnail(thumbnail) {
        if (!this.elements.thumbnails || !thumbnail) return;

        this.elements.thumbnails
          .querySelectorAll('button')
          .forEach((element) => element.removeAttribute('aria-current')); 
        thumbnail.querySelector('button').setAttribute('aria-current', true);
        if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

        this.elements.thumbnails.slider.scrollTo({ left: thumbnail.offsetLeft });
      }

      announceLiveRegion(activeItem, position) {
        const image = activeItem.querySelector('.product__modal-opener--image img');
        if (!image) return;
        image.onload = () => {
          this.elements.liveRegion.setAttribute('aria-hidden', false);
          this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace('[index]', position);
          setTimeout(() => {
            this.elements.liveRegion.setAttribute('aria-hidden', true);
          }, 2000);
        };
        image.src = image.src;
      }

      playActiveMedia(activeItem) {
        window.pauseAllMedia();
        const deferredMedia = activeItem.querySelector('.deferred-media');
        if (deferredMedia) deferredMedia.loadContent(false);
      }

      preventStickyHeader() {
        this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
        if (!this.stickyHeader) return;
        this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
      }

      removeListSemantic() {
        if (!this.elements.viewer.slider) return;
        this.elements.viewer.slider.setAttribute('role', 'presentation');
        this.elements.viewer.sliderItems.forEach((slide) => slide.setAttribute('role', 'presentation'));
      }

      moveSlide(direction) {
        console.log('Moving slide:', direction);
        const currentSlide = this.elements.viewer.querySelector('.is-active');
        const slides = Array.from(this.elements.viewer.querySelectorAll('[data-media-id]'));
        const currentIndex = slides.indexOf(currentSlide);
        const nextIndex = (currentIndex + direction + slides.length) % slides.length;
        const nextSlide = slides[nextIndex];

        if (nextSlide) {
          this.setActiveMedia(nextSlide.dataset.mediaId, false);
        } else {
          console.warn('No next slide found');
        }
      }
    }
  );
}
