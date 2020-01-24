import ACTIONS from "../../constants/ACTIONS";
import API from "../../constants/API";
import { apiError, startApiCall } from "../api/apiActions";
import * as NavActions from "../nav/navActions";
import { closeModal, showMessage } from "../ui/uiActions";
import usersService from "../../services/users-service";
import meService from "../../services/me-service";
import apiUtil from "../../utils/api-util";
import { setFormErrors } from "../forms/formsActions";
import { KYC_STATUSES, PRIMETRUST_KYC_STATES } from "../../constants/DATA";
import appsFlyerUtil from "../../utils/appsflyer-util";
import complianceService from "../../services/compliance-service";
import { getUserKYCStatus, isUserLoggedIn } from "../../utils/user-util";
import mixpanelAnalytics from "../../utils/mixpanel-analytics";
import kycService from "../../services/kyc-service";

// TODO move to user/profile actions
// TODO move to user/profile actions
export {
  getKYCStatus,
  updateProfileInfo,
  updateProfileAddressInfo,
  updateTaxpayerInfo,
  getKYCDocuments,
  createKYCDocs,
  sendVerificationSMS,
  verifySMS,
  getUtilityBill,
  setUtilityBill,
  startKYC,
  getPrimeTrustToULink,
  // pollKYCStatus,
};

/**
 * Updates user personal info
 * @param {Object} profileInfo
 */
function updateProfileInfo(profileInfo) {
  return async dispatch => {
    dispatch(startApiCall(API.UPDATE_USER_PERSONAL_INFO));

    try {
      const updatedProfileData = await usersService.updateProfileInfo(
        profileInfo
      );
      dispatch(updateProfileInfoSuccess(updatedProfileData.data));
      mixpanelAnalytics.kycProfileInfo();
      return {
        success: true,
      };
    } catch (err) {
      if (err.type === "Validation error") {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.UPDATE_USER_PERSONAL_INFO, err));

      return {
        success: false,
      };
    }
  };
}

/**
 * Updates user address and residency info
 * @param {Object} profileAddressInfo
 */
function updateProfileAddressInfo(profileAddressInfo) {
  return async (dispatch, getState) => {
    dispatch(startApiCall(API.UPDATE_USER_ADDRESS_INFO));
    const { formData } = getState().forms;

    try {
      const updatedProfileData = await usersService.updateProfileAddressInfo(
        profileAddressInfo
      );
      dispatch(updateProfileAddressInfoSuccess(updatedProfileData.data));

      const compliance = await complianceService.getComplianceInfo();
      dispatch({
        type: ACTIONS.GET_COMPLIANCE_INFO_SUCCESS,
        callName: API.GET_COMPLIANCE_INFO,
        complianceInfo: compliance.data.allowed_actions,
      });

      const forbiddenState =
        formData.country.name === "United States"
          ? formData.state
          : formData.country.name;
      const { kyc } = getState().compliance.app;

      if (!kyc) {
        dispatch(
          showMessage(
            "error",
            `Yikes, due to local laws and regulations, we are not allowed to support operations in ${forbiddenState}.`
          )
        );
      } else {
        dispatch(NavActions.navigateTo("KYCVerifyIdentity"));
      }
      mixpanelAnalytics.kycAddressInfo();
      return {
        success: true,
      };
    } catch (err) {
      if (err.type === "Validation error") {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.UPDATE_USER_ADDRESS_INFO, err));
      return {
        success: false,
      };
    }
  };
}

/**
 * Updates user Taxpayer info
 * @param {Object} profileTaxpayerInfo
 */
function updateTaxpayerInfo(profileTaxpayerInfo) {
  return async dispatch => {
    dispatch(startApiCall(API.UPDATE_USER_TAXPAYER_INFO));
    try {
      const updatedProfileData = await usersService.updateProfileTaxpayerInfo(
        profileTaxpayerInfo
      );
      await dispatch(updateProfileTaxpayerInfoSuccess(updatedProfileData.data));
      mixpanelAnalytics.kycTaxPayerInfo();
      return {
        success: true,
      };
    } catch (err) {
      if (err.type === "Validation error") {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.UPDATE_USER_TAXPAYER_INFO, err));
      return {
        success: false,
      };
    }
  };
}

/**
 * @TODO add JSDoc
 */
