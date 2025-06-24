import { routes } from "./Routes.js";

export const Router = {
  init: () => {
    window.addEventListener("popstate", (event) => {
      Router.go(location.pathname, false);
    });

    // Enhance links in document
    document.querySelectorAll("a.navlink").forEach(a => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const href = a.getAttribute("href");
        if (href) {
          Router.go(href);
        }
      });
    });

    // Go to the initial route
    Router.go(location.pathname + location.search);
  },
  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({}, "", route);
    }
    let pageElement = null;

    const routePath = route.includes("?") ? route.split("?")[0] : route;
    for (const r of routes) {
      if (typeof r.path === "string" && r.path === routePath) {
        pageElement = new r.component();
        break;
      } else if (r.path instanceof RegExp) {
        const match = r.path.exec(route);
        if (match) {
          pageElement = new r.component();
          const params = match.slice(1);
          pageElement.params = params;
          break;
        }
      }
    }

    if (pageElement == null) {
      pageElement = document.createElement("h1");
      pageElement.textContent = "Page not found";
    }

    document.querySelector("main").innerHTML = "";
    document.querySelector("main").appendChild(pageElement);
  },
};