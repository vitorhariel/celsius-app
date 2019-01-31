import ACTIONS from "../../config/constants/ACTIONS";
import * as transfersActions from "../transfers/transfersActions";
import * as uiActions from "../ui/uiActions";
import branchService from "../../services/branch-service";
import { BRANCH_LINKS, MODALS } from "../../config/constants/common";
import API from "../../config/constants/API";
import { apiError, startApiCall } from "../api/apiActions";
import { createIndividualLinkBUO } from "../../utils/branch-util";

export {
  registerBranchLink,
  saveBranchLink,
  getBranchIndividualLink,
  getBranchLinkBySlug,
  createBranchIndividualLink,
  submitProfileCode
};

function saveBranchLink(rawLink) {
  return async (dispatch) => {
    try {
      dispatch(startApiCall(API.SAVE_BRANCH_LINK));
      const branchLink = await branchService.create(rawLink);

      dispatch({
        type: ACTIONS.SAVE_BRANCH_LINK_SUCCESS,
        branchLink: branchLink.data
      });
    } catch (err) {
      dispatch(apiError(API.SAVE_BRANCH_LINK, err));
    }
  };
}

function createBranchIndividualLink() {
  return async (dispatch) => {
    const branchLink = await createIndividualLinkBUO();
    dispatch({
      type: ACTIONS.SET_INDIVIDUAL_REFERRAL_LINK,
      link: branchLink.url
    });
  };
}

function getBranchIndividualLink() {
  return async (dispatch) => {
    try {
      dispatch(startApiCall(API.GET_INDIVIDUAL_LINK));

      const branchLinkRes = await branchService.getIndividualLink();

      dispatch({
        type: ACTIONS.GET_INDIVIDUAL_LINK_SUCCESS,
        callName: API.GET_INDIVIDUAL_LINK,
        link: branchLinkRes.data.branch_link.branch_link
      });
    } catch (err) {
      dispatch(uiActions.showMessage("error", err.msg));
      dispatch(apiError(API.GET_INDIVIDUAL_LINK, err));
    }
  };
};

function registerBranchLink(deepLink) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.BRANCH_LINK_REGISTERED,
      link: deepLink
    });

    switch (deepLink.link_type) {
      case BRANCH_LINKS.TRANSFER:
        return dispatch(transfersActions.registerTransferLink(deepLink));

      case BRANCH_LINKS.COMPANY_REFERRAL:
      case BRANCH_LINKS.INDIVIDUAL_REFERRAL:
        return dispatch(registerReferralLink(deepLink));

      case BRANCH_LINKS.NAVIGATION:
        return dispatch(registerNavigationLink(deepLink));
      default:
    }
  };
}

function registerReferralLink(deepLink) {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().users
      if (user) return dispatch(uiActions.showMessage("warning", "Sorry, but existing users can't use this link!"));

      dispatch(startApiCall(API.GET_LINK_BY_URL));

      const linkRes = await branchService.getByUrl(deepLink['~referring_link']);
      const linkResData = linkRes.data;

      if (!linkResData.valid) {
        dispatch(apiError(API.GET_LINK_BY_URL));
        dispatch(uiActions.showMessage("warning", "Sorry, but this link is not valid anymore!"));
      } else {
        dispatch({
          type: ACTIONS.GET_LINK_BY_URL_SUCCESS,
          callName: API.GET_LINK_BY_URL,
          branchLink: linkResData.branch_link
        });

        if (!linkResData.branch_link.referred_award_amount || !linkResData.branch_link.referred_award_coin) return;
        dispatch(uiActions.openModal(MODALS.REFERRAL_RECEIVED_MODAL));
      }
    } catch(err) {
      dispatch(apiError(API.GET_LINK_BY_URL, err));
      dispatch(uiActions.showMessage("error", err.msg));
    }
  }
}

function registerNavigationLink(deepLink) {
  return {
    type: ACTIONS.REGISTER_NAVIGATION_LINK,
    screen: deepLink.screen,
  }
}

function getBranchLinkBySlug() {
  return async (dispatch, getState) => {
    try {
      dispatch(startApiCall(API.GET_LINK_BY_SLUG))
      const { formData } = getState().ui;

      if (!formData.promoCode) return;

      const linkRes = await branchService.getBySlug(formData.promoCode);
      const linkResData = linkRes.data;

      if (!linkResData.valid) {
        dispatch(apiError(API.GET_LINK_BY_SLUG));
        dispatch(uiActions.showMessage("warning", "Sorry, but this promo code is not valid!"));
      } else {
        dispatch({
          type: ACTIONS.GET_LINK_BY_SLUG_SUCCESS,
          callName: API.GET_LINK_BY_SLUG,
          branchLink: linkResData.branch_link
        });
      }
    } catch(err) {
      dispatch(apiError(API.GET_LINK_BY_SLUG, err));
      dispatch(uiActions.showMessage("error", err.msg));
    }
  }
}


function submitProfileCode() {
  return async (dispatch, getState) => {
    try {
      dispatch(startApiCall(API.CHECK_PROFILE_CODE))
      const { formData } = getState().ui

      const res = await branchService.submitProfileCode(formData.promoCode);
      dispatch(submitProfileCodeSuccess(res.data.branch_link));
    } catch (err) {
      dispatch(apiError(API.CHECK_PROFILE_CODE, err));
      dispatch(uiActions.setFormErrors({
        promoCode: 'Oops, it seems that the promo code you entered is not valid. Please, try again!'
      }))
    }

  }
}

function submitProfileCodeSuccess(promoCodeInfo) {
  return {
    type: ACTIONS.CHECK_PROFILE_CODE_SUCCESS,
    callName: API.CHECK_PROFILE_CODE,
    code: promoCodeInfo
  }
}
