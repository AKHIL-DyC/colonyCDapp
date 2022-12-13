import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useMutation, gql } from '@apollo/client';
import * as yup from 'yup';
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

import { updateUser } from '~gql';
import { User } from '~types';

import styles from './UserProfileEdit.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.UserMainSettings.heading',
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: 'users.UserProfileEdit.UserMainSettings.labelWallet',
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: 'users.UserProfileEdit.UserMainSettings.labelUsername',
    defaultMessage: 'Unique Username',
  },
  labelName: {
    id: 'users.UserProfileEdit.UserMainSettings.labelName',
    defaultMessage: 'Name',
  },
  labelBio: {
    id: 'users.UserProfileEdit.UserMainSettings.labelBio',
    defaultMessage: 'Bio',
  },
  labelWebsite: {
    id: 'users.UserProfileEdit.UserMainSettings.labelWebsite',
    defaultMessage: 'Website',
  },
  labelLocation: {
    id: 'users.UserProfileEdit.UserMainSettings.labelLocation',
    defaultMessage: 'Location',
  },
  snackbarSuccess: {
    id: 'users.UserProfileEdit.UserMainSettings.snackbarSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
  snackbarError: {
    id: 'users.UserProfileEdit.UserMainSettings.snackbarError',
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
});

const displayName = 'users.UserProfileEdit.UserMainSettings';

interface FormValues {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
}

interface Props {
  user: User;
}

const validationSchema = yup.object({
  bio: yup.string().nullable(),
  displayName: yup.string().nullable(),
  location: yup.string().nullable(),
  website: yup.string().url().nullable(),
});

const UserMainSettings = ({ user }: Props) => {
  const { walletAddress, profile } = user;
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  useEffect(() => {
    if (showSnackbar) {
      const timeout = setTimeout(() => setShowSnackbar(true), 200000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [showSnackbar]);

  const [editUser, { error }] = useMutation(gql(updateUser));
  const onSubmit = useCallback(
    (updatedProfile: FormValues) =>
      editUser({
        variables: { input: { id: walletAddress, profile: updatedProfile } },
      }),
    [walletAddress, editUser],
  );

  return (
    <>
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <Form<FormValues>
        initialValues={{
          displayName: profile?.displayName || undefined,
          bio: profile?.bio || undefined,
          website: profile?.website || undefined,
          location: profile?.location || undefined,
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
                username={user.name || walletAddress}
                title={user.name || walletAddress}
                hasLink={false}
                data-test="userProfileUsername"
              />
            </div>
            <FieldSet className={styles.inputFieldSet}>
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

UserMainSettings.displayName = displayName;

export default UserMainSettings;
