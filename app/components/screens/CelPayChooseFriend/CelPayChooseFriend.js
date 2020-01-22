import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View } from "react-native";
import Contacts from "react-native-contacts";

import * as appActions from "../../../redux/actions";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import CelText from "../../atoms/CelText/CelText";
import {
  requestForPermission,
  ALL_PERMISSIONS,
} from "../../../utils/device-permissions";
import CelButton from "../../atoms/CelButton/CelButton";
import ContactList from "../../molecules/ContactList/ContactList";
import logger from "../../../utils/logger-util";
import ProgressBar from "../../atoms/ProgressBar/ProgressBar";
import API from "../../../constants/API";
import apiUtil from "../../../utils/api-util";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Spinner from "../../atoms/Spinner/Spinner";
import CircleButton from "../../atoms/CircleButton/CircleButton";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";
import { CEL_PAY_TYPES } from "../../../constants/UI";

const loadingText =
  "Your contacts are being imported. This make take a couple of minutes, so we'll let you know once the import is complete. \n" +
  "\n" +
  "Only contacts with Celsius accounts will appear in this list. You can CelPay any of your friends at any time by sharing a unique CelPay link."

@connect(
  state => ({
    contacts: state.contacts.contacts,
    callsInProgress: state.api.callsInProgress,
    formData: state.forms.formData,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class CelPayChooseFriend extends Component {
  static navigationOptions = () => ({
    title: "Choose a Celsian to CelPay",
    right: "search",
  });

  constructor(props) {
    super(props);
    this.state = {
      hasContactPermission: false,
      loadingContacts: false,
      totalContacts: 0,
      loadedContacts: 0,
      hasImportedContacts: false,
    };
  }

  async componentDidMount() {
    const { actions } = this.props;

    try {
      await actions.getContacts();
      const permission = await requestForPermission(ALL_PERMISSIONS.CONTACTS);

      this.setState({
        hasContactPermission: permission,
      });
    } catch (err) {
      logger.log({ err });
    }
  }

  getDeviceContacts = () => {
    return new Promise((resolve, reject) => {
      const data = [];
      Contacts.getAll((err, contacts) => {
        if (!err) {
          contacts.map(contact => {
            const c = {
              name: `${contact.givenName} ${contact.familyName}`,
              phoneNumbers: contact.phoneNumbers,
              emails: contact.emailAddresses,
            };
            return data.push(c);
          });
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  };

  importContacts = async () => {
    const { actions } = this.props;
    try {
      const permission = await requestForPermission(ALL_PERMISSIONS.CONTACTS);
      if (permission) {
        this.setState({ loadingContacts: true });
        const phoneContacts = await this.getDeviceContacts();

        let loadedContacts = 0;
        this.setState({ totalContacts: phoneContacts.length, loadedContacts });

        let position = 0;
        // Set batch size for sending to BE
        const batchSize = 50;
        const contactBatches = [];
        // Slice contacts into batches
        while (position < phoneContacts.length) {
          contactBatches.push(
            phoneContacts.slice(position, position + batchSize)
          );
          position += batchSize;
        }

        // Connect batches of contacts
        for (let i = 0; i < contactBatches.length; i++) {
          await actions.connectPhoneContacts(contactBatches[i], { clearExistingContacts: i === 0 });
          loadedContacts += contactBatches[i].length;
          this.setState({ loadedContacts });
        }

        this.setState({ loadingContacts: false, hasImportedContacts: true });
        const { contacts } = this.props
        mixpanelAnalytics.importedContacts(contacts.length);
      } else {
        await requestForPermission(ALL_PERMISSIONS.CONTACTS);
      }
    } catch (err) {
      logger.log(err);
    }
  };

  sendLink = async () => {
    const { actions } = this.props;

    actions.updateFormField("friend", undefined);
    actions.navigateTo("CelPayEnterAmount");

    mixpanelAnalytics.choseCelPayType(CEL_PAY_TYPES.LINK)
  };

  handleContactPress = async contact => {
    const { actions } = this.props;

    actions.updateFormField("friend", contact);
    actions.navigateTo("CelPayEnterAmount");

    mixpanelAnalytics.choseCelPayFriend();
  };

  filterContacts = () => {
    const { contacts, formData } = this.props;
    return formData.search
      ? contacts.filter(c =>
          c.name.toLowerCase().includes(formData.search.toLowerCase())
        )
      : contacts;
  };

  hasFriends = () => this.props.contacts && this.props.contacts.length > 0;

  renderFTUX = () => {
    return (
      <RegularLayout>
        <View style={{ paddingTop: 60 }}>
          <CircleButton
            icon="Contacts"
            iconSize={28}
          />

          <CelText weight="bold" type="H2" align="center" margin="20 0 0 0">
            CelPay your way!
          </CelText>

          <CelText align="center" margin="20 0 0 0">
            Import your contacts to transfer crypto quickly and easily between friends. Only friends with the Celsius app will appear in your contacts list.
          </CelText>

          <CelButton margin="20 0 20 0" onPress={this.importContacts}>
            Import Contacts
          </CelButton>

          <CelButton margin="20 0 20 0" basic onPress={this.sendLink}>
            CelPay with a link
          </CelButton>
        </View>
      </RegularLayout>
    );
  };

  renderNoFirends = () => {
    const { search } = this.props.formData;
    const text = search
      ? `None of your friends named ${search}`
      : "None of your friends";
    return (
      <View style={{ paddingTop: 60 }}>
        <CircleButton
          icon="Contacts"
          iconSize={28}
        />

        <CelText weight="bold" type="H2" align="center" margin="25 0 0 0">
          No friends
        </CelText>

        <CelText align="center" margin="4 0 30 0">
          { text } has installed Celsius App. You can still CelPay them with a link.
        </CelText>

        <CelButton onPress={this.sendLink}>Send as link</CelButton>
      </View>
    );
  };

  renderLoadingContacts = () => {
    return (
      <RegularLayout>
        { this.renderProgressBar() }

        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <Spinner size={50} />
        </View>

        <CelText align="center" margin="20 0 16 0">
          { loadingText }
        </CelText>

        <CelButton
          onPress={this.sendLink}
          basic
        >
          Send as Link >
        </CelButton>
      </RegularLayout>
    )
  }

  renderProgressBar = () => {
    const {
      totalContacts,
      loadedContacts,
    } = this.state;

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ProgressBar
          steps={totalContacts}
          currentStep={loadedContacts}
          margin="10 0 10 0"
        />
        <CelText>
          {loadedContacts} of {totalContacts} contacts loaded
        </CelText>
      </View>

    )
  }

  render() {
    const {
      loadingContacts,
      hasImportedContacts,
    } = this.state;
    const { callsInProgress } = this.props;

    const hasFriends = this.hasFriends();
    if (
      apiUtil.areCallsInProgress([API.GET_CONNECT_CONTACTS], callsInProgress) &&
      !loadingContacts
    ) {
      return <LoadingScreen />;
    }

    if (!hasFriends && !loadingContacts && !hasImportedContacts) {
      return this.renderFTUX();
    }

    if (!hasFriends && loadingContacts) {
      return this.renderLoadingContacts();
    }

    const filteredContacts = this.filterContacts();
    return (
      <RegularLayout>
        <View style={{ flex: 1, width: "100%" }}>
          {loadingContacts
            ? this.renderProgressBar()
            : (
              <CelButton margin="15 0 15 0" onPress={this.importContacts} basic>
                Refresh contacts
              </CelButton>
            )
          }

          {filteredContacts.length ? (
            <ContactList
              contacts={filteredContacts}
              onContactPress={this.handleContactPress}
            />
          ) : (
            this.renderNoFirends()
          )}
        </View>
      </RegularLayout>
    );
  }
}

export default CelPayChooseFriend;
