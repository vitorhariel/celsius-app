import React, {Component} from 'react';
import { View, Image, Text } from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import * as appActions from "../../../redux/actions";
// import {STYLES} from "../../config/constants/style";
// import EnterPromoCodeModalStyle from "./EnterPromoCodeModal.styles";
import CelModal from "../../atoms/CelModal/CelModal";
import { KYC_STATUSES, MODALS } from "../../../config/constants/common";
import { GLOBAL_STYLE_DEFINITIONS as globalStyles } from "../../../config/constants/style";
import CelForm from "../../atoms/CelForm/CelForm";
import CelButton from "../../atoms/CelButton/CelButton";
import CelInput from "../../atoms/CelInput/CelInput";
import API from "../../../config/constants/API";

@connect(
  state => ({
    formData: state.ui.formData,
    formErrors: state.ui.formErrors,
    promoCodes: state.users.promoCodes,
    kycStatus: state.users.user && state.users.user.kyc ? state.users.user.kyc.status : KYC_STATUSES.collecting,
    lastCompletedCall: state.api.lastCompletedCall,
  }),
  dispatch => ({ dispatch, actions: bindActionCreators(appActions, dispatch) })
)
class EnterPromoCodeModal extends Component {
  renderFormModal() {
    const { formData, formErrors, actions } = this.props;

    return (
      <CelModal name={MODALS.ENTER_PROMO_CODE}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../../../assets/images/hodl-bear.png') }
            style={{ width: 120, height: 120 }}
            resizeMode={"contain"}
          />
        </View>

        <Text style={[globalStyles.largeHeading, { marginTop: 15, marginBottom: 10 }]}>Enter a promo code</Text>

        <Text style={[globalStyles.normalText, { textAlign: 'center' }]}>
          Receive your prize with the right promo code:
        </Text>

        <CelForm margin="10 0 10 0">
          <CelInput
            shadow
            theme="white"
            value={formData.promoCode}
            error={formErrors.promoCode}
            field="promoCode"
            labelText="Promo code"
          />
        </CelForm>

        <CelButton
          onPress={() => actions.submitPromoCode()}
          margin="30 0 0 0"
        >
          Confirm
        </CelButton>

      </CelModal>
    );
  }

  renderVerifiedSuccess() {
    const { promoCodes, actions } = this.props;

    const amountDisplay = `${promoCodes[0].amount} ${promoCodes[0].coin}`;

    return (
      <CelModal name={MODALS.ENTER_PROMO_CODE}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../../../assets/images/hodl-bear.png') }
            style={{ width: 120, height: 120 }}
            resizeMode={"contain"}
          />
        </View>

        <Text style={[globalStyles.largeHeading, { marginTop: 15, marginBottom: 10 }]}>Congrats!</Text>

        <Text style={[globalStyles.normalText, { textAlign: 'center' }]}>
          You have received {amountDisplay}. You can see it in your wallet.
        </Text>

        <CelButton
          onPress={() => actions.navigateTo('Home')}
          margin="30 0 0 0"
        >
          Go to wallet
        </CelButton>

      </CelModal>
    );
  }

  renderUnverifiedSuccess() {
    const { promoCodes, actions } = this.props;

    const amountDisplay = `${promoCodes[0].amount} ${promoCodes[0].coin}`;

    return (
      <CelModal name={MODALS.ENTER_PROMO_CODE}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../../../assets/images/hodl-bear.png') }
            style={{ width: 120, height: 120 }}
            resizeMode={"contain"}
          />
        </View>

        <Text style={[globalStyles.largeHeading, { marginTop: 15, marginBottom: 10 }]}>Congrats!</Text>

        <Text style={[globalStyles.normalText, { textAlign: 'center' }]}>
          You have received {amountDisplay}. You can see it in your wallet once you verify your profile.
        </Text>

        <CelButton
          onPress={() => actions.navigateTo('ProfileDetails')}
          margin="30 0 0 0"
        >
          Verify profile
        </CelButton>

      </CelModal>
    );

  }
  render() {
    const { kycStatus, lastCompletedCall } = this.props;

    console.log({ kycStatus });

    if (lastCompletedCall === API.SUBMIT_PROMO_CODE && kycStatus === KYC_STATUSES.passed) return this.renderVerifiedSuccess()
    if (lastCompletedCall === API.SUBMIT_PROMO_CODE && kycStatus !== KYC_STATUSES.passed) return this.renderUnverifiedSuccess()

    return this.renderFormModal()
  }
}

export default EnterPromoCodeModal;
