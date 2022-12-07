import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {Session, SessionType} from '../../../../../shared/src/types/Session';
import {ChevronLeft, PrivateIcon, PublicIcon} from '../Icons';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Body16} from '../Typography/Body/Body';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const EditSessionType: React.FC<{
  sessionType: Session['type'];
  onPress: () => void;
}> = ({sessionType, onPress}) => {
  const {t} = useTranslation('Component.EditSessionType');

  return (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <IconWrapper>
          <ChevronLeft />
        </IconWrapper>
        <IconWrapper>
          {sessionType === SessionType.private ? (
            <PrivateIcon />
          ) : (
            <PublicIcon />
          )}
        </IconWrapper>
        <Body16>{t(sessionType)}</Body16>
      </Row>
    </TouchableOpacity>
  );
};

export default EditSessionType;
