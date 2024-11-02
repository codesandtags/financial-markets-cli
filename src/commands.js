import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  getStockInformation,
  saveStock,
  removeStock,
  showStocksInWatchList,
  cleanWatchList,
} from "./api.js";

yargs(hideBin(process.argv))
  .usage(
    "fm (financial markets):  A CLI tool to get stock or markets information from the terminal."
  )
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
      const remove = argv?.remove;

      if (remove) {
        await removeStock(symbol);
        console.log(`Removed stock ${symbol} from watchlist`);
        return;
      }

      if (save) {
        await saveStock(symbol);
        console.log(`Saved stock ${symbol} to watchlist`);
      }

      const stock = await getStockInformation(symbol);

      console.table([stock]);
    }
  )
  .option("save", {
    alias: "s",
    type: "boolean",
    description: "Save stock to watchlist",
  })
  .option("remove", {
    alias: "r",
    type: "boolean",
    description: "Remove stock from the watchlist",
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

  .epilog("Stock CLI - 2024")
  .parse();
