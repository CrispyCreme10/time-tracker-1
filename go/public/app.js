import './components/TrackPage.js';
import { Router } from "./services/Router.js";

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the router
  app.Router.init();
});

window.app = {
  Router,
}