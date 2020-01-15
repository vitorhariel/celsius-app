import React from "react";

import InfoModal from "../InfoModalNew/InfoModal.js";
import CelPayInfoModalStyle from "./CelPayInfoModal.styles";
import { MODALS } from "../../../constants/UI";

const CelPayInfoModal = props => {
  const style = CelPayInfoModalStyle(props.theme);
  const { close } = props;
  return (
    <InfoModal
      picture={require("../../../../assets/images/icon-send.png")}
      pictureDimensions={{ width: 30, height: 30 }}
      style={style.container}
      name={MODALS.CELPAY_INFO_MODAL}
      heading={"Send up to 2500$ worth of crypto directly to your contacts"}
      paragraphs={[
        "You do not need to know the recepient’s wallet address. You can send it through various share options.",
      ]}
      yesCopy={"Start CelPay"}
      onYes={close}
    />
  );
};

export default CelPayInfoModal;