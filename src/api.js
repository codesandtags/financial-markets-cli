import yahooFinance from "yahoo-finance2";
import { readFile, writeFile } from "node:fs/promises";

yahooFinance.setGlobalConfig({
  logger: {
    info: (...args) => {},
    warn: (...args) => {},
    error: (...args) => {},
    debug: (...args) => {},
  },
});

const DB_PATH = new URL("../db.json", import.meta.url).pathname;
const ENCODING = "utf-8";

/**
 * Fetches stock information for a given symbol.
 * @param {string} symbol - The stock symbol to fetch information for.
 * @returns {Promise<Object>} The stock information.
 */
export const getStockInformation = async (symbol) => {
  try {
    const data = await yahooFinance.quote(symbol);

    return {
      symbol: data.symbol,
      shortName: data.shortName,
      price: data.regularMarketPrice,
      currency: data.currency,
      quoteSourceName: data.quoteSourceName,
      marketState: data.marketState,
    };
  } catch (error) {
    console.error(`Error fetching stock information: ${error.message}`);
  }
};

/**
 * Saves a stock symbol to the watchlist.
 * @param {string} symbol - The stock symbol to save.
 * @returns {Promise<void>}
 */
export const saveStock = async (symbol) => {
  try {
    const data = await readFile(DB_PATH, ENCODING);
    const watchlist = JSON.parse(data || "[]");

    if (!watchlist.includes(symbol)) {
      watchlist.push(symbol);
    }

    await writeFile(DB_PATH, JSON.stringify(watchlist));
  } catch (error) {
    console.error(`Error saving stock to watchlist: ${error.message}`);
  }
};

/**
 * Removes a stock symbol from the watchlist.
 * @param {string} symbol - The stock symbol to remove.
 * @returns {Promise<void>}
 */
export const removeStock = async (symbol) => {
  try {
    const data = await readFile(DB_PATH, ENCODING);
    const watchlist = JSON.parse(data || "[]");

    const index = watchlist.indexOf(symbol);
    if (index !== -1) {
      watchlist.splice(index, 1);
    }

    await writeFile(DB_PATH, JSON.stringify(watchlist));
  } catch (error) {
    console.error(`Error removing stock from watchlist: ${error.message}`);
  }
};

/**
 * Displays all stocks in the watchlist.
 * @returns {Promise<void>}
 */
export const showStocksInWatchList = async () => {
  try {
    const data = await readFile(DB_PATH, ENCODING);
    const watchlist = JSON.parse(data || "[]");
    console.log("Stocks in watchlist:");
    console.log(watchlist);

    const stocks = await Promise.all(
      watchlist.map(async (symbol) => {
        return await getStockInformation(symbol);
      })
    );
    console.table(stocks);
  } catch (error) {
    console.error(`Error showing stocks in watchlist: ${error.message}`);
  }
};

/**
 * Cleans the watchlist by removing all stock symbols.
 * @returns {Promise<void>}
 */
export const cleanWatchList = async () => {
  try {
    await writeFile(DB_PATH, "[]");
    console.log("Watchlist cleaned");
  } catch (error) {
    console.error(`Error cleaning watchlist: ${error.message}`);
  }
};
