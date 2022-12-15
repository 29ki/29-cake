import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import styled from 'styled-components/native';
import ActionButton from '../../common/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../common/components/ActionList/ActionList';

import Gutters from '../../common/components/Gutters/Gutters';
import {
  EnvelopeIcon,
  FacebookIcon,
  HomeIcon,
  InstagramIcon,
  SlackIcon,
} from '../../common/components/Icons';
import SheetModal from '../../common/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import {
  Heading16,
  ModalHeading,
} from '../../common/components/Typography/Heading/Heading';

const ScrollView = styled(BottomSheetScrollView)({
  flex: 1,
});

const ContactModal = () => {
  const {t} = useTranslation('Modal.Contact');

  const linkPress = (url: string) => () => {
    try {
      Linking.openURL(url);
    } catch (e) {}
  };

  return (
    <SheetModal>
      <ScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer24 />
          <Heading16>{t('contactInformation.heading')}</Heading16>
          <Spacer8 />
          <ActionList>
            <ActionButton
              Icon={HomeIcon}
              onPress={linkPress(t('contactInformation.www.url'))}>
              {t('contactInformation.www.label')}
            </ActionButton>
            <ActionButton
              Icon={SlackIcon}
              onPress={linkPress(t('contactInformation.chat.url'))}>
              {t('contactInformation.chat.label')}
            </ActionButton>
            <ActionButton
              Icon={EnvelopeIcon}
              onPress={linkPress(
                `mailto:${t('contactInformation.email.email')}?subject=${t(
                  'contactInformation.email.subject',
                )}`,
              )}>
              {t('contactInformation.email.label')}
            </ActionButton>
          </ActionList>
          <Spacer16 />
          <ActionList>
            <ActionButton
              Icon={InstagramIcon}
              onPress={linkPress(t('contactInformation.instagram.url'))}>
              {t('contactInformation.instagram.label')}
            </ActionButton>
            <ActionButton
              Icon={FacebookIcon}
              onPress={linkPress(t('contactInformation.facebook.url'))}>
              {t('contactInformation.facebook.label')}
            </ActionButton>
          </ActionList>

          {Boolean(t('partnerContactInformation.heading')) && (
            <>
              <Spacer32 />
              <Heading16>{t('partnerContactInformation.heading')}</Heading16>
              <Spacer8 />
              <ActionList>
                <ActionButton
                  Icon={HomeIcon}
                  onPress={linkPress(t('partnerContactInformation.www.url'))}>
                  {t('partnerContactInformation.www.label')}
                </ActionButton>
                <ActionButton
                  Icon={EnvelopeIcon}
                  onPress={linkPress(
                    `mailto:${t(
                      'partnerContactInformation.email.email',
                    )}?subject=${t('partnerContactInformation.email.subject')}`,
                  )}>
                  {t('partnerContactInformation.email.label')}
                </ActionButton>
              </ActionList>
              <Spacer16 />
              <ActionList>
                <ActionButton
                  Icon={InstagramIcon}
                  onPress={linkPress(
                    t('partnerContactInformation.instagram.url'),
                  )}>
                  {t('partnerContactInformation.instagram.label')}
                </ActionButton>
                <ActionButton
                  Icon={FacebookIcon}
                  onPress={linkPress(
                    t('partnerContactInformation.facebook.url'),
                  )}>
                  {t('partnerContactInformation.facebook.label')}
                </ActionButton>
              </ActionList>
            </>
          )}
        </Gutters>
      </ScrollView>
    </SheetModal>
  );
};

export default ContactModal;