export function updateProfileInfoSuccess(personalInfo) {
  return {
    type: ACTIONS.UPDATE_USER_PERSONAL_INFO_SUCCESS,
    callName: API.UPDATE_USER_PERSONAL_INFO,
    personalInfo,
  };
}

/**
 * @TODO add JSDoc
 */
function updateProfileAddressInfoSuccess(addressInfo) {
  return {
    type: ACTIONS.UPDATE_USER_ADDRESS_INFO_SUCCESS,
    callName: API.UPDATE_USER_ADDRESS_INFO,
    addressInfo,
  };
}

/**
 * @TODO add JSDoc
 */
function updateProfileTaxpayerInfoSuccess(taxpayerInfo) {
  return {
    type: ACTIONS.UPDATE_USER_TAXPAYER_INFO_SUCCESS,
    callName: API.UPDATE_USER_TAXPAYER_INFO,
    taxpayerInfo,
  };
}

/**
 * Gets users KYC documents
 * @param {Object} documents
 */
function getKYCDocuments(documents) {
  return async dispatch => {
    dispatch(startApiCall(API.GET_KYC_DOCUMENTS));
    try {
      const res = await meService.getKYCDocuments(documents);
      dispatch(getKYCDocumentsSuccess(res.data));
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_KYC_DOCUMENTS, err));
    }
  };
}

/**
 * @TODO add JSDoc
 */
function getKYCDocumentsSuccess(documents) {
  return {
    type: ACTIONS.GET_KYC_DOCUMENTS_SUCCESS,
    callName: API.GET_KYC_DOCUMENTS,
    documents,
  };
}

/**
 * @TODO add JSDoc
 */
function createKYCDocumentsSuccess() {
  return {
    type: ACTIONS.CREATE_KYC_DOCUMENTS_SUCCESS,
    callName: API.CREATE_KYC_DOCUMENTS,
  };
}

/**
 * Sends phone verification SMS to user
 */
function sendVerificationSMS(phone) {
  return async dispatch => {
    dispatch(startApiCall(API.SEND_VERIFICATION_SMS));
    try {
      await meService.sendVerificationSMS(phone);
      dispatch(sendVerificationSMSSuccess());
      dispatch(
        showMessage(
          "success",
          "Check you inbox, your verification SMS has been sent!"
        )
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.SEND_VERIFICATION_SMS, err));
    }
  };
}

/**
 * @TODO add JSDoc
 */
function sendVerificationSMSSuccess() {
  return {
    type: ACTIONS.SEND_VERIFICATION_SMS_SUCCESS,
    callName: API.SEND_VERIFICATION_SMS,
  };
}

/**
 * Verifies the code received by SMS
 * @param {string} verificationCode - eg: 123456
 */
function verifySMS(verificationCode) {
  return async dispatch => {
    dispatch(startApiCall(API.VERIFY_SMS));
    try {
      await meService.verifySMS(verificationCode);
      dispatch(verifySMSSuccess());
      return {
        success: true,
      };
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.VERIFY_SMS, err));
    }
  };
}

/**
 * @TODO add JSDoc
 */
export function verifySMSSuccess() {
  return {
    type: ACTIONS.VERIFY_SMS_SUCCESS,
    callName: API.VERIFY_SMS,
  };
}

/**
 * @TODO add JSDoc
 */
let timeout;
function createKYCDocs() {
  return async (dispatch, getState) => {
    dispatch(startApiCall(API.CREATE_KYC_DOCUMENTS));

    try {
      const { formData } = getState().forms;
      const { kycDocuments } = getState().user;
      timeout = setTimeout(() => {
        dispatch(
          showMessage("info", "Please be patient, this may take a bit longer.")
        );
        clearTimeout(timeout);
      }, 5000);

      const docType = formData.documentType || kycDocuments.type;
      const res = await meService.createKYCDocuments({
        front: formData.front,
        back: docType !== "passport" ? formData.back : undefined,
        type: docType || kycDocuments,
      });

      dispatch(createKYCDocumentsSuccess(res.data));
      dispatch(showMessage("success", "Successfully submitted KYC Documents!"));

      if (formData.state && PRIMETRUST_KYC_STATES.includes(formData.state)) {
        dispatch(NavActions.navigateTo("KYCAddressProof"));
      } else {
        dispatch(NavActions.navigateTo("KYCTaxpayer"));
      }

      clearTimeout(timeout);

      mixpanelAnalytics.kycDocumentsSubmitted();
    } catch (err) {
      clearTimeout(timeout);
      if (err.type === "Validation error") {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.CREATE_KYC_DOCUMENTS, err));
    }
  };
}

