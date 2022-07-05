import React from 'react';
import Svg, {SvgProps} from 'react-native-svg';
import styled from 'styled-components/native';

const SvgIcon = styled(Svg)`
  aspect-ratio: 1;
`;

const Icon: React.FC<SvgProps> = ({children, style}) => (
  <SvgIcon width="100%" height="100%" viewBox="0 0 30 30" style={style}>
    {children}
  </SvgIcon>
);

export default Icon;
