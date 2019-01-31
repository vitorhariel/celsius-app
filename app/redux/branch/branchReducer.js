import ACTIONS from "../../config/constants/ACTIONS";
import { BRANCH_LINKS } from "../../config/constants/common";

const initialState = {
  referralLinkId: null,
  screen: null,

  // link through which the app was opened
  registeredLink: null,
  // transferLink: null,
  // individualLink: null,
  // companyLink: null,
  promoCode: null,
};

export default function branchReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.BRANCH_LINK_REGISTERED:
      return {
        ...state,
        registeredLink: action.link,
      };

    case ACTIONS.CREATE_BRANCH_LINK_SUCCESS:
      return {
        ...state,
      };

    case ACTIONS.SUBMIT_PROMO_CODE_SUCCESS:
    case ACTIONS.GET_LINK_BY_SLUG_SUCCESS:
    case ACTIONS.GET_LINK_BY_URL_SUCCESS:
      return {
        ...state,
        registeredLink: {
          ...state.registeredLink,
          ...action.branchLink,
        }
      };

    case ACTIONS.CHECK_PROFILE_CODE_SUCCESS:
      return {
        ...state,
        promoCode: action.code,
      }

    case ACTIONS.SAVE_BRANCH_LINK_SUCCESS:
      return {
        ...state,
        referralLinkId: [BRANCH_LINKS.COMPANY_REFERRAL, BRANCH_LINKS.INDIVIDUAL_REFERRAL].indexOf(action.branchLink.link_type) !== -1 ? action.branchLink.id : state.referralLinkId,
      };

    case ACTIONS.CLEAR_BRANCH_SCREEN:
    case ACTIONS.REGISTER_NAVIGATION_LINK:
      return {
        ...state,
        screen: action.screen,
      };

    default:
      return state;
  }
}
