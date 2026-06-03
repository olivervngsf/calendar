// Set the theme before paint to avoid a flash of the wrong palette.
// External (not inline) so React 19 hoists it without the inline-script warning.
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute(
      "data-theme",
      stored || (prefersDark ? "dark" : "light"),
    );
  } catch (e) {}
})();
