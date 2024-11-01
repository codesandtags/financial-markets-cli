# Financial Markets CLI

Financial Markets CLI as `fm` on your terminal.

## Description

A CLI tool to get stock or markets information from the terminal.

This CLI tool is built using Node.js and the yahoo-finance2 package. It allows you to get information about a stock or market index by providing the ticker symbol.

### Features

- Get stock information by providing the ticker symbol.
- Store favorite stocks to get information about them quickly.

## Requirements

- Node.js
- npm
- Access to Internet

## Dependencies

- [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)
- [yargs](https://www.npmjs.com/package/yargs)

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm link` to create a symlink to the CLI tool.
4. Run `fm --help` to see the available commands.

## Usage

### Get Stock Information

To get the stock price for a specific symbol:

```sh
fm stock <symbol>
```

### Save Stock to Watchlist

To save a stock to the watchlist:

```sh
fm stock <symbol> --save
fm stock AAPL --save
```

### Clean Watchlist

To clean the watchlist:

```sh
fm clean
```
