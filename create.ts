import { getContractAddress } from "viem";
import { toBytes } from "viem";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

type createOutput = {
  string: string;
  salt: Uint8Array;
  address: string;
  score?: number;
};

// Gets random string with inputted `length`
const getString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

// Calculates the score of an `address`
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

// Uses `getContractAddress` to view a CREATE2 address
const create = () => {
  //   const length: number = 7;
  const lengths = [4, 6, 7, 8, 10];

  const getRandomLength = () =>
    lengths[Math.floor(Math.random() * lengths.length)];

  const string: string = getString(getRandomLength());

  const salt = toBytes(string);

  const address = getContractAddress({
    bytecode:
      "0x94d114296a5af85c1fd2dc039cdaa32f1ed4b0fe0868f02d888bfc91feb645d9",
    from: "0x48E516B34A1274f49457b9C6182097796D0498Cb",
    opcode: "CREATE2",
    salt: salt,
  });

  return {
    string: string,
    salt: salt,
    address: address,
  };
};

// Saves creation data to json file
const appendToFile = async (newData: createOutput) => {
  console.log("Writing to output file...");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, "good_output.json");
  const data = await fs.readFile(filePath, "utf-8");

  try {
    let currentData: createOutput[] = [];

    try {
      const data = await fs.readFile(filePath, "utf-8");
      currentData = JSON.parse(data ?? "[]");
    } catch (err: any) {
      console.error("Error reading file:", err);
      if (err.code === "ENOENT") {
        console.log("File does not exist, initializing empty array.");
        currentData = [];
      } else {
        return;
      }
    }

    currentData.push(newData);
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), "utf-8");
    console.log("New data saved to good_output.json");
  } catch (error) {
    console.error("Error during file operation:", error);
  }
};

// Entry point that discards all addresses with scores that aren't higher than inputted `limit``
const filter = async (limit: number) => {
  while (true) {
    const { string, salt, address } = create();

    const score = calculateScore(address);
    console.log("Score:", score);

    if (score > limit) {
      console.log("High score found! Appending to file...");
      await appendToFile({ string, salt, address, score });
      // Add a 2 second delay after finding a score higher than `limit`
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

// Change this number to raise/lower the minimum saved score
filter(49);
