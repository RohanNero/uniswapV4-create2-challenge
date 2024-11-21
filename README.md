# Uniswap v4 CREATE2 Challenge

[Details](https://v4-address.uniswap.org/) from Uniswap:

The challenge will run from November 10th, 2024 to December 1st, 2024. Uniswap v4 will be deployed using the CREATE2 function. This function generates deterministic addresses using:

- The hash of the initcode for Uniswap v4: `0x94d114296a5af85c1fd2dc039cdaa32f1ed4b0fe0868f02d888bfc91feb645d9`

- The deployer address for Uniswap v4: `0x48E516B34A1274f49457b9C6182097796D0498Cb`

- Your choice of a salt

## Scoring

Addresses will be scored based on the following criteria:

- 10 points for each leading 0 nibble
- 40 points if the address starts with four consecutive 4s
- 20 points if the first nibble after the four 4s is not a 4
- 20 points if the last four nibbles are all 4s
- 1 point for each 4 elsewhere in the address

## Quickstart

Clone the repo

```bash
git clone https://github.com/RohanNero/uniswapV4-create2-challenge
```

Install the dependencies

```bash
npm install
```

Run the script

```bash
npx tsx create.ts
```

Check scoring function

```bash
npx tsx score.ts
```
