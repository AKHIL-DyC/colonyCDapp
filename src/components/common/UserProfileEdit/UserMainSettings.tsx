import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, object } from 'yup';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import Snackbar, { SnackbarType } from '~shared/Snackbar';
import CopyableAddress from '~shared/CopyableAddress';
import UserMention from '~shared/UserMention';
import Heading from '~shared/Heading';
import {
  FieldSet,
  Form,
  FormStatus,
  Input,
  InputLabel,
  Textarea,
} from '~shared/Fields';
import Button from '~shared/Button';
import ConfusableWarning from '~shared/ConfusableWarning';

import { useUpdateUserProfileMutation } from '~gql';
import { User } from '~types';
import { useAppContext } from '~hooks';

import styles from './UserProfileEdit.css';

const displayName = 'common.UserProfileEdit.UserMainSettings';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: `${displayName}.labelWallet`,
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: `${displayName}.labelUsername`,
    defaultMessage: 'Unique Username',
  },
  labelEmail: {
    id: `${displayName}.labelEmail`,
    defaultMessage: 'Your email',
  },
  labelName: {
    id: `${displayName}.labelName`,
    defaultMessage: 'Your display name',
  },
  labelBio: {
    id: `${displayName}.labelBio`,
    defaultMessage: 'Bio',
  },
  labelWebsite: {
    id: `${displayName}.labelWebsite`,
    defaultMessage: 'Website',
  },
  labelLocation: {
    id: `${displayName}.labelLocation`,
    defaultMessage: 'Location',
  },
  snackbarSuccess: {
    id: `${displayName}.snackbarSuccess`,
    defaultMessage: 'Profile settings have been updated.',
  },
  snackbarError: {
    id: `${displayName}.snackbarError`,
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
  websiteError: {
    id: `${displayName}.websiteError`,
    defaultMessage: 'Enter a valid URL',
  },
});

interface FormValues {
  email?: string;
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
}

interface Props {
  user: User;
}

const validationSchema = object({
  email: string().email().nullable(),
  bio: string().nullable(),
  displayName: string().nullable(),
  location: string().nullable(),
  website: string()
    .url(() => MSG.websiteError)
    .nullable(),
});

const UserMainSettings = ({
  user: { walletAddress, profile },
  user,
}: Props) => {
  const { updateUser } = useAppContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...userProfile } = profile || {};
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const [editUser, { error, loading, called }] = useUpdateUserProfileMutation();
  const onSubmit = useCallback(
    (updatedProfile: FormValues) => {
      const valuesToSubmit = {
        email: updatedProfile.email === '' ? null : updatedProfile.email,
      };

      editUser({
        variables: {
          input: {
            id: walletAddress,
            ...userProfile,
            ...updatedProfile,
            ...valuesToSubmit,
          },
        },
      });
    },
    [walletAddress, editUser, userProfile],
  );

  useEffect(() => {
    if (called && !loading && updateUser) {
      updateUser(walletAddress);
      setShowSnackbar(true);
    }
  }, [called, loading, walletAddress, updateUser]);

  return (
    <>
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <Form<FormValues>
        initialValues={{
          email: profile?.email || '',
          displayName: profile?.displayName || '',
          bio: profile?.bio || '',
          website: profile?.website || '',
          location: profile?.location || '',
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ status, isSubmitting, dirty, isValid, values }) => (
          <div className={styles.main}>
            <FieldSet>
              <InputLabel label={MSG.labelWallet} />
              <CopyableAddress appearance={{ theme: 'big' }} full>
                {walletAddress}
              </CopyableAddress>
            </FieldSet>
            <div className={styles.usernameContainer}>
              <InputLabel label={MSG.labelUsername} />
              <UserMention
                user={user}
                title={user.name || walletAddress}
                hasLink={false}
                data-test="userProfileUsername"
              />
            </div>
            <FieldSet className={styles.inputFieldSet}>
              <Input
                label={MSG.labelEmail}
                name="email"
                dataTest="userSettingsEmail"
              />
              <Input
                label={MSG.labelName}
                name="displayName"
                dataTest="userSettingsName"
              />
              {values.displayName && isConfusing(values.displayName) && (
                <ConfusableWarning />
              )}
              <Textarea
                label={MSG.labelBio}
                name="bio"
                maxLength={160}
                dataTest="userSettingsBio"
              />
              <Input
                label={MSG.labelWebsite}
                name="website"
                dataTest="userSettingsWebsite"
              />
              <Input
                label={MSG.labelLocation}
                name="location"
                dataTest="userSettingsLocation"
              />
            </FieldSet>
            <FieldSet>
              <Button
                type="submit"
                text={{ id: 'button.save' }}
                loading={isSubmitting}
                dataTest="userSettingsSubmit"
                onClick={() => setShowSnackbar(true)}
                disabled={!dirty || !isValid}
              />
            </FieldSet>
            <FormStatus status={status} />
            <Snackbar
              show={showSnackbar}
              setShow={setShowSnackbar}
              msg={error ? MSG.snackbarError : MSG.snackbarSuccess}
              type={error ? SnackbarType.Error : SnackbarType.Success}
            />
          </div>
        )}
      </Form>
    </>
  );
};

export default UserMainSettings;
