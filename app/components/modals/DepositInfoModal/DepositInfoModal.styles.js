import { getThemedStyle } from "../../../utils/styles-util";

const base = {
  container: {
    flex: 1,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  buttonsWrapper: {
    justifyContent: "flex-end",
    marginTop: 20,
    height: 50,
  },
};

const themed = {
  light: {},

  dark: {},

  unicorn: {},
};

const DepositInfoModalStyle = () => getThemedStyle(base, themed);

export default DepositInfoModalStyle;
