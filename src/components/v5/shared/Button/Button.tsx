/* eslint-disable react/button-has-type */

import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { ButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Button.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button';

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  mode = 'primarySolid',
  size = 'default',
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  className,
  isFullRounded = false,
  ariaLabel,
  isFullSize,
  setTriggerRef,
  isPending,
  iconName,
  iconSize = 'tiny',
  isIconRight,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);
  const buttonText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);
  const ariaLabelText =
    typeof ariaLabel === 'string'
      ? ariaLabel
      : ariaLabel && formatMessage(ariaLabel);

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <button
          className={clsx(
            'flex items-center justify-center font-medium transition-all duration-normal',
            {
              'text-md min-h-[2.5rem] px-4 py-2.5':
                size === 'default' &&
                mode !== 'textButton' &&
                mode !== 'textButtonUnderlined' &&
                mode !== 'pending',
              'text-sm min-h-[2.125rem] px-3 py-2':
                size === 'small' &&
                mode !== 'textButton' &&
                mode !== 'textButtonUnderlined' &&
                mode !== 'pending',
              [styles.primarySolid]: mode === 'primarySolid',
              [styles.primaryOutline]: mode === 'primaryOutline',
              [styles.primaryOutlineFulled]: mode === 'primaryOutlineFulled',
              [styles.secondarySolid]: mode === 'secondarySolid',
              [styles.secondaryOutline]: mode === 'secondaryOutline',
              [styles.quinary]: mode === 'quinary',
              [styles.tertiary]: mode === 'tertiary',
              [styles.textButton]: mode === 'textButton',
              [styles.textButtonUnderlined]: mode === 'textButtonUnderlined',
              [styles.pending]: mode === 'pending',
              [styles.completed]: mode === 'completed',
              'pointer-events-none': disabled,
              'w-full': isFullSize,
              'rounded-full': isFullRounded,
              'rounded-lg': !isFullRounded,
              'border border-gray-300 !text-gray-300 !bg-base-white':
                disabled && isIconRight,
            },
            className,
          )}
          disabled={disabled || loading}
          aria-label={ariaLabelText}
          aria-busy={loading}
          title={titleText}
          type={type}
          ref={setTriggerRef}
          {...rest}
        >
          {mode === 'completed' && (
            <span className="flex shrink-0 mr-2">
              <Icon name="check" appearance={{ size: 'extraTiny' }} />
            </span>
          )}
          {iconName && !isIconRight && (
            <span className="flex shrink-0">
              <Icon name={iconName} appearance={{ size: iconSize }} />
            </span>
          )}
          {(buttonText || children) && (
            <>
              {iconName ? (
                <span className={isIconRight ? 'mr-2' : 'ml-2'}>
                  {buttonText || children}
                </span>
              ) : (
                buttonText || children
              )}
            </>
          )}
          {iconName && isIconRight && (
            <span className="flex shrink-0">
              <Icon name={iconName} appearance={{ size: iconSize }} />
            </span>
          )}
          {mode === 'pending' && isPending && (
            <span className="flex shrink-0 ml-1.5">
              <Icon
                name="spinner-gap"
                className={`w-[0.8125rem] h-[0.8125rem] ${
                  isPending ? 'animate-spin' : 'animate-none'
                }`}
                appearance={{ size: 'tiny' }}
              />
            </span>
          )}
        </button>
      )}
    </>
  );
};

Button.displayName = displayName;

export default Button;
