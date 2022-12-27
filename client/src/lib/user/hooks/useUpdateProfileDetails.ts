import {useCallback, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

type UpdateProfileDetails = (profileDetails: {
  displayName?: FirebaseAuthTypes.User['displayName'];
  email?: FirebaseAuthTypes.User['email'];
  password?: string;
}) => Promise<void>;

const useUpdateProfileDetails = () => {
  const [isUpdatingProfileDetails, setIsUpdatingProfileDetails] =
    useState(false);

  const updateProfileDetails = useCallback<UpdateProfileDetails>(
    async ({displayName, email, password}) => {
      try {
        setIsUpdatingProfileDetails(true);

        if (!auth().currentUser) {
          await auth().signInAnonymously();
        }

        const currentUser = auth().currentUser;

        if (currentUser?.isAnonymous && email) {
          if (!password) {
            throw new Error('auth/password-missing');
          }
          const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
            email,
            password,
          );
          await currentUser?.linkWithCredential(emailAndPasswordCredentials);

          // We get auth/id-token-revoked if not signIn again
          await auth().signInWithCredential(emailAndPasswordCredentials);
        } else {
          if (email && email !== currentUser?.email) {
            await currentUser?.updateEmail(email);
          }
          if (password) {
            await currentUser?.updatePassword(password);
          }
        }

        if (
          typeof displayName === 'string' &&
          displayName !== currentUser?.displayName
        ) {
          await currentUser?.updateProfile({displayName});
        }

        setIsUpdatingProfileDetails(false);
      } catch (e: any) {
        setIsUpdatingProfileDetails(false);
        throw e;
      }
    },
    [setIsUpdatingProfileDetails],
  );

  return {
    updateProfileDetails,
    isUpdatingProfileDetails,
  };
};

export default useUpdateProfileDetails;
