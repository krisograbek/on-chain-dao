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

## Run Frontend
Make sure you're in the `/client` directory and run
```
$ npm start
```
## Open `http://localhost:3000` in your Browser

## Happy Coding!

