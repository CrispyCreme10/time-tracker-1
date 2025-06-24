export class TrackPage extends HTMLElement {
  async render() {
    const taskNameInput = this.querySelector("#task-name");
    const taskCommentInput = this.querySelector("#task-comment");
    const table = this.querySelector("table");
  }

  connectedCallback() {
    const template = document.getElementById("template-track-page");
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    this.render();
  }
}

customElements.define('track-page', TrackPage);