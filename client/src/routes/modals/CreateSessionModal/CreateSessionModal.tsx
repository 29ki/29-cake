import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components/native';

import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {UserProfileType} from '../../../../../shared/src/schemas/User';

import useIsPublicHost from '../../../lib/user/hooks/useIsPublicHost';
import useUser from '../../../lib/user/hooks/useUser';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import SelectTypeStep from './components/steps/SelectTypeStep';
import SetDateTimeStep from './components/steps/SetDateTimeStep';
import SelectContentStep from './components/steps/SelectContentStep';
import UpdateProfileStep from './components/steps/ProfileStep';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import Fade from '../../../lib/components/Fade/Fade';

const Wrapper = styled.View({flex: 1});

export type SelectedModeAndType =
  | {
      mode: SessionMode;
      type: SessionType;
    }
  | undefined;

export type StepProps = {
  selectedExercise?: string;
  discover?: boolean;
  setSelectedExercise: Dispatch<SetStateAction<StepProps['selectedExercise']>>;
  nextStep: () => void;
  firstStep: () => void;
  isPublicHost: boolean;
  selectedModeAndType: SelectedModeAndType;
  userProfile: UserProfileType | undefined;
  setSelectedModeAndType: Dispatch<
    SetStateAction<StepProps['selectedModeAndType']>
  >;
};

const steps = ({
  skipProfile,
  skipContent,
}: {
  skipProfile: boolean;
  skipContent: boolean;
}): React.FC<StepProps>[] => [
  SelectTypeStep,
  ...(skipProfile ? [] : [UpdateProfileStep]),
  ...(skipContent ? [] : [SelectContentStep]),
  SetDateTimeStep,
];

const CreateSessionModal = () => {
  const {
    params: {exerciseId},
  } = useRoute<RouteProp<ModalStackProps, 'CreateSessionModal'>>();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise['id'] | undefined
  >(exerciseId);
  const isPublicHost = useIsPublicHost();
  const user = useUser();
  const [selectedModeAndType, setSelectedModeAndType] =
    useState<SelectedModeAndType>(undefined);

  const hasProfile = Boolean(user?.displayName) && Boolean(user?.photoURL);
  const userProfile = useMemo(
    () =>
      user?.uid
        ? {
            uid: user?.uid,
            displayName: user?.displayName ?? undefined,
            photoURL: user?.photoURL ?? undefined,
          }
        : undefined,
    [user?.uid, user?.displayName, user?.photoURL],
  );

  const currentSteps = useMemo(
    () =>
      steps({
        skipContent: Boolean(exerciseId),
        skipProfile:
          selectedModeAndType?.mode === SessionMode.async || hasProfile,
      }),
    [hasProfile, selectedModeAndType, exerciseId],
  );

  const PreviousStepComponent: React.FC<StepProps> = useMemo(
    () => currentSteps[currentStep - 1],
    [currentSteps, currentStep],
  );

  const CurrentStepComponent: React.FC<StepProps> = useMemo(
    () => currentSteps[currentStep],
    [currentSteps, currentStep],
  );

  const NextStepComponent: React.FC<StepProps> = useMemo(
    () => currentSteps[currentStep + 1],
    [currentSteps, currentStep],
  );

  const nextStep = useCallback(
    () => setCurrentStep(currentStep + 1),
    [currentStep],
  );

  const firstStep = useCallback(() => setCurrentStep(0), []);

  return (
    <SheetModal>
      <Wrapper>
        {PreviousStepComponent && (
          <Fade visible={false} key={currentStep - 1}>
            <PreviousStepComponent
              selectedExercise={selectedExercise}
              setSelectedExercise={setSelectedExercise}
              selectedModeAndType={selectedModeAndType}
              setSelectedModeAndType={setSelectedModeAndType}
              userProfile={userProfile}
              nextStep={nextStep}
              firstStep={firstStep}
              isPublicHost={isPublicHost}
              key="step"
            />
          </Fade>
        )}
        <Fade visible={true} key={currentStep}>
          <CurrentStepComponent
            selectedExercise={selectedExercise}
            setSelectedExercise={setSelectedExercise}
            selectedModeAndType={selectedModeAndType}
            setSelectedModeAndType={setSelectedModeAndType}
            userProfile={userProfile}
            nextStep={nextStep}
            firstStep={firstStep}
            isPublicHost={isPublicHost}
            key="step"
          />
        </Fade>
        {NextStepComponent && (
          <Fade visible={false} key={currentStep + 1}>
            <NextStepComponent
              selectedExercise={selectedExercise}
              setSelectedExercise={setSelectedExercise}
              selectedModeAndType={selectedModeAndType}
              setSelectedModeAndType={setSelectedModeAndType}
              userProfile={userProfile}
              nextStep={nextStep}
              firstStep={firstStep}
              isPublicHost={isPublicHost}
              key="step"
            />
          </Fade>
        )}
      </Wrapper>
    </SheetModal>
  );
};

export default CreateSessionModal;
