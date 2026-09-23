function isString(value: unknown): value is string {
  return typeof value === "string";
}

function displayValue(value: unknown) {
  if (isString(value)) {
    console.log("String:", value.toUpperCase());
  } else {
    console.log("Not a string");
  }
}

displayValue("Bhushan");
displayValue(100);