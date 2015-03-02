class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

  toString() {
    return `${this.first} ${this.last}`;
  }
}

let miguel = new Person('Miguel', 'Castillo');

export default miguel;
