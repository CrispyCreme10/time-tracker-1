export class TrackPage extends HTMLElement {
  trackingEntries = [];
  durationIntervalId = null;

  // Element refs
  form = null;
  taskNameInput = null;
  taskCommentInput = null;
  submitBtn = null;
  tbody = null;

  connectedCallback() {
    const template = document.getElementById("template-track-page");
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // TODO: Initialize tracking entries from data source (e.g., localStorage, API)

    this.render();
  }

  disconnectedCallback() {
    this.removeInterval();
  }

  render() {
    this.form = this.querySelector("form");
    this.taskNameInput = this.querySelector("#task-name");
    this.taskCommentInput = this.querySelector("#task-comment");
    this.submitBtn = this.querySelector("button[type='submit']");
    this.tbody = this.querySelector("table tbody");

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const taskName = this.taskNameInput.value.trim();
      const taskComment = this.taskCommentInput.value.trim();

      if (!taskName) {
        alert("Task name is required.");
        return;
      }

      this.punchIn(taskName, taskComment);
      this.renderEntries();

      // Reset form inputs
      this.taskNameInput.value = "";
      this.taskCommentInput.value = "";
      this.setSubmitButtonDisabled();
    });

    this.taskNameInput.addEventListener("input", () => {
      this.setSubmitButtonDisabled();
    });

    this.taskCommentInput.addEventListener("input", () => {
      this.setSubmitButtonDisabled();
    });
  }

  renderEntries() {
    this.tbody.innerHTML = ""; // Clear existing rows
    this.trackingEntries.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.startTime.toLocaleString()}</td>
        <td>${entry.endTime ? entry.endTime.toLocaleString() : "-"}</td>
        <td>${entry.duration ? this.formatDuration(entry.duration) : "0s"}</td>
        <td>${entry.taskName}</td>
        <td>${entry.taskComment}</td>
        ${
          !entry.endTime
            ? `
              <td>
                <button class="btn">Punch Out</button>
              </td>
            `
            : "<td></td>"
        }
      `;
      this.tbody.appendChild(row);
      if (index === 0 && !entry.endTime) {
        const punchOutBtn = row.querySelector("button.btn");
        punchOutBtn.addEventListener("click", () => {
          this.punchOut(entry);
        });
      }
    });

    if (this.trackingEntries.length > 0) {
      const firstEntry = this.trackingEntries[0];
      // If the first entry has an end time, do not start the interval
      if (firstEntry.endTime) return;

      const firstRow = document.querySelector("table tbody tr");
      if (!firstRow) {
        console.warn("No tracking entries found.");
        return;
      }
      const durationCell = firstRow.querySelector("td:nth-child(3)");
      if (!durationCell) {
        console.warn("Duration cell not found in the first row.");
        return;
      }
      const startTime = firstEntry.startTime;
      this.durationIntervalId = setInterval(() => {
        const now = new Date();
        const duration = now - startTime;
        durationCell.textContent = this.formatDuration(duration);
      }, 1000);
    }
  }

  punchIn(taskName, taskComment) {
    // punch out any existing entry
    if (this.trackingEntries.length > 0 && !this.trackingEntries[0].endTime) {
      console.error(
        "You already have an active task. Please punch out before starting a new one."
      );
      return;
    }

    const startTime = new Date();
    const entry = {
      startTime,
      endTime: null,
      duration: null,
      taskName,
      taskComment,
    };

    this.trackingEntries.unshift(entry);
  }

  punchOut(entry) {
    // update first entry end time and duration
    const now = new Date();
    entry.endTime = now;
    entry.duration = now - entry.startTime;
    // remove interval
    this.removeInterval();
    // re-render entries
    this.renderEntries();
  }

  setSubmitButtonDisabled() {
    const taskName = this.taskNameInput.value.trim();
    const taskComment = this.taskCommentInput.value.trim();
    if (taskName.length > 0 && taskComment.length > 0) {
      this.submitBtn.disabled = false;
    } else {
      this.submitBtn.disabled = true;
    }
  }

  formatDuration(duration) {
    const seconds = Math.round(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours === 0 && minutes === 0) {
      return `${seconds % 60}s`;
    } else if (hours === 0) {
      return `${minutes % 60}m ${seconds % 60}s`;
    }
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }

  removeInterval() {
    if (this.durationIntervalId) {
      clearInterval(this.durationIntervalId);
      this.durationIntervalId = null;
    }
  }
}

customElements.define("track-page", TrackPage);
