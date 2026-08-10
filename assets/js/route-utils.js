window.PawTagRoute = {
  parts() {
    return window.location.pathname.split("/").filter(Boolean);
  },

  param(kind) {
    const parts = this.parts();
    const index = parts.indexOf(kind);
    return index >= 0 ? parts[index + 1] : null;
  },

  tagId() {
    return this.param("p") || this.param("claim");
  },

  secretToken() {
    return this.param("edit");
  }
};
