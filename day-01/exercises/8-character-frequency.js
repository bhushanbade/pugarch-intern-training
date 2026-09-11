function characterFrequency(str) {
    const frequency = {};

    for (let char of str) {
        if (char !== " ") {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }

    return frequency;
}

console.log(characterFrequency("hello world"));