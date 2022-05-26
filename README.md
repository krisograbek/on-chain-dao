# On-Chain DAO

This Repository is my submission project for the Spring 2022 Chainlink Hackathon. 
It is an extension of [Patrick Collins' Video](https://www.youtube.com/watch?v=AhJtmUqhAqg) on how to build an On-chain DAO.

## Additions

Patrick's video contains Smart Contracts and scripts to deploy them using a local Hardhat node. Using this repository you can:

 - Interact with contracts using Frontend
 - Deploy contracts on the Rinkeby Network


## Install smart contract packages

Install packages using `npm`
```
$ npm i
```
or `yarn`
```
$ yarn
```

## Install Frontend packages

Go to the frontend folder
```
$ cd client
```
Install packages using `npm`
```
$ npm i
```
or `yarn`
```
$ yarn
```

## Settings
When you deploy the governor Contract, you pass parameters to it.
```
export const VOTING_DELAY = 1; //block
export const VOTING_PERIOD = 5; //blocks
export const QUORUM_PERCENTAGE = 4; // minimal number of votes to make it an eligable voting
```
Also, there is a minimum deley between queuing the proposal and it's execution. 
```
export const MIN_DELAY = 3600;
```

## Run Local Hardhat Network

```
$ npx hardhat node
```

**Important: Keep the Node running**

## Deploy Contracts on Rinkeby
### Update `.env` file

In the project copy `.env.example` file to `.env`
```
$ cp .env.example .env
```
And update the parameters: `PRIVATE_KEY` and `RINKEBY_URL`

### Deploy contracts

```
$ npx hardhat deploy --network rinkeby
```
### Update Contract Adresses
After you deploy your own Contracts, you have to update Adresses. Please, open the `client/src/utils/constants.ts` file and update following variables:
```
export const governorAddressRB: string = 'PASTE GOVERNOR ADDRESS HERE';
export const boxAddressRB: string = 'PASTE BOX ADDRESS HERE';
export const tokenAddressRB: string = 'PASTE TOKEN ADDRESS HERE';
```

## Run Frontend
Make sure you're in the `/client` directory and run
```
$ npm start
```
## Open `http://localhost:3000` in your Browser

## Happy Coding!

