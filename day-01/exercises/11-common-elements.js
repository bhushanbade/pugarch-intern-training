function findCommonElements(arr1, arr2) {
    const set = new Set(arr2);
    const result = [];

    for (let num of arr1) {
        if (set.has(num)) {
            result.push(num);
        }
    }

    return [...new Set(result)];
}

console.log(
    findCommonElements([1, 2, 3, 4], [3, 4, 5, 6])
);