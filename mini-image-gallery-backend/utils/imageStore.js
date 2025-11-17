class ImageStore {
  constructor() {
    this.images = new Map();
  }

  add(id, data) {
    this.images.set(id, data);
  }

  get(id) {
    return this.images.get(id);
  }

  delete(id) {
    return this.images.delete(id);
  }

  list() {
    return Array.from(this.images.values());
  }

  clear() {
    this.images.clear();
  }
}

module.exports = new ImageStore();
