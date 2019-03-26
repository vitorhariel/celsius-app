import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Image } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as appActions from "../../../redux/actions";
import testUtil from "../../../utils/test-util";
import EmptyStateStyle from "./EmptyState.styles";
import CelText from "../CelText/CelText";
import CelButton from "../CelButton/CelButton";
import { THEMES, EMPTY_STATES, MODALS } from "../../../constants/UI";
import TodayInterestRatesModal from "../../organisms/TodayInterestRatesModal/TodayInterestRatesModal";


function getDefaultEmptyState(purpose, actions) {
  if (!purpose) return {};

  return {
    [EMPTY_STATES.FIRST_TIME]: {
      image: require("../../../../assets/images/bear-happyKYC3x.png"),
      heading: "Welcome",
      paragraphs: ["Ready to start exploring Celsius"],
      button: "Go to Wallet",
      onPress: () => actions.navigateTo("WalletLanding")
    },
    [EMPTY_STATES.ERROR]: {
      image: require("../../../../assets/images/illuNoKYC3x.png"),
      heading: "Oooops...",
      paragraphs: ["Something broke. We apologize for any inconvenience."],
      button: "Go Home",
      onPress: () => actions.navigateTo("Home")
    },
    [EMPTY_STATES.NO_DATA]: {
      image: require("../../../../assets/images/deerTransactionHistory.png"),
      heading: "Sorry!",
      paragraphs: ["No data to show!"],
      button: "Go Home",
      onPress: () => actions.navigateTo("Home")
    },
    [EMPTY_STATES.USER_CLEARED]: {
      image: require("../../../../assets/images/bear-happyKYC3x.png"),
      heading: "Great job!",
      paragraphs: ["Ready to start exploring Celsius"],
      button: "Go Home",
      onPress: () => actions.navigateTo("Home")
    },
    [EMPTY_STATES.COMPLIANCE]: {
      image: require("../../../../assets/images/OfflineMode/deer-tangled3x.png"),
      heading: "Sorry!",
      paragraphs: ["We apologize for any inconvenience, but due to local laws and regulations, we are unable to work with users from your region."]
    },
    [EMPTY_STATES.UNDER_CONSTRUCTION]: {
      image: require("../../../../assets/images/OfflineMode/deer-tangled3x.png"),
      heading: "Under Construction!",
      paragraphs: ["We are working really hard on this feature!"]
    },
    [EMPTY_STATES.INSUFFICIENT_FUNDS]: {
      image: require("../../../../assets/images/OfflineMode/deer-tangled3x.png"),
      heading: "Insufficient funds!",
      paragraphs: ["PLEASE GIVE US US YOUR MONEYYYYYY!"]
    },
    [EMPTY_STATES.ZERO_INTEREST]: {
      image: require("../../../../assets/images/money-bear3x.png"),
      heading: "Keep HODLing",
      paragraphs: ["We're paying interest in kind every Monday! It means you will earn interest in BTC for your BTC deposits. ETH for ETH, etc. YOu can earn up to 7% a year on your coins."],
      button: "Check this week's rates",
      onPress: () =>  actions.openModal(MODALS.TODAY_INTEREST_RATES_MODAL)
    }
  }[purpose];
}

@connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class EmptyState extends Component {
  static propTypes = {
    purpose: PropTypes.oneOf(Object.keys(EMPTY_STATES)),
    theme: PropTypes.oneOf(Object.values(THEMES)),
    heading: PropTypes.string,
    image: PropTypes.string,
    paragraphs: PropTypes.instanceOf(Array),
    button: PropTypes.string,
    onPress: PropTypes.func,
    support: PropTypes.bool
  };
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = getDefaultEmptyState(props.purpose, props.actions);
  }


  render() {
    const emptyStateProps = {
      ...this.state,
      ...this.props
    };
    const { image, heading, paragraphs, onPress, button, support, actions } = emptyStateProps;

    const style = EmptyStateStyle();
    return (
      <View style={style.container}>
        <View>
          <Image source={image || require("../../../../assets/images/deerTransactionHistory.png")}
                 style={{ width: 140, height: 140, resizeMode: "contain" }}/>
        </View>

        <CelText margin="20 0 15 0" align="center" type="H1" weight={"700"} bold>{heading}</CelText>

        {paragraphs.map(paragraph => (
          <CelText margin="5 0 15 0" align="center" type="H4" weight={"300"} key={paragraph}>{paragraph}</CelText>
        ))}

        {button && onPress ? (
          <CelButton margin="10 0 10 0" onPress={onPress}>{button}</CelButton>
        ) : null}

        {support ? (
          <CelButton onPress={() => {
            actions.navigateTo("SupportFab");
          }} margin="8 0 8 0" basic>Contact support</CelButton>
        ) : null}
        <TodayInterestRatesModal />
      </View>


    );
  }
};

EmptyState.propTypes = {};

export default testUtil.hookComponent(EmptyState);
