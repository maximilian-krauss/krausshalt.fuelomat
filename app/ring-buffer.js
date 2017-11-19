class RingBuffer {
  constructor(capacity) {
    this.items = [];
    this.capacity = capacity;
  }

  push(item) {
    this.items.splice(0, 0, item);
    if (this.items.length > this.capacity) {
      this.items = this.items.slice(0, this.capacity);
    }
  }

  toArray() {
    return [].concat(this.items);
  }
}

module.exports = RingBuffer;
