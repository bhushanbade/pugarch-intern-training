function displayId(id: number | string) {
  if (typeof id === "number") {
    console.log("Number ID:", id);
  } else {
    console.log("String ID:", id);
  }
}

displayId(101);
displayId("EMP101");