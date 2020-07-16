import { THEMES } from "./UI";

export const COLOR_KEYS = {
  HEADER: "header",
  BACKGROUND: "background",
  CARDS: "cards",
  MODAL_OVERLAY: "modal_overlay",
  MAIN_MENU_OVERLAY: "main_menu_overlay",
  BANNER_INFO: "banner_info",
  SEPARATORS: "separators",
  PRIMARY_BUTTON: "primary_button",
  PRIMARY_BUTTON_FOREGROUND: "primary_button_foreground",
  LINK: "link",
  TAB_SELECTED: "tab_selected",
  TAB_UNSELECTED: "tab_unselected",
  HEADLINE: "headline",
  SECTION_TITLE: "section_title",
  PARAGRAPH: "paragraph",
  POSITIVE_STATE: "positive_state",
  ALERT_STATE: "alert_state",
  NEGATIVE_STATE: "negative_state",
  TOGGLE_OFF_FOREGROUND: "toggle_off_foreground",
  TOGGLE_OFF_BACKGROUND: "toggle_off_background",
  TOGGLE_ON_FOREGROUND: "toggle_on_foreground",
  TOGGLE_ON_BACKGROUND: "toggle_on_background",
  DOT_INDICATOR_ACTIVE: "dot_indicator_active",
  DOT_INDICATOR_INACTIVE: "dot_indicator_inactive",
  CIRCLE_ICON_FOREGROUND: "circle_icon_foreground",
  CIRCLE_ICON_BACKGROUND: "circle_icon_background",
  INPUT_ICON: "input_icon",
};

export const COLORS = {
  [THEMES.LIGHT]: {
    [COLOR_KEYS.HEADER]: "#FFFFFF",
    [COLOR_KEYS.BACKGROUND]: "#F3F3F3",
    [COLOR_KEYS.CARDS]: "#FFFFFF",
    [COLOR_KEYS.MODAL_OVERLAY]: "#333B43",
    [COLOR_KEYS.MAIN_MENU_OVERLAY]: "#FFFFFF",
    [COLOR_KEYS.BANNER_INFO]: "#4156A6",
    [COLOR_KEYS.SEPARATORS]: "#E0E1E2",
    [COLOR_KEYS.PRIMARY_BUTTON]: "#4156A6",
    [COLOR_KEYS.PRIMARY_BUTTON_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.LINK]: "#4156A6",
    [COLOR_KEYS.TAB_SELECTED]: "#4156A6",
    [COLOR_KEYS.TAB_UNSELECTED]: "#989DA3",
    [COLOR_KEYS.HEADLINE]: "#333B43",
    [COLOR_KEYS.SECTION_TITLE]: "#989DA3",
    [COLOR_KEYS.PARAGRAPH]: "#777E86",
    [COLOR_KEYS.POSITIVE_STATE]: "#4FB895",
    [COLOR_KEYS.ALERT_STATE]: "#E19F30",
    [COLOR_KEYS.NEGATIVE_STATE]: "#EF461A",
    [COLOR_KEYS.TOGGLE_OFF_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.TOGGLE_OFF_BACKGROUND]: "#E0E1E2",
    [COLOR_KEYS.TOGGLE_ON_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.TOGGLE_ON_BACKGROUND]: "#FFFFFF",
    [COLOR_KEYS.DOT_INDICATOR_ACTIVE]: "#989DA3",
    [COLOR_KEYS.DOT_INDICATOR_INACTIVE]: "#E0E1E2",
    [COLOR_KEYS.CIRCLE_ICON_FOREGROUND]: "#E0E1E2",
    [COLOR_KEYS.CIRCLE_ICON_BACKGROUND]: "#FFFFFF",
  },

  [THEMES.DARK]: {
    [COLOR_KEYS.HEADER]: "#22222D",
    [COLOR_KEYS.BACKGROUND]: "#0E0E0E",
    [COLOR_KEYS.CARDS]: "#22222D",
    [COLOR_KEYS.MODAL_OVERLAY]: "#22222D",
    [COLOR_KEYS.MAIN_MENU_OVERLAY]: "#0E0E0E",
    [COLOR_KEYS.BANNER_INFO]: "#5264EF",
    [COLOR_KEYS.SEPARATORS]: "#2C2C3B",
    [COLOR_KEYS.PRIMARY_BUTTON]: "#5264EF",
    [COLOR_KEYS.PRIMARY_BUTTON_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.LINK]: "#5264EF",
    [COLOR_KEYS.TAB_SELECTED]: "#5264EF",
    [COLOR_KEYS.TAB_UNSELECTED]: "#868686",
    [COLOR_KEYS.HEADLINE]: "#FFFFFF",
    [COLOR_KEYS.SECTION_TITLE]: "#868686",
    [COLOR_KEYS.PARAGRAPH]: "#B7B7B7",
    [COLOR_KEYS.POSITIVE_STATE]: "#4FB895",
    [COLOR_KEYS.ALERT_STATE]: "#E19F30",
    [COLOR_KEYS.NEGATIVE_STATE]: "#EF461A",
    [COLOR_KEYS.TOGGLE_OFF_FOREGROUND]: "#C2C2C6",
    [COLOR_KEYS.TOGGLE_OFF_BACKGROUND]: "#C2C2C6",
    [COLOR_KEYS.TOGGLE_ON_FOREGROUND]: "#C2C2C6",
    [COLOR_KEYS.TOGGLE_ON_BACKGROUND]: "#C2C2C6",
    [COLOR_KEYS.DOT_INDICATOR_ACTIVE]: "#B7B7B7",
    [COLOR_KEYS.DOT_INDICATOR_INACTIVE]: "#868686",
    [COLOR_KEYS.CIRCLE_ICON_FOREGROUND]: "#3E3E50",
    [COLOR_KEYS.CIRCLE_ICON_BACKGROUND]: "#22222D",
  },

  [THEMES.UNICORN]: {
    [COLOR_KEYS.HEADER]: "#FFFFFF",
    [COLOR_KEYS.BACKGROUND]: "#F3F3F3",
    [COLOR_KEYS.CARDS]: "#FFFFFF",
    [COLOR_KEYS.MODAL_OVERLAY]: "#222431",
    [COLOR_KEYS.MAIN_MENU_OVERLAY]: "#FFFFFF",
    [COLOR_KEYS.BANNER_INFO]: "#0C1766",
    [COLOR_KEYS.SEPARATORS]: "#E0E1E2",
    [COLOR_KEYS.PRIMARY_BUTTON]: "#E58363",
    [COLOR_KEYS.PRIMARY_BUTTON_FOREGROUND]: "#0C1766",
    [COLOR_KEYS.LINK]: "#0C1766",
    [COLOR_KEYS.TAB_SELECTED]: "#0C1766",
    [COLOR_KEYS.TAB_UNSELECTED]: "#82838E",
    [COLOR_KEYS.HEADLINE]: "#0C1766",
    [COLOR_KEYS.SECTION_TITLE]: "#82838E",
    [COLOR_KEYS.PARAGRAPH]: "#777E86",
    [COLOR_KEYS.POSITIVE_STATE]: "#76A470",
    [COLOR_KEYS.ALERT_STATE]: "#E87325",
    [COLOR_KEYS.NEGATIVE_STATE]: "#EF461A",
    [COLOR_KEYS.TOGGLE_OFF_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.TOGGLE_OFF_BACKGROUND]: "#FFFFFF",
    [COLOR_KEYS.TOGGLE_ON_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.TOGGLE_ON_BACKGROUND]: "#FFFFFF",
    [COLOR_KEYS.DOT_INDICATOR_ACTIVE]: "#989DA3",
    [COLOR_KEYS.DOT_INDICATOR_INACTIVE]: "#E0E1E2",
    [COLOR_KEYS.CIRCLE_ICON_FOREGROUND]: "#E0E1E2",
    [COLOR_KEYS.CIRCLE_ICON_BACKGROUND]: "#FFFFFF",
  },

  [THEMES.HORSE]: {
    [COLOR_KEYS.HEADER]: "#FBF6EF",
    [COLOR_KEYS.BACKGROUND]: "#FBF6EF",
    [COLOR_KEYS.CARDS]: "#FFFFFF",
    [COLOR_KEYS.MODAL_OVERLAY]: "#232A65",
    [COLOR_KEYS.MAIN_MENU_OVERLAY]: "#FFFFFF",
    [COLOR_KEYS.BANNER_INFO]: "#232A65",
    [COLOR_KEYS.SEPARATORS]: "#E0E1E2",
    [COLOR_KEYS.PRIMARY_BUTTON]: "#232A65",
    [COLOR_KEYS.PRIMARY_BUTTON_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.LINK]: "#232A65",
    [COLOR_KEYS.TAB_SELECTED]: "#232A65",
    [COLOR_KEYS.TAB_UNSELECTED]: "#9199D3",
    [COLOR_KEYS.HEADLINE]: "#232A65",
    [COLOR_KEYS.SECTION_TITLE]: "#9199D3",
    [COLOR_KEYS.PARAGRAPH]: "#5E67B0",
    [COLOR_KEYS.POSITIVE_STATE]: "#4EB584",
    [COLOR_KEYS.ALERT_STATE]: "#F0A533",
    [COLOR_KEYS.NEGATIVE_STATE]: "#F46B6B",
    [COLOR_KEYS.TOGGLE_OFF_BACKGROUND]: "#E0E1E2",
    [COLOR_KEYS.TOGGLE_OFF_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.TOGGLE_ON_BACKGROUND]: "#4EB584",
    [COLOR_KEYS.TOGGLE_ON_FOREGROUND]: "#FFFFFF",
    [COLOR_KEYS.DOT_INDICATOR_ACTIVE]: "#9919D3",
    [COLOR_KEYS.DOT_INDICATOR_INACTIVE]: "#E0E1E2",
    [COLOR_KEYS.CIRCLE_ICON_FOREGROUND]: "#E0E1E2",
    [COLOR_KEYS.CIRCLE_ICON_BACKGROUND]: "#FFFFFF",
    [COLOR_KEYS.INPUT_ICON]: "#9919D3",
  },
};
