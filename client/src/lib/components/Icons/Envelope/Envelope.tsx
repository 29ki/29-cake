import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const EnvelopeIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path
      d="M8.782 22.857H22.42c1.632 0 2.579-.947 2.579-2.757v-9.343C25 8.947 24.044 8 22.218 8H8.58C6.947 8 6 8.939 6 10.757V20.1c0 1.81.955 2.757 2.782 2.757Zm5.767-7.137L8.393 9.632a1.91 1.91 0 0 1 .397-.042h13.42c.152 0 .287.017.414.05l-6.147 6.08c-.355.347-.652.499-.964.499-.313 0-.61-.16-.964-.499ZM7.58 10.875l4.6 4.524-4.6 4.549v-9.073Zm11.263 4.524L23.42 10.9v9.031l-4.575-4.532ZM8.79 21.259c-.152 0-.296-.017-.422-.043l4.845-4.803.456.457c.618.6 1.21.854 1.844.854.625 0 1.226-.254 1.835-.854l.465-.457 4.836 4.795a1.79 1.79 0 0 1-.44.05H8.79Z"
      fill={fill}
    />
  </Icon>
);
