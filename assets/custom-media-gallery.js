document.addEventListener('DOMContentLoaded', () => {
    // Ensure the page is fully loaded before running the script
  
    const mediaGalleryViewer = document.querySelector('[id^="GalleryViewer"]');
    const thumbnailsContainer = document.querySelector('[id^="GalleryThumbnails"]');
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
  
    // Ensure all key elements are present before adding event listeners
    if (!mediaGalleryViewer || !thumbnailsContainer || !leftArrow || !rightArrow) {
      console.error("One or more key elements (media gallery or thumbnails) are missing");
      return;
    }
  
    // Collect only valid media items from the <li> elements
    const mediaItems = Array.from(mediaGalleryViewer.querySelectorAll('li.product__media-item[data-media-id]'));
  
    const totalItems = mediaItems.length;
  
    if (totalItems === 0) {
      console.error("No valid media items found.");
      return;
    }
  
    // Event listeners for arrow buttons
    leftArrow.addEventListener('click', showPreviousMedia);
    rightArrow.addEventListener('click', showNextMedia);
  
    // Function to show the previous media item (loop to last item if at the first)
    function showPreviousMedia() {
      const currentMedia = mediaGalleryViewer.querySelector('.is-active');
      const currentIndex = mediaItems.indexOf(currentMedia);
      const previousIndex = (currentIndex - 1 + totalItems) % totalItems; // Loop to last if at first
      const previousMedia = mediaItems[previousIndex];
      setActiveMedia(previousMedia);
    }
  
    // Function to show the next media item (loop to first item if at the last)
    function showNextMedia() {
      const currentMedia = mediaGalleryViewer.querySelector('.is-active');
      const currentIndex = mediaItems.indexOf(currentMedia);
      const nextIndex = (currentIndex + 1) % totalItems; // Loop to first if at last
      const nextMedia = mediaItems[nextIndex];
      setActiveMedia(nextMedia);
    }
  
    // Function to update the active media and corresponding thumbnail
    function setActiveMedia(mediaElement) {
      if (!mediaElement || !mediaElement.getAttribute('data-media-id')) {
        console.error("Invalid media element or missing data-media-id.");
        return;
      }
  
      // Remove 'is-active' from all media items
      mediaItems.forEach((element) => {
        element.classList.remove('is-active');
      });
  
      // Add 'is-active' to the new active media item
      mediaElement.classList.add('is-active');
      mediaElement.scrollIntoView({ behavior: 'smooth' }); // Ensure smooth scrolling into view
  
      // Update the corresponding active thumbnail
      const mediaId = mediaElement.getAttribute('data-media-id');
      const activeThumbnail = thumbnailsContainer.querySelector(`[data-target="${mediaId}"]`);
  
      if (!activeThumbnail) {
        console.error(`No corresponding thumbnail found for media ID: ${mediaId}`);
        return;
      }
  
      setActiveThumbnail(activeThumbnail); // Update the thumbnail as well
    }
  
    // Function to update the active thumbnail (same as the media-gallery.js behavior)
    function setActiveThumbnail(thumbnail) {
      if (!thumbnailsContainer || !thumbnail) {
        console.error("Thumbnail or thumbnails container is missing");
        return;
      }
  
      // Remove the `aria-current` attribute from all thumbnails
      thumbnailsContainer
        .querySelectorAll('button')
        .forEach((element) => element.removeAttribute('aria-current'));
  
      // Set `aria-current` on the active thumbnail
      thumbnail.querySelector('button').setAttribute('aria-current', true);
  
      // Scroll the active thumbnail into view if it's not visible
      if (!isThumbnailVisible(thumbnail)) {
        scrollThumbnailIntoView(thumbnail);
      }
    }
  
    // Function to check if the thumbnail is visible within the thumbnails container
    function isThumbnailVisible(thumbnail) {
      const thumbnailsRect = thumbnailsContainer.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();
  
      return (
        thumbnailRect.left >= thumbnailsRect.left &&
        thumbnailRect.right <= thumbnailsRect.right
      );
    }
  
    // Function to scroll the active thumbnail into view
    function scrollThumbnailIntoView(thumbnail) {
      const thumbnailsRect = thumbnailsContainer.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();
  
      // Check if the thumbnail is out of view and scroll it into view if necessary
      thumbnailsContainer.scrollBy({
        left: thumbnailRect.left - thumbnailsRect.left,
        behavior: 'smooth'
      });
    }
  });
  