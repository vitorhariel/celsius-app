import formatter from "./formatter";
import store from "../redux/store";

const interestUtil = {
  getUserInterestForCoin,
  calculateAPY,
  calculateBonusRate,
};

/**
 * Gets interest rate for user for a single coin
 *
 * @param {string} coinShort - BTC|ETH
 * @returns {object}
 * @returns {string} coin - BTC|ETH
 * @returns {string} rate - "0.12"
 * @returns {string} display - "12.00%"
 * @returns {boolean} inCEL - or in kind
 * @returns {boolean} eligible - if there are rates for coin
 */
function getUserInterestForCoin(coinShort) {
  const interestRates = store.getState().generalData.interestRates;
  const appSettings = store.getState().user.appSettings;

  let interestRate = 0;
  let interestRateDisplay;
  let inCEL = false;
  let eligible = false;
  let coinThreshold;
  let specialRate;
  let specialRateDisplay;
  if (
    interestRates &&
    interestRates[coinShort] &&
    appSettings.interest_in_cel_per_coin
  ) {
    eligible = true;
    inCEL =
      (appSettings.interest_in_cel_per_coin[coinShort] ||
        (appSettings.interest_in_cel &&
          appSettings.interest_in_cel_per_coin[coinShort] === null)) &&
      coinShort !== "CEL";
    interestRateDisplay = !inCEL
      ? formatter.percentageDisplay(interestRates[coinShort].compound_rate)
      : formatter.percentageDisplay(interestRates[coinShort].compound_cel_rate);
    interestRate = !inCEL
      ? interestRates[coinShort].compound_rate
      : interestRates[coinShort].compound_cel_rate;
  }

  if (
    interestRates &&
    interestRates[coinShort] &&
    interestRates[coinShort].rate_on_first_n_coins &&
    interestRates[coinShort].threshold_on_first_n_coins
  ) {
    coinThreshold = Number(interestRates[coinShort].threshold_on_first_n_coins);
    specialRate = Number(interestRates[coinShort].rate_on_first_n_coins);
    specialRateDisplay = formatter.percentageDisplay(
      interestRates[coinShort].rate_on_first_n_coins
    );
  }

  return {
    coin: coinShort,
    rate: interestRate,
    display: interestRateDisplay,
    coinThreshold,
    specialRate,
    specialRateDisplay,
    inCEL,
    eligible,
  };
}

/**
 * Calculates APY from APR value
 *
 * param {number} apr - value set in BO or with tier bonus
 */
function calculateAPY(apr) {
  return Math.pow(1 + apr / 52, 52) - 1;
}

/**
 * Calculates bonus apr rate
 *
 * param {number|string} apr - value set in BO
 * param {number|string} bonusRate - bonus rate for a specific tier level
 */
function calculateBonusRate(apr, bonusRate) {
  return (1 + Number(bonusRate)) * Number(apr);
}

export default interestUtil;
