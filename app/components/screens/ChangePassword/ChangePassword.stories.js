import React from "react";

import ChangePassword from "./ChangePassword";
import ScreenStoryWrapper from "../../../../storybook/stories/ScreenStoryWrapper/ScreenStoryWrapper";
import mockUserStore from "../../../../celsius-app-creds/mock-data/mockUserStore";

const initialState = {
  user: {
    profile: mockUserStore.profile.testcelsiusapp,
    appSettings: mockUserStore.appSettings.testcelsiusapp,
  },
};

const regular = () => {
  return (
    <ScreenStoryWrapper
      screenName="ChangePassword"
      screen={ChangePassword}
      state={initialState}
    />
  );
};

export default {
  regular,
};
