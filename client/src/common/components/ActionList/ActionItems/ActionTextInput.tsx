import React from 'react';
import styled from 'styled-components/native';
import {BottomSheetTextInput as BSTextInput} from '@gorhom/bottom-sheet';
import {SPACINGS} from '../../../constants/spacings';
import textStyles from '../../Typography/styles';
import ActionItem from '../ActionItem';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import hexToRgba from 'hex-to-rgba';
import {PencilIcon} from '../../Icons';
import {Spacer8} from '../../Spacers/Spacer';

const style = ({hasError = false}) => ({
  flex: 1,
  paddingLeft: SPACINGS.SIXTEEN,
  ...textStyles.Body16,
  color: hasError ? COLORS.ERROR : undefined,
});

const attrs = ({hasError = false}) => ({
  placeholderTextColor: hasError ? hexToRgba(COLORS.ERROR, 0.5) : undefined,
});

const TextInput = styled.TextInput.attrs(attrs)(style);

const BottomSheetTextInput = styled(BSTextInput).attrs(attrs)(style);

const IconWrapper = styled.View({
  width: 21,
  height: 21,
});

const ActionTextInput: React.FC<
  React.ComponentProps<typeof TextInput>
> = props => (
  <ActionItem>
    <TextInput {...props} />
    <IconWrapper>
      <PencilIcon />
    </IconWrapper>
    <Spacer8 />
  </ActionItem>
);

export const BottomSheetActionTextInput: React.FC<
  React.ComponentProps<typeof BottomSheetTextInput>
> = props => (
  <ActionItem>
    <BottomSheetTextInput {...props} />
    <IconWrapper>
      <PencilIcon />
    </IconWrapper>
    <Spacer8 />
  </ActionItem>
);

export default ActionTextInput;
