import React from "react";

import InfoModal from "../InfoModalNew/InfoModal.js";
// import GetCoinsInfoModalStyle from "./GetCoinsInfoModal.styles";
import { MODALS } from "../../../constants/UI";

class GetCoinsInfoModal extends React.Component {
  goNext = () => {
    const { actions } = this.props;

    actions.closeModal();
  };

  render() {
    return (
      <InfoModal
        name={MODALS.GET_COINS_INFO_MODAL}
        heading={"Buy Crypto Instantly!"}
        paragraphs={[
          "You can purchase crypto with a credit card or bank transfer at the best rates in the industry directly through your Celsius app.",
          "* Celsius does not charge any fees for the purchase of Coins.",
          "** Our partner Simplex charges 3.5% or $10 minimum fee that is included in the price you see. Our partner Wyre charges a fee of 0.1% and Coinify charges 1%.",
        ]}
        yesCopy={"Buy Coins"}
        onYes={this.goNext}
        picture={require("../../../../assets/images/icons/get-coin-modal.png")}
        darkPicture={require("../../../../assets/images/icons/get-coin-modal-dark.png")}
        pictureDimensions={{ height: 40, width: 40 }}
      />
    );
  }
}

export default GetCoinsInfoModal;
