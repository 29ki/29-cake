import {BottomSheetTextInput as BSTextInput} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import textStyles from '../styles';

type TextInputProps = {
  hasError?: boolean;
};

const style = ({hasError = false}) => ({
  height: 44,
  paddingHorizontal: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.TWELVE,
  ...textStyles.Body16,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: 16,
  color: hasError ? COLORS.ERROR : undefined,
});

const TextInput = styled.TextInput<TextInputProps>(style);

export const BottomSheetTextInput = styled(BSTextInput)<TextInputProps>(style);

export default TextInput;
