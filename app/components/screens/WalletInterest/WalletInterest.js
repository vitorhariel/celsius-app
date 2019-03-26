import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import formatter from "../../../utils/formatter";
import * as appActions from "../../../redux/actions";
import CelText from '../../atoms/CelText/CelText';
import Card from "../../atoms/Card/Card";
import RegularLayout from '../../layouts/RegularLayout/RegularLayout';
import STYLES from "../../../constants/STYLES";
import TransactionsHistory from "../../molecules/TransactionsHistory/TransactionsHistory";
import CelButton from "../../atoms/CelButton/CelButton";
import WalletInterestStyle from "./WalletInterest.styles";
import TodayInterestRatesModal from "../../organisms/TodayInterestRatesModal/TodayInterestRatesModal";
import { EMPTY_STATES, MODALS } from "../../../constants/UI";
import GraphContainer from "../../graphs/GraphContainer/GraphContainer";
import StaticScreen from "../StaticScreen/StaticScreen";



@connect(
  (state) => ({
    walletSummary: state.wallet.summary,
    transactions: state.transactions.transactionList,
    currencyRatesShort: state.currencies.currencyRatesShort,
    currencyGraphs: state.currencies.graphs,
    chartData: state.interest.chartData
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class WalletInterest extends Component {

  static navigationOptions = {
    title: 'Interest earned',
    right: 'profile'
  };

  constructor(props) {
    super(props);

    this.state = {
      header: {
        title: "Interest earned",
        left: "back",
        right: "profile"
      },
    };
  }

  openInterestModal = () => {
    const { actions } = this.props;
    actions.openModal(MODALS.TODAY_INTEREST_RATES_MODAL);
  }

  navigateToAllTransactions = () => {
    const { actions } = this.props;
    actions.navigateTo('AllTransactions');
  }

  render() {
    const { walletSummary } = this.props;
    const style = WalletInterestStyle();

   if (walletSummary.total_interest_earned <= 0) {
     return (
       <StaticScreen
         emptyState={{ purpose: EMPTY_STATES.ZERO_INTEREST }}
       />
     )
   }

    return (
      <RegularLayout padding='20 0 100 0'>
        <View style={style.container}>
          <Card onPress={this.openInterestModal}>
            <CelText type="H6" weight='300'>Total interest earned</CelText>
            <View style={style.amountWrapper}>
              <CelText weight='600' type="H3">{formatter.usd(walletSummary.total_interest_earned)}</CelText>
              <CelText color={STYLES.COLORS.CELSIUS_BLUE}>Todays rates</CelText>
            </View>
          </Card>
        </View>

        <GraphContainer
          showCursor
          showPeriods
          interest
          type={"total-interest"}
        />

        <View style={style.container}>
          <TransactionsHistory
            hasFilter={false}
            additionalFilter={{ type: 'interest', limit: 5 }}
          />

          <CelButton
            basic
            margin="0 0 15 0"
            onPress={this.navigateToAllTransactions}
          >
            See all
          </CelButton>
        </View>
        <TodayInterestRatesModal />
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(WalletInterest);
