class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

  toString() {
    return `${this.first} ${this.last}`;
  }
}

let brian = new Person('Miguel', 'Castillo');

export default brian;
