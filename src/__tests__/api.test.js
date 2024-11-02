import { jest } from "@jest/globals";
import exp from "node:constants";

// Mock the 'fs/promises' module with the required methods
await jest.unstable_mockModule("node:fs/promises", () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

await jest.unstable_mockModule("yahoo-finance2", () => ({
  default: {
    quote: jest.fn(),
    setGlobalConfig: jest.fn(),
  },
}));

const yahooFinance = await import("yahoo-finance2");
const { readFile, writeFile } = await import("node:fs/promises");
const { getStockInformation, saveStock } = await import("../api.js");
// import { getStockInformation, saveStock } from "../api.js";

// Import the mocked library and the function under test

describe("CLI API", () => {
  beforeEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  test("should get stock information", async () => {
    const mockQuoteData = {
      symbol: "AAPL",
      regularMarketPrice: 150,
      currency: "USD",
      quoteSourceName: "Delayed Quote",
      marketState: "REGULAR",
    };

    // Mock the behavior of yahooFinance.quote for this test
    yahooFinance.default.quote.mockResolvedValueOnce(mockQuoteData);
    const result = await getStockInformation("AAPL");
    expect(yahooFinance.default.quote).toHaveBeenCalledWith("AAPL");
    expect(result).toEqual({
      symbol: "AAPL",
      price: 150,
      currency: "USD",
      quoteSourceName: "Delayed Quote",
      marketState: "REGULAR",
    });
  });

  test("should not save stock to watchlist if already present", async () => {
    const symbol = "AAPL";
    const mockData = JSON.stringify(["AAPL", "GOOGL"]);

    readFile.mockResolvedValue(mockData);
    writeFile.mockResolvedValue();

    await saveStock(symbol);

    expect(readFile).toHaveBeenCalledTimes(1);
  });

  test("should handle errors gracefully", async () => {
    const symbol = "AAPL";
    const errorMessage = "File not found";

    readFile.mockRejectedValue(new Error(errorMessage));

    console.error = jest.fn();

    await saveStock(symbol);

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error saving stock to watchlist: ${errorMessage}`
    );
  });
});
