const calculateScore = (address: string): number => {
  let score = 0;

  // Rule 1: 10 points for each leading 0 nibble
  const leadingZeros = address.slice(2).match(/^0+/); // Skip "0x"
  if (leadingZeros) {
    score += leadingZeros[0].length * 10;
  }

  // Rule 2: 40 points if the address starts with "4444" after leading zeros
  const slicedAddress = address.slice(2); // Remove "0x"
  const firstNonZeroIndex = slicedAddress.search(/[^0]/); // Find first non-zero nibble
  if (
    slicedAddress.slice(firstNonZeroIndex, firstNonZeroIndex + 4) === "4444"
  ) {
    score += 40;
  }

  // Rule 3: 20 points if the first nibble after the four 4s is not a 4
  const fourStartIndex = slicedAddress.indexOf("4444");
  if (fourStartIndex !== -1 && slicedAddress[fourStartIndex + 4] !== "4") {
    score += 20;
  }

  // Rule 4: 20 points if the last four nibbles are all 4s
  if (address.slice(-4) === "4444") {
    score += 20;
  }

  // Rule 5: 1 point for each 4 elsewhere in the address
  const allFours = address.match(/4/g); // Count all occurrences of "4"
  if (allFours) {
    score += allFours.length;
  }

  return score;
};

const test = () => {
  // Expected 161
  console.log(calculateScore("0x00000004444Dc6335C3721F0dc7cF4340d344444"));
  // Expected 166
  console.log(calculateScore("0x00000000004444d3cb22ea006470e100eb014f2d"));
  // Expected 137
  console.log(calculateScore("0x00000004444eC61Aa00282943f1814b0400C10C0"));
  // Expected 156
  console.log(calculateScore("0x00000000044442D64A0BE733A5f2a3187BFA8234"));
};
test();
