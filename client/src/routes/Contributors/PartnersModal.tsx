import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import content from '../../../../content/content.json';

import SheetModal from '../../common/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer32,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import {Body16} from '../../common/components/Typography/Body/Body';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import {BottomGradient} from './components/BottomGradient';
import {Contributor} from './components/Contributor';
import {Header} from './components/Header';
import {ScrollView} from './components/ScrollView';
import {ContributorsList} from './components/ContributorsList';

const Wrapper = styled.View({
  flex: 1,
});

const partners: Contributor[] = (content.contributors as Contributor[]).filter(
  ({contributions}) =>
    contributions.includes('corePartner') || contributions.includes('partner'),
);

const PartnersModal = () => {
  const {t} = useTranslation('Modal.Partners');

  return (
    <SheetModal>
      <Wrapper>
        <Header>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer8 />
          <Body16>{t('text')}</Body16>
        </Header>

        <ScrollView>
          <ModalHeading>{t('corePartners')}</ModalHeading>
          <ContributorsList>
            {partners
              .filter(({contributions}) =>
                contributions.includes('corePartner'),
              )
              .map(contributor => (
                <Contributor
                  key={contributor.name}
                  contributor={contributor as Contributor}
                />
              ))}
          </ContributorsList>
          <Spacer32 />

          <ModalHeading>{t('partners')}</ModalHeading>
          <ContributorsList>
            {partners
              .filter(({contributions}) => contributions.includes('partner'))
              .map(contributor => (
                <Contributor
                  key={contributor.name}
                  contributor={contributor as Contributor}
                />
              ))}
          </ContributorsList>
          <BottomSafeArea />
        </ScrollView>
        <BottomGradient />
      </Wrapper>
    </SheetModal>
  );
};

export default PartnersModal;
