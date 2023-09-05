import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';

import useUser from '../../../lib/user/hooks/useUser';

import useReportApi from '../../../lib/report/hooks/useReportApi';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {Spacer16, Spacer8} from '../../../lib/components/Spacers/Spacer';
import {
  Heading16,
  ModalHeading,
} from '../../../lib/components/Typography/Heading/Heading';
import Button from '../../../lib/components/Buttons/Button';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {BottomSheetTextInput} from '../../../lib/components/Typography/TextInput/TextInput';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

const Container = styled(Gutters)({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: 250,
});

const ReportInput = styled(BottomSheetTextInput)({
  borderRadius: SPACINGS.SIXTEEN,
  backgroundColor: COLORS.PURE_WHITE,
  padding: SPACINGS.SIXTEEN,
  fontSize: SPACINGS.SIXTEEN,
  height: 250,
});

const ButtonWrapper = styled.View({
  flexGrow: 0,
  flexDirection: 'row',
  justifyContent: 'center',
});

const ReportModal = () => {
  const {t} = useTranslation('Modal.Report');
  const reportApi = useReportApi();
  const user = useUser();
  const [text, setText] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const {
    params: {originScreen},
  } = useRoute<RouteProp<ModalStackProps, 'ReportModal'>>();

  const onSubmit = useCallback(async () => {
    if (text?.length) {
      setLoading(true);
      try {
        await reportApi.submitReport({text, email, screen: originScreen});
        setSubmitted(true);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        throw e;
      }
    }
  }, [text, email, originScreen, reportApi]);

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        {submitted ? (
          <Container>
            <Display24>{t('confirmationText')}</Display24>
          </Container>
        ) : (
          <Gutters>
            <ModalHeading>{t('title')}</ModalHeading>
            <Spacer16 />

            <>
              <Heading16>{t('reportHeading')}</Heading16>
              <Spacer8 />
              <ReportInput
                placeholder={t('reportPlaceholder')}
                editable
                multiline
                onChangeText={setText}
                textAlignVertical="top"
              />
              <Spacer16 />
              <Heading16>{t('emailHeading')}</Heading16>
              <Spacer8 />
              <BottomSheetTextInput
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                placeholder={t('emailPlaceholder')}
                onChangeText={setEmail}
                defaultValue={user?.email || undefined}
              />
              <Spacer16 />
              <ButtonWrapper>
                <Button
                  variant="secondary"
                  onPress={onSubmit}
                  disabled={!text?.length || loading}
                  loading={loading}>
                  {t('confirmButton')}
                </Button>
              </ButtonWrapper>
            </>
          </Gutters>
        )}
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default ReportModal;
