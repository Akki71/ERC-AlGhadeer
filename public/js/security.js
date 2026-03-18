
window.isMastercardScriptLoaded = false;


function checkMastercardLoaded() {
  if (window.Checkout) {
    window.isMastercardScriptLoaded = true;
    console.log("Mastercard loaded (detected via global)");
  } else {
    console.error("Mastercard NOT loaded");
  }
}

function isLocalhost() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}


document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;


  if (window.location.hostname === "www.alghadeeruaecrafts.ae") {
    body.classList.add("home-pg");
    body.classList.remove("sub-page");
  } else {
    body.classList.remove("home-pg");
    body.classList.add("sub-page");
  }

  checkMastercardLoaded();


  setTimeout(() => {
    if (!window.Checkout) {
      console.error("Mastercard Checkout script timeout.");
    }
  }, 5000);
});