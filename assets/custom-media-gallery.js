document.addEventListener('DOMContentLoaded', () => {
  // Ensure the page is fully loaded before running the script

  const mediaGalleryViewer = document.querySelector('[id^="GalleryViewer"]'); // Select the main gallery viewer element
  const thumbnailsContainer = document.querySelector('[id^="GalleryThumbnails"]'); // Select the thumbnail container element
  const leftArrow = document.querySelector('.arrow-left'); // Select the left arrow button for previous navigation
  const rightArrow = document.querySelector('.arrow-right'); // Select the right arrow button for next navigation

  // Ensure all key elements are present before adding event listeners
  if (!mediaGalleryViewer || !thumbnailsContainer || !leftArrow || !rightArrow) {
    console.error("One or more key elements (media gallery or thumbnails) are missing");
    return; // Exit the script if any key elements are missing
  }

  // Collect only valid media items from the <li> elements in the gallery
  const mediaItems = Array.from(mediaGalleryViewer.querySelectorAll('li.product__media-item[data-media-id]'));

  const totalItems = mediaItems.length; // Count the total number of media items

  if (totalItems === 0) {
    console.error("No valid media items found.");
    return; // Exit if no media items are found
  }

  // Event listeners for the arrow buttons (previous and next)
  leftArrow.addEventListener('click', showPreviousMedia); // When left arrow is clicked, show the previous media
  rightArrow.addEventListener('click', showNextMedia); // When right arrow is clicked, show the next media

  // Function to show the previous media item (loops back to the last item if at the first)
  function showPreviousMedia() {
    const currentMedia = mediaGalleryViewer.querySelector('.is-active'); // Get the currently active media item
    const currentIndex = mediaItems.indexOf(currentMedia); // Get the index of the active media item
    const previousIndex = (currentIndex - 1 + totalItems) % totalItems; // Calculate the index of the previous item (loop if necessary)
    const previousMedia = mediaItems[previousIndex]; // Get the previous media item
    setActiveMedia(previousMedia); // Set the previous media as the active item
  }

  // Function to show the next media item (loops back to the first item if at the last)
  function showNextMedia() {
    const currentMedia = mediaGalleryViewer.querySelector('.is-active'); // Get the currently active media item
    const currentIndex = mediaItems.indexOf(currentMedia); // Get the index of the active media item
    const nextIndex = (currentIndex + 1) % totalItems; // Calculate the index of the next item (loop if necessary)
    const nextMedia = mediaItems[nextIndex]; // Get the next media item
    setActiveMedia(nextMedia); // Set the next media as the active item
  }

  // Function to update the active media item and the corresponding thumbnail
  function setActiveMedia(mediaElement) {
    if (!mediaElement || !mediaElement.getAttribute('data-media-id')) {
      console.error("Invalid media element or missing data-media-id.");
      return; // Return if the media element is invalid or lacks a data-media-id attribute
    }

    // Remove the 'is-active' class from all media items
    mediaItems.forEach((element) => {
      element.classList.remove('is-active');
    });

    // Add 'is-active' class to the new active media item
    mediaElement.classList.add('is-active');
    mediaElement.scrollIntoView({ behavior: 'smooth' }); // Smoothly scroll the new active media into view

    // Update the corresponding thumbnail to match the new active media
    const mediaId = mediaElement.getAttribute('data-media-id'); // Get the media ID of the active item
    const activeThumbnail = thumbnailsContainer.querySelector(`[data-target="${mediaId}"]`); // Find the corresponding thumbnail

    if (!activeThumbnail) {
      console.error(`No corresponding thumbnail found for media ID: ${mediaId}`);
      return; // Return if no matching thumbnail is found
    }

    setActiveThumbnail(activeThumbnail); // Update the active thumbnail
  }

  // Function to update the active thumbnail (same behavior as media-gallery.js)
  function setActiveThumbnail(thumbnail) {
    if (!thumbnailsContainer || !thumbnail) {
      console.error("Thumbnail or thumbnails container is missing");
      return; // Return if thumbnail or container is missing
    }

    // Remove the `aria-current` attribute from all thumbnails
    thumbnailsContainer.querySelectorAll('button').forEach((element) => {
      element.removeAttribute('aria-current');
    });

    // Set `aria-current` on the active thumbnail
    thumbnail.querySelector('button').setAttribute('aria-current', true);

    // Ensure the active thumbnail is visible (scroll into view if necessary)
    if (!isThumbnailVisible(thumbnail)) {
      scrollThumbnailIntoView(thumbnail);
    }
  }

  // Function to check if the thumbnail is visible within the thumbnails container
  function isThumbnailVisible(thumbnail) {
    const thumbnailsRect = thumbnailsContainer.getBoundingClientRect(); // Get the container's bounding box
    const thumbnailRect = thumbnail.getBoundingClientRect(); // Get the thumbnail's bounding box

    // Return true if the thumbnail is fully visible within the container's bounds
    return (
      thumbnailRect.left >= thumbnailsRect.left &&
      thumbnailRect.right <= thumbnailsRect.right
    );
  }

  // Function to scroll the active thumbnail into view if it's not fully visible
  function scrollThumbnailIntoView(thumbnail) {
    const thumbnailsRect = thumbnailsContainer.getBoundingClientRect(); // Get the container's bounding box
    const thumbnailRect = thumbnail.getBoundingClientRect(); // Get the thumbnail's bounding box

    // Scroll the thumbnails container by the difference between the container and the thumbnail positions
    thumbnailsContainer.scrollBy({
      left: thumbnailRect.left - thumbnailsRect.left,
      behavior: 'smooth' // Smooth scroll effect
    });
  }
});
