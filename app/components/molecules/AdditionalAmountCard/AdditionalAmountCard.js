import React, { Component } from "react";
import PropTypes from "prop-types";
import Card from "../../atoms/Card/Card";
import CelText from "../../atoms/CelText/CelText";
import formatter from "../../../utils/formatter";

class AdditionalAmountCard extends Component {
  static propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    additionalUsd: PropTypes.string,
    additionalCryptoAmount: PropTypes.string,
    coin: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.instanceOf(Object),
      PropTypes.number,
    ]),
  };
  static defaultProps = {
    coin: "USDC",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      color,
      additionalUsd,
      additionalCryptoAmount,
      text,
      coin,
      style,
    } = this.props;

    return (
      <Card styles={style} color={color}>
        <CelText
          color={"white"}
          align={"left"}
          weight={"600"}
          type={"H3"}
        >{`${formatter.fiat(additionalUsd, "USD")}`}</CelText>
        <CelText color={"white"} align={"left"} weight={"300"} type={"H6"}>
          <CelText color={"white"} align={"left"} type={"H6"}>
            {`${formatter.crypto(additionalCryptoAmount, coin)} `}
          </CelText>
          {text}
        </CelText>
      </Card>
    );
  }
}

export default AdditionalAmountCard;
