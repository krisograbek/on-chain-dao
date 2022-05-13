import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/types";

require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// module.exports = {
//   solidity: "0.8.8",
// };

// task("delegate", "Prints Callers addres")
//   .addParam("account", "The account's address")
//   .setAction(async (taskArgs) => {
//     console.log(taskArgs.account);
//   });

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  solidity: "0.8.8",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    secondAccount: {
      default: 1
    },
    thirdAccount: {
      default: 2
    }
  }
}

export default config;
