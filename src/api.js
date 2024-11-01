import yahooFinance from "yahoo-finance2";
import fs from "node:fs/promises";

yahooFinance.setGlobalConfig({
  logger: {
    info: (...args) => {},
    warn: (...args) => console.error(...args),
    error: (...args) => console.error(...args),
    debug: (...args) => console.log(...args),
  },
});

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
    const data = await fs.readFile("db.json", "utf-8");
    const watchlist = JSON.parse(data || "[]");

    if (!watchlist.includes(symbol)) {
      watchlist.push(symbol);
    }

    await fs.writeFile("db.json", JSON.stringify(watchlist));
  } catch (error) {
    console.error(`Error saving stock to watchlist: ${error.message}`);
  }
};

/**
 * Displays all stocks in the watchlist.
 * @returns {Promise<void>}
 */
export const showStocksInWatchList = async () => {
  try {
    const data = await fs.readFile("db.json", "utf-8");
    const watchlist = JSON.parse(data || "[]");
    console.log("Stocks in watchlist:");
    console.log(watchlist);

    for (const symbol of watchlist) {
      const stock = await getStockInformation(symbol);
      console.log(stock);
    }
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
    await fs.writeFile("db.json", "[]");
    console.log("Watchlist cleaned");
  } catch (error) {
    console.error(`Error cleaning watchlist: ${error.message}`);
  }
};
