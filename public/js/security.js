window.isMastercardScriptLoaded = false;

function checkMastercardLoaded() {
  if (window.Checkout) {
    window.isMastercardScriptLoaded = true;
    // console.log("✅ Mastercard loaded");
  } else {
    console.warn("⚠️ Mastercard not yet loaded");
  }
}

function isLocalhost() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

// ✅ Handle page type (robust)
function updateBodyClass() {
  const body = document.body;
  const path = window.location.pathname.replace(/\/+$/, ""); // remove trailing slash

  if (path === "" || path === "/index.html") {
    body.classList.add("home-pg");
    body.classList.remove("sub-page");
  } else {
    body.classList.remove("home-pg");
    body.classList.add("sub-page");
  }
}

// ✅ Run on initial load
document.addEventListener("DOMContentLoaded", function () {
  updateBodyClass();

  // Retry Mastercard check (important for slow networks)
  let retries = 0;
  const interval = setInterval(() => {
    if (window.Checkout) {
      window.isMastercardScriptLoaded = true;
      console.log("✅ Mastercard loaded (retry success)");
      clearInterval(interval);
    } else if (retries > 10) {
      console.error("❌ Mastercard Checkout failed after retries");
      clearInterval(interval);
    }
    retries++;
  }, 500);
});


// ✅ Handle SPA navigation (VERY IMPORTANT for React)
(function () {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function () {
    pushState.apply(history, arguments);
    updateBodyClass();
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    updateBodyClass();
  };

  window.addEventListener("popstate", updateBodyClass);
})();