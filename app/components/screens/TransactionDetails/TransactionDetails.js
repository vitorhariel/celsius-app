import React, { Component } from "react";
import { Text, View, Image, Linking, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { Constants } from "expo";

import * as appActions from "../../../redux/actions";
import { COLORS, FONT_SCALE, GLOBAL_STYLE_DEFINITIONS as globalStyles, STYLES } from "../../../config/constants/style";
import TransactionDetailsStyle from "./TransactionDetails.styles";
import CelButton from "../../../components/atoms/CelButton/CelButton";
import Badge from "../../../components/atoms/Badge/Badge";
import BasicLayout from "../../layouts/BasicLayout/BasicLayout";
import { MainHeader } from "../../molecules/MainHeader/MainHeader";
import CelHeading from "../../atoms/CelHeading/CelHeading";
import Icon from "../../atoms/Icon/Icon";
import Separator from "../../atoms/Separator/Separator";
import Loader from "../../atoms/Loader/Loader";
import formatter from '../../../utils/formatter';
import HippoBubble from "../../molecules/HippoBubble/HippoBubble";
import Triangle from "../../atoms/Triangle/Triangle";
import apiUtil from "../../../utils/api-util";
import API from "../../../config/constants/API";
import CelScreenContent from "../../atoms/CelScreenContent/CelScreenContent";
import InfoBubble from "../../atoms/InfoBubble/InfoBubble";
import { BRANCH_LINKS, MODALS, TRANSACTION_TYPES } from "../../../config/constants/common";
import { createBUO } from "../../../redux/branch/branchActions";
import TransactionOptionsModal from "../../organisms/TransactionOptionsModal/TransactionOptionsModal";

function getHeading(transaction) {
  return {
    DEPOSIT_PENDING: `Receiving ${transaction.coin && transaction.coin.toUpperCase()}`,
    DEPOSIT_CONFIRMED: `Received ${transaction.coin && transaction.coin.toUpperCase()}`,
    WITHDRAWAL_PENDING: `Withdrawing ${transaction.coin && transaction.coin.toUpperCase()}`,
    WITHDRAWAL_CONFIRMED: `Withdrawn ${transaction.coin && transaction.coin.toUpperCase()}`,
    INTEREST: `${transaction.interest_coin && transaction.interest_coin.toUpperCase()} Interest`,
    COLLATERAL: `${transaction.coin && transaction.coin.toUpperCase()} Collateral`,
    TRANSFER_PENDING: `${transaction.coin && transaction.coin.toUpperCase()} Sending`,
    TRANSFER_CLAIMED: `${transaction.coin && transaction.coin.toUpperCase()} Claimed`,
    TRANSFER_SENT: `${transaction.coin && transaction.coin.toUpperCase()} Sent`,
    TRANSFER_RECEIVED: `${transaction.coin && transaction.coin.toUpperCase()} Received`,
    TRANSFER_RETURNED: `${transaction.coin && transaction.coin.toUpperCase()} Sent`,
  }[transaction.type];
}

function getBadge(transaction) {
  return {
    TRANSFER_PENDING: <Badge color={COLORS.yellow} text="Pending" />,
    TRANSFER_CLAIMED: <Badge color={COLORS.yellow} text="Claimed" />,
    TRANSFER_SENT: <Badge color={COLORS.green} text="Sent" />,
    TRANSFER_RECEIVED: <Badge color={COLORS.green} text="Received" />,
    TRANSFER_RETURNED: <Badge color={COLORS.blue} text="Returned" />,
  }[transaction.type];
}

function getIcon(transaction, supportedCurrencies) {
  const coin = supportedCurrencies.filter(sc => sc.short.toLowerCase() === transaction.coin)[0];
  const coinIcon = <Image source={{ uri: coin.image_url }} style={TransactionDetailsStyle.coinType}/>;

  return coinIcon;
}

function getSmallIcon(transaction) {
  return {
    INTEREST: (
      <View style={[{ height: 32, width: 32, borderRadius: 16, backgroundColor: COLORS.blue, paddingLeft: 3, alignItems: 'center', justifyContent: 'center' }]}>
        <Icon name='InterestIcon' height='24' width='24' viewBox="0 0 30 15" fill={STYLES.WHITE_TEXT_COLOR} />
      </View>
    ),
    COLLATERAL: (
      <View style={[{ height: 32, width: 32, borderRadius: 16, backgroundColor: COLORS.blue, paddingLeft: 3, alignItems: 'center', justifyContent: 'center' }]}>
        <Icon name='Lock' width='18' height='18' fill={STYLES.WHITE_TEXT_COLOR} />
      </View>
    ),
    DEPOSIT_PENDING: <Icon name="ReceiveArrow" fill={COLORS.yellow} stroke='white' height='32' width='32' viewBox="0 0 32 32"/>,
    DEPOSIT_CONFIRMED: <Icon name="ReceiveArrow" fill={COLORS.green} stroke='white' height='32' width='32' viewBox="0 0 32 32"/>,
    WITHDRAWAL_PENDING: <Icon name="SentArrow" fill={COLORS.yellow} stroke='white' height='32' width='32' viewBox="0 0 32 32"/>,
    WITHDRAWAL_CONFIRMED: <Icon name="SentArrow" fill={COLORS.red} stroke='white' height='32' width='32' viewBox="0 0 32 32"/>,
  }[transaction.type];
}

function getStatusText(transaction) {
  return {
    DEPOSIT_PENDING: <Text style={[TransactionDetailsStyle.info, { color: COLORS.yellow }]}>In Progress</Text>,
    DEPOSIT_CONFIRMED: <Text style={[TransactionDetailsStyle.info, { color: COLORS.green }]}>Received</Text>,
    WITHDRAWAL_PENDING: <Text style={[TransactionDetailsStyle.info, { color: COLORS.yellow }]}>In Progress</Text>,
    WITHDRAWAL_CONFIRMED: <Text style={[TransactionDetailsStyle.info, { color: COLORS.red }]}>Withdrawn</Text>,
    INTEREST: <Text style={[TransactionDetailsStyle.info, { color: COLORS.green }]}>Received</Text>,
    COLLATERAL: <Text style={[TransactionDetailsStyle.info, { color: COLORS.red }]}>Locked</Text>,
    TRANSFER_PENDING: <Text style={[TransactionDetailsStyle.info, { color: COLORS.yellow }]}>• Not claimed</Text>,
    TRANSFER_CLAIMED: <Text style={[TransactionDetailsStyle.info, { color: COLORS.yellow }]}>• Verifying user</Text>,
    TRANSFER_SENT: <Text style={[TransactionDetailsStyle.info, { color: COLORS.green }]}>• Funds sent</Text>,
    TRANSFER_RECEIVED: <Text style={[TransactionDetailsStyle.info, { color: COLORS.green }]}>• Funds received</Text>,
    TRANSFER_RETURNED: <Text style={[TransactionDetailsStyle.info]}>• Returned</Text>,
  }[transaction.type];
}

function getBlockExplorerLink(transaction) {
  return {
    eth: { link: `https://etherscan.io/tx/${ transaction.transaction_id }`, text: 'etherscan'},
    btc: { link: `https://blockchain.info/btc/tx/${ transaction.transaction_id }`, text: 'blockchain'},
    bch: { link: `https://blockdozer.com/tx/${ transaction.transaction_id }`, text: 'blockdozer'},
    ltc: { link: `https://chainz.cryptoid.info/ltc/tx.dws?${ transaction.transaction_id }`, text: 'chainz'},
    xrp: { link: `https://xrpcharts.ripple.com/#/transactions/${ transaction.transaction_id }`, text: 'xrpcharts'},
    cel: { link: `https://etherscan.io/tx/${ transaction.transaction_id }`, text: 'etherscan'},
    omg: { link: `https://etherscan.io/tx/${ transaction.transaction_id }`, text: 'etherscan'},
  }[transaction.coin];
}

function getSections(transaction) {
  return {
    DEPOSIT_PENDING: ['date', 'time', 'status', 'address:from', 'explorer'],
    DEPOSIT_CONFIRMED: ['date', 'time', 'status', 'address:from', 'explorer'],
    WITHDRAWAL_PENDING: ['date', 'time', 'status', 'address:to', 'explorer'],
    WITHDRAWAL_CONFIRMED: ['date', 'time', 'status', 'address:to', 'explorer'],
    INTEREST: ['date', 'time', 'status', 'hippo'],
    COLLATERAL: ['date', 'time'],
    TRANSFER_PENDING: ['info', 'date', 'time', 'status', 'transfer-link'],
    TRANSFER_CLAIMED: ['sent:to', 'date', 'time', 'status'],
    TRANSFER_SENT: ['sent:to', 'date', 'time', 'status'],
    TRANSFER_RECEIVED: ['received:from', 'date', 'time', 'status'],
    TRANSFER_RETURNED: ['sent:to', 'date', 'time', 'status'],
  }[transaction.type];
}

@connect(
  state => ({
    nav: state.nav,
    user: state.users.user,
    supportedCurrencies: state.generalData.supportedCurrencies,
    callsInProgress: state.api.callsInProgress,
    transaction: state.wallet.transactions[state.wallet.activeTransactionId],
    activeTransactionId: state.wallet.activeTransactionId,
    currencyRatesShort: state.generalData.currencyRatesShort,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class TransactionDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      type: '',
      heading: '',
      badge: undefined,
      icon: undefined,
      smallIcon: undefined,
      status: '',
      sections: [],
    }
  }
  // lifecycle methods
  componentDidMount() {
    const { actions, navigation, activeTransactionId } = this.props;
    actions.getSupportedCurrencies();
    const transactionId = navigation.getParam('id');
    actions.getTransactionDetails(transactionId || activeTransactionId);
  }

  async componentWillReceiveProps(nextProps) {
    const { transaction, supportedCurrencies } = nextProps;

    if (transaction) {
      const type = transaction.type;
      const branchLink = await this.createTransferBranchLink();
      this.setState({
        type,
        heading: getHeading(transaction),
        badge: getBadge(transaction),
        icon: getIcon(transaction, supportedCurrencies),
        smallIcon: getSmallIcon(transaction),
        status: getStatusText(transaction),
        sections: getSections(transaction) || [],
        branchLink,
      })
    }
  }

  createTransferBranchLink = async () => {
    const { transaction, user } = this.props;
    if (transaction.type && transaction.type !== TRANSACTION_TYPES.TRANSFER_PENDING) return;

    const branchLink = await createBUO(
      `transfer:${transaction.transfer_data.hash}`,
      {
        locallyIndex: true,
        title: `You received ${transaction.amount} ${transaction.coin.toUpperCase()}`,
        contentImageUrl: 'https://image.ibb.co/kFkHnK/Celsius_Device_Mock_link.jpg',
        contentDescription: 'Click on the link to get your money!',
        contentMetadata: {
          customMetadata: {
            amount: transaction.amount,
            coin: transaction.coin,
            from_name: `${user.first_name} ${user.last_name}`,
            from_profile_picture: user.profile_picture,
            transfer_hash: transaction.transfer_data.hash,
            link_type: BRANCH_LINKS.TRANSFER,
          }
        }
      },
      user.email
    );

  return branchLink;
  }

  cameFromWithdrawalTransaction = routes => routes.reduce((hasRoute, route) => hasRoute || route.routeName === 'TransactionConfirmation' || route.routeName === 'EnterPasscode', false);

  renderLoader = (showBackButton) => (
    <BasicLayout
      bottomNavigation
    >
      <MainHeader backButton={showBackButton}/>
      <CelHeading text="Transaction details..." />
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Loader/>
      </View>
    </BasicLayout>
  )

  renderSection = (sectionType) => {
    const { ENV } = Constants;
    const { type, branchLink } = this.state;
    const { transaction, currencyRatesShort, actions } = this.props;
    let shouldRenderSection;
    switch(sectionType) {
      case 'info':
        return <InfoSection key={sectionType} transaction={transaction} />;
      case 'date':
        return <BasicSection key={sectionType} label="Date" value={moment(transaction.time).format("D MMM YYYY")} />;
      case 'time':
        return <BasicSection key={sectionType} label="Time" value={moment.utc(transaction.time).format("HH:mm A")} />;
      case 'status':
        return <StatusSection key={sectionType} type={type} transaction={transaction} />;
      case 'address:to':
        return transaction.to_address && <AddressSection key={sectionType} address={transaction.to_address} text="To"/>;
      case 'address:from':
        return transaction.from_address && <AddressSection key={sectionType} address={transaction.from_address} text="From"/>;
      case 'sent:to':
        return transaction.transfer_data.claimer && <ContactSection key={sectionType} contact={transaction.transfer_data.claimer} text="Sent to"/>;
      case 'received:from':
        return <ContactSection key={sectionType} contact={transaction.transfer_data.sender} text="Received from"/>;
      case 'transfer-link':
        return branchLink && (
          <LinkSection
            key={sectionType}
            transaction={transaction}
            url={branchLink.url}
            onPress={() => actions.openModal(MODALS.TRANSACTION_OPTIONS)}
          />
        );
      case 'explorer':
        shouldRenderSection = ['PRODUCTION', 'PREPROD'].indexOf(ENV) !== -1 && transaction.transaction_id;
        return  shouldRenderSection && <BlockExplorerSection key={sectionType} transaction={transaction}/>;
      case 'hippo':
        return <HippoSection key={sectionType} transaction={transaction} currencyRatesShort={currencyRatesShort} />;
      default:
        return null;
    }
  }

  render() {
    const { sections, heading, icon, smallIcon, badge, branchLink } = this.state;
    const { supportedCurrencies, transaction, actions, currencyRatesShort, nav, callsInProgress } = this.props;

    const showBackButton = !this.cameFromWithdrawalTransaction(nav.routes);
    const isLoading = apiUtil.areCallsInProgress([API.GET_TRANSACTION_DETAILS], callsInProgress);
    if (
      !supportedCurrencies || !transaction || isLoading ||
      (transaction.type === TRANSACTION_TYPES.TRANSFER_PENDING && !branchLink && Constants.appOwnership === 'standalone')
    ) return this.renderLoader(showBackButton);

    const coin = supportedCurrencies.filter(sc => sc.short.toLowerCase() === transaction.coin)[0];
    const letterSize = transaction.amount_usd && transaction.amount_usd.toString().length >= 10 ? FONT_SCALE * 32 : FONT_SCALE * 36;
    const amountUsd = transaction.amount_usd ? transaction.amount_usd : transaction.amount * currencyRatesShort[transaction.coin];

    console.log({ badge, smallIcon, icon, type: transaction.type })

    return (
      <BasicLayout
        bottomNavigation
      >
        <MainHeader backButton={showBackButton}/>
        <CelHeading text={heading} />

        <CelScreenContent padding={"0 0 0 0"}>
          <View style={TransactionDetailsStyle.inputWrapper}>
            <View style={TransactionDetailsStyle.amountStatus}>
              <View style={TransactionDetailsStyle.amount}>
                { badge }
                <Text
                  style={[TransactionDetailsStyle.fiatAmount, {fontSize: letterSize}]}
                >
                  { formatter.usd(amountUsd) }
                </Text>
                <Text style={TransactionDetailsStyle.cryptoAmount}>{ formatter.crypto(transaction.amount, coin.short, { precision: 5 }) }</Text>
              </View>

              <View style={TransactionDetailsStyle.imageWrapper}>
                { icon }
                { smallIcon && <View style={TransactionDetailsStyle.iconBackground}>{smallIcon}</View> }
              </View>
            </View>
          </View>

          { sections.map(this.renderSection) }

          <CelButton
            onPress={() => actions.navigateTo('Home', true)}
            margin='10 36 0 36'
          >
            Close
          </CelButton>
        </CelScreenContent>

        { branchLink && transaction.type === TRANSACTION_TYPES.TRANSFER_PENDING && <TransactionOptionsModal link={branchLink.url} hash={transaction.transfer_data.hash} />}
      </BasicLayout>
    );
  }
}

export default TransactionDetails;

const BasicSection = ({ label, value }) => (
  <View style={TransactionDetailsStyle.infoDetail}>
    <View style={TransactionDetailsStyle.row}>
      <Text style={TransactionDetailsStyle.text}>{ label }:</Text>
      <Text style={TransactionDetailsStyle.info}>{ value }</Text>
    </View>
    <Separator/>
  </View>
)

const StatusSection = ({ transaction }) => (
  <View style={TransactionDetailsStyle.infoDetail}>
    <View style={TransactionDetailsStyle.row}>
      <Text style={TransactionDetailsStyle.text}>Status:</Text>
      { getStatusText(transaction) }
    </View>
    <Separator/>
  </View>
)

function getInfoSectionText(transaction) {
  return {
    TRANSFER_PENDING: 'This transaction is connected to the link you\'ve shared to a friend. If nobody accepts this transaction within 7 days the money will get back to you.',
  }[transaction.type];
}

const InfoSection = ({ transaction }) => (
  <View style={{ marginHorizontal: 30 }}>
    <InfoBubble
      color="gray"
      renderContent={(textStyles) => (
        <View>
          <Text style={textStyles}>
            { getInfoSectionText(transaction) }
          </Text>
        </View>
      )}
    />
  </View>
)

const LinkSection = ({ url, onPress }) => (
  <TouchableOpacity
    style={TransactionDetailsStyle.infoDetail}
    onPress={onPress}
  >
    <View style={[TransactionDetailsStyle.row, { flexDirection: 'column' }]}>
      <Text style={TransactionDetailsStyle.text}>Transaction link:</Text>
      <Text
        style={[TransactionDetailsStyle.info, {
          textAlign: "left",
          fontFamily: "inconsolata-regular",
          marginBottom: 5,
          color: COLORS.blue,
        }]}
      >
        { url }
      </Text>
    </View>
    <Separator/>
  </TouchableOpacity>
)

const BlockExplorerSection = ({ transaction }) => (
  <View style={TransactionDetailsStyle.infoDetail}>
    <TouchableOpacity
      style={[TransactionDetailsStyle.row, { alignItems: 'flex-start' }]}
      onPress={() => Linking.openURL(getBlockExplorerLink(transaction).link)}>
      <Text
        style={TransactionDetailsStyle.info}
      >
        View on {getBlockExplorerLink(transaction).text}
      </Text>
      <Icon name='NewWindowIcon' height='17' width='17' fill={COLORS.blue}/>
    </TouchableOpacity>
    <Separator/>
  </View>
)

const AddressSection = ({ text, address }) => (
  <View style={[TransactionDetailsStyle.infoDetail, { marginBottom: 20 }]}>
    <View style={{ flexDirection: "column" }}>
      <Text style={[TransactionDetailsStyle.text, { marginBottom: 10 }]}>
        { text }:
      </Text>
      <Text
        style={[TransactionDetailsStyle.info, {
          textAlign: "left",
          fontFamily: "inconsolata-regular",
          marginBottom: 5
        }]}
      >
        { address }
      </Text>
    </View>
  </View>
)

const ContactSection = ({ text, contact }) => (
  <View style={[TransactionDetailsStyle.infoDetail, { marginBottom: 20 }]}>
    <View style={[TransactionDetailsStyle.row, { flexDirection: 'column' }]}>
      <Text style={[TransactionDetailsStyle.text, { marginBottom: 10 }]}>
        { text }:
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{ uri: contact.profile_picture || 'https://api.staging.celsius.network/profile-images/avatar/avatar-cat.jpg' }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 20 }}
        />

        <Text style={TransactionDetailsStyle.info}>
          { contact.first_name } { contact.last_name }
        </Text>
      </View>
    </View>
    <Separator/>
  </View>
)

