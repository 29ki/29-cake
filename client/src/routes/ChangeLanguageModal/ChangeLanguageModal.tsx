import React from 'react';
import {useTranslation} from 'react-i18next';
import ActionRadioButton from '../../common/components/ActionList/ActionItems/ActionRadioButton';
import ActionList from '../../common/components/ActionList/ActionList';

import Gutters from '../../common/components/Gutters/Gutters';
import SheetModal from '../../common/components/Modals/SheetModal';
import {Spacer24} from '../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import {LANGUAGE_TAGS, LANGUAGES} from '../../lib/i18n';
import useSetPreferredLanguage from '../../lib/i18n/hooks/useSetPreferedLanguage';

const ChangeLanguageModal = () => {
  const {i18n, t} = useTranslation('Modal.ChangeLanguage');
  const setPreferredLanguage = useSetPreferredLanguage();

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <ActionList>
          {LANGUAGE_TAGS.map(languageTag => (
            <ActionRadioButton
              key={languageTag}
              onPress={() => setPreferredLanguage(languageTag)}
              checked={languageTag === i18n.resolvedLanguage}>
              {LANGUAGES[languageTag]}
            </ActionRadioButton>
          ))}
        </ActionList>
      </Gutters>
    </SheetModal>
  );
};

export default ChangeLanguageModal;