/**
 * @TODO add JSDoc
 */
function startKYC() {
  return async dispatch => {
    dispatch(startApiCall(API.START_KYC));

    try {
      await meService.startKYC();

      dispatch(showMessage("success", "KYC data successfully submitted!"));
      dispatch(NavActions.navigateTo("WalletLanding"));

      dispatch(startKYCSuccess());

      appsFlyerUtil.kycStarted();
      mixpanelAnalytics.kycStarted();
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.START_KYC, err));
    }
  };
}

/**
 * @TODO add JSDoc
 */
function startKYCSuccess() {
  return {
    type: ACTIONS.START_KYC_SUCCESS,
    kyc: {
      status: KYC_STATUSES.pending,
    },
  };
}

/**
 * Gets KYC status for user
 */
function getKYCStatus() {
  return async (dispatch, getState) => {
    const status = getUserKYCStatus();
    const isLoggedIn = isUserLoggedIn();
    const appInitialized = getState().app.appInitialized;
    const activeScreen = getState().nav.activeScreen;

    if (!isLoggedIn || !appInitialized || activeScreen === "VerifyProfile")
      return;

    dispatch(startApiCall(API.GET_KYC_STATUS));
    try {
      const res = await meService.getKYCStatus();
      const newStatus = res.data.status;

      dispatch(getKYCStatusSuccess(res.data));

      if (newStatus === KYC_STATUSES.permanently_rejected) {
        dispatch(closeModal());
        return dispatch(NavActions.navigateTo("KYCFinalRejection"));
      }

      if (newStatus !== status) {
        dispatch(closeModal());
        if (newStatus === KYC_STATUSES.passed) {
          return dispatch(NavActions.navigateTo("WalletLanding"));
        }

        if (newStatus === KYC_STATUSES.rejected) {
          return dispatch(NavActions.navigateTo("WalletLanding"));
        }
      }
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_KYC_STATUS, err));
    }
  };
}

/**
 * @TODO add JSDoc
 */
function getKYCStatusSuccess(status) {
  return {
    type: ACTIONS.GET_KYC_STATUS_SUCCESS,
    kyc: status,
  };
}

function getUtilityBill() {
  return async dispatch => {
    dispatch(startApiCall(API.GET_UTILITY_BILL));
    try {
      const res = await kycService.getUtilityBill();
      dispatch(getUtilityBillSuccess(res.data));
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_UTILITY_BILL, err));
    }
  };
}

function getUtilityBillSuccess(utilityBill) {
  return {
    type: ACTIONS.GET_UTILITY_BILL_SUCCESS,
    utilityBill,
  };
}

/**
 * Gets KYC Utility Bill photo
 *
 * @params {Object} - utilityBillPhoto
 */
function setUtilityBill(utilityBillPhoto) {
  return async dispatch => {
    dispatch(startApiCall(API.SET_UTILITY_BILL));
    try {
      timeout = setTimeout(() => {
        dispatch(
          showMessage("info", "Please be patient, this may take a bit longer.")
        );
        clearTimeout(timeout);
      }, 5000);

      await kycService.setUtilityBill(utilityBillPhoto);

      dispatch(setUtilityBillSuccess());
      dispatch(NavActions.navigateTo("KYCTaxpayer"));
      dispatch(showMessage("success", "Utility bill submitted successfully!"));

      mixpanelAnalytics.kycUtilityBillSubmitted();
    } catch (err) {
      clearTimeout(timeout);
      if (err.type === "Validation error") {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.SET_UTILITY_BILL, err));
    }
  };
}

function setUtilityBillSuccess() {
  return {
    type: ACTIONS.SET_UTILITY_BILL_SUCCESS,
  };
}

/**
 * Gets PrimeTrust ToU link
 *
 */
function getPrimeTrustToULink() {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_PRIMETRUST_TOU_LINK));
      const res = await kycService.getPrimeTrustToULink();
      dispatch(getPrimeTrustToULinkSuccess(res.data));
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_PRIMETRUST_TOU_LINK, err));
    }
  };
}

function getPrimeTrustToULinkSuccess(data) {
  return {
    type: ACTIONS.GET_PRIMETRUST_TOU_LINK_SUCCESS,
    link: data.link,
  };
}
