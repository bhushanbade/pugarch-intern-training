function getFirst<T>(items: T[]): T {
  return items[0];
}

console.log(getFirst<number>([10, 20, 30]));
console.log(getFirst<string>(["Java", "React", "TypeScript"]));