import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {HKGroteskBold} from '../../constants/fonts';

import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';

const Wrapper = styled.View<{themeColor?: string; completed?: boolean}>(
  ({themeColor, completed}) => ({
    backgroundColor: completed
      ? COLORS.MEDIUM_GREEN
      : themeColor
        ? COLORS.BLACK_TRANSPARENT_15
        : COLORS.PURE_WHITE,
    paddingVertical: 1,
    paddingHorizontal: SPACINGS.EIGHT,
    borderRadius: SPACINGS.EIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  }),
);

const StatusText = styled(Body14)<{themeColor?: string}>(({themeColor}) => ({
  color: themeColor ? themeColor : COLORS.BLACK,
  fontFamily: HKGroteskBold,
  flexShrink: 1,
}));

const BadgeIcon = styled.View({
  width: 20,
  height: 20,
});

type BadgeProps = {
  IconBefore?: React.ReactNode;
  IconAfter?: React.ReactNode;
  text: string | React.ReactNode;
  themeColor?: string;
  completed?: boolean;
};

const Badge: React.FC<BadgeProps> = ({
  IconBefore,
  IconAfter,
  text,
  themeColor,
  completed = false,
}) => {
  return (
    <Wrapper themeColor={themeColor} completed={completed}>
      {IconBefore && (
        <>
          <BadgeIcon>{IconBefore}</BadgeIcon>
          <Spacer4 />
        </>
      )}
      <StatusText themeColor={themeColor} numberOfLines={1}>
        {text}
      </StatusText>
      {IconAfter && (
        <>
          <Spacer4 />
          <BadgeIcon>{IconAfter}</BadgeIcon>
        </>
      )}
    </Wrapper>
  );
};
export default React.memo(Badge);
