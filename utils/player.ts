export class Player {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
  greet() {
    console.log(`Hello, ${this.name}!`);
  }
}
