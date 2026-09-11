function firstNonRepeatingCharacter(str) {
    const frequency = {};

    for (let char of str) {
        frequency[char] = (frequency[char] || 0) + 1;
    }

    for (let char of str) {
        if (frequency[char] === 1) {
            return char;
        }
    }

    return null;
}

console.log(firstNonRepeatingCharacter("aabbcddee"));