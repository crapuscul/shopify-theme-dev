
document.addEventListener("DOMContentLoaded", function() {
  var headerWrapper = document.querySelector(".header-wrapper");
  if (headerWrapper) {
    headerWrapper.classList.remove("color-{{ section.settings.color_scheme }}", "gradient");
  }
});


