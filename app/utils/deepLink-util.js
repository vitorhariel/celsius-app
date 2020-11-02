import { DEEP_LINKS, STORAGE_KEYS } from "../constants/DATA";
import { getSecureStoreKey, setSecureStoreKey, deleteSecureStoreKey } from "./storage-util";
import * as actions from "../redux/actions";
import store from "../redux/store";

export { addDeepLinkData, handleDeepLink };

async function addDeepLinkData(deepLinkData) {
  console.log('deepLinkData: ', deepLinkData)
  const deepLink = JSON.stringify(deepLinkData)
  await setSecureStoreKey(STORAGE_KEYS.DEEPLINK_DATA, deepLink)
}

async function handleDeepLink() {
    const deepLink  = await getSecureStoreKey(STORAGE_KEYS.DEEPLINK_DATA);
    const deepLinkData = JSON.parse(deepLink)
    console.log('handleDeepLInkData: ', deepLinkData)
    const user = store.getState().user.profile;
    if (deepLinkData) {
      if (!deepLinkData.type) return;

      switch (deepLinkData.type) {
        case DEEP_LINKS.NAVIGATE_TO:
          if (!user.id) return;

          store.dispatch(actions.resetToScreen(deepLinkData.screen));
          clearDeepLinkData();
          return;

        case DEEP_LINKS.TRANSFER:
        case DEEP_LINKS.INDIVIDUAL_REFERRAL:
        case DEEP_LINKS.COMPANY_REFERRAL:
          store.dispatch(actions.registerBranchLink(deepLinkData));
          clearDeepLinkData()
          return;

        default:
          return;
      }
    }
}

async function clearDeepLinkData() {
  await deleteSecureStoreKey(STORAGE_KEYS.DEEPLINK_DATA)
  console.log('clearDeepLink')
}