const HippoSection = ({ transaction, currencyRatesShort }) => {
  const amountUsd = transaction.amount_usd ? transaction.amount_usd : transaction.amount * currencyRatesShort[transaction.coin];
  const currentInterestAmount = transaction.amount * currencyRatesShort[transaction.coin];
  const interestChangePercentage = (currentInterestAmount / amountUsd - 1) * 100;
  const interestChangePositive = interestChangePercentage > 0;
  const interestChangeStyle = {
    color: COLORS.yellow,
  };

  if (interestChangePositive) {
    interestChangeStyle.color = COLORS.green;
  }
  return (
    <View style={TransactionDetailsStyle.hippoInfoWrapper}>
      <HippoBubble
        bubbleContent={textStyle =>
          <View>
            <View style={[TransactionDetailsStyle.interestValueTextWrapper, {marginBottom: 10}]}>
              <Text style={textStyle}>Initial interest value</Text>
              <Text style={[textStyle, globalStyles.boldText]}>{ formatter.usd(amountUsd) }</Text>
            </View>
            <View style={TransactionDetailsStyle.interestValueTextWrapper}>
              <Text style={textStyle}>Today's value</Text>
              <Text style={[textStyle, globalStyles.boldText]}>{ formatter.usd(currentInterestAmount) }</Text>
            </View>
          </View>
        }
        sideContent={textStyle =>
          <View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              {interestChangePositive && <Triangle direction="up" color={COLORS.green}/>}
              {(!interestChangePositive && !!interestChangePercentage) && <Triangle direction="down" color={COLORS.yellow}/>}
              <Text style={[textStyle, globalStyles.boldText, interestChangeStyle]}>{Math.abs(interestChangePercentage).toFixed(2)}%</Text>
              <Text style={textStyle}> change</Text>
            </View>
            <Text style={textStyle}>in value since the time of depositing CEL to your wallet.</Text>
          </View>
        }/>
    </View>
  )
}
