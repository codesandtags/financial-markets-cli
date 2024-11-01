import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  getStockInformation,
  saveStock,
  showStocksInWatchList,
  cleanWatchList,
} from "./api.js";

yargs(hideBin(process.argv))
  .command(
    "stock <symbol>",
    "Get stock price",
    (yargs) => {
      yargs.positional("symbol", {
        type: "string",
        describe: "Stock symbol",
      });
    },
    /**
     * Handles the 'stock' command.
     * @param {Object} argv - The arguments passed to the command.
     * @param {string} argv.symbol - The stock symbol.
     * @param {boolean} [argv.save] - Whether to save the stock to the watchlist.
     */
    async (argv) => {
      const symbol = argv?.symbol.toUpperCase();
      const save = argv?.save;
      console.log(`Getting stock price for [${symbol}]`);

      const stock = await getStockInformation(symbol);

      if (save) {
        await saveStock(symbol);
      }

      console.log(stock);
    }
  )
  .option("save", {
    alias: "s",
    type: "boolean",
    description: "Save stock to watchlist",
  })
  .command(
    "show",
    "Show information for all stocks saved",
    (yargs) => {
      yargs.positional("show", {
        type: "string",
        describe: "Show all stocks saved",
      });
    },
    /**
     * Handles the 'show' command.
     * @param {Object} argv - The arguments passed to the command.
     */
    async (argv) => {
      console.log(`Showing all stocks saved`);
      await showStocksInWatchList();
    }
  )
  .command("clean", "Clean watchlist", async () => {
    console.log("Cleaning watchlist");
    await cleanWatchList();
  })
  .demandCommand(1)
  .parse();
