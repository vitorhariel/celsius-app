// import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from "../../../utils/styles-util";
import STYLES from "../../../constants/STYLES";

const base = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },
  basicCircle: {
    width: 20,
    height: 20,
    backgroundColor: STYLES.COLORS.MEDIUM_GRAY,
    borderRadius: 10,
    margin: 10
  },
  activeCircle: {
    backgroundColor: STYLES.COLORS.CELSIUS_BLUE,
  },
  lastCircle: {
    backgroundColor: STYLES.COLORS.GREEN,
  }
};

const themed = {
  light: {},

  dark: {},

  celsius: {}
};

const HiddenPinStyle = () => getThemedStyle(base, themed);

export default HiddenPinStyle;
