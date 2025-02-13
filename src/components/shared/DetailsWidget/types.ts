import {
  AnyActionType,
  ColonyActionType,
  ExtendedColonyActionType,
} from '~types';

const safeLogoIconName = 'safe-logo';

/*
 * Which icons correspond to which action types in the details widget
 */
export const ACTION_TYPES_ICONS_MAP: Record<AnyActionType, string> = {
  [ColonyActionType.WrongColony]: 'forbidden-signal',
  [ColonyActionType.Payment]: 'emoji-dollar-stack',
  [ColonyActionType.MultiplePayment]: 'emoji-dollar-stack',
  [ColonyActionType.MultiplePaymentMotion]: 'emoji-dollar-stack',
  [ColonyActionType.Recovery]: 'emoji-alarm-lamp',
  [ColonyActionType.MoveFunds]: 'emoji-world-globe',
  [ColonyActionType.UnlockToken]: 'emoji-padlock',
  [ColonyActionType.MintTokens]: 'emoji-seed-sprout',
  [ColonyActionType.CreateDomain]: 'emoji-crane',
  [ColonyActionType.VersionUpgrade]: 'emoji-strong-person',
  [ColonyActionType.ColonyEdit]: 'emoji-edit-tools',
  [ColonyActionType.EditDomain]: 'emoji-pencil-note',
  [ColonyActionType.SetUserRoles]: 'emoji-crane',
  [ColonyActionType.EmitDomainReputationPenalty]: 'emoji-firebolt',
  [ColonyActionType.EmitDomainReputationReward]: 'emoji-shooting-star',
  [ColonyActionType.MintTokensMotion]: 'emoji-seed-sprout',
  [ColonyActionType.PaymentMotion]: 'emoji-dollar-stack',
  [ColonyActionType.MoveFundsMotion]: 'emoji-world-globe',
  [ColonyActionType.CreateDomainMotion]: 'emoji-crane',
  [ColonyActionType.VersionUpgradeMotion]: 'emoji-strong-person',
  [ColonyActionType.ColonyEditMotion]: 'emoji-edit-tools',
  [ColonyActionType.EditDomainMotion]: 'emoji-pencil-note',
  [ColonyActionType.SetUserRolesMotion]: 'emoji-crane',
  [ColonyActionType.EmitDomainReputationPenaltyMotion]: 'emoji-firebolt',
  [ColonyActionType.EmitDomainReputationRewardMotion]: 'emoji-shooting-star',
  [ColonyActionType.UnlockTokenMotion]: 'emoji-padlock',
  [ColonyActionType.CreateDecisionMotion]: 'emoji-decisions',
  [ColonyActionType.FundExpenditureMotion]: 'emoji-world-globe',
  [ColonyActionType.CancelStakedExpenditureMotion]: 'forbidden-signal',
  [ColonyActionType.NullMotion]: 'forbidden-signal',
  [ColonyActionType.Generic]: 'circle-check-primary',
  [ColonyActionType.MakeArbitraryTransaction]: '',
  [ColonyActionType.MakeArbitraryTransactionsMotion]: '',
  [ExtendedColonyActionType.UpdateAddressBook]: 'emoji-edit-tools',
  [ExtendedColonyActionType.UpdateTokens]: 'emoji-edit-tools',
  [ExtendedColonyActionType.AddSafe]: safeLogoIconName,
  [ExtendedColonyActionType.RemoveSafe]: safeLogoIconName,
  [ExtendedColonyActionType.SafeTransferFunds]: safeLogoIconName,
  [ExtendedColonyActionType.SafeContractInteraction]: safeLogoIconName,
  [ExtendedColonyActionType.SafeMultipleTransactions]: safeLogoIconName,
  [ExtendedColonyActionType.SafeTransferNft]: safeLogoIconName,
  [ExtendedColonyActionType.SafeRawTransaction]: safeLogoIconName,
  [ExtendedColonyActionType.SafeTransferFundsMotion]: safeLogoIconName,
  [ExtendedColonyActionType.SafeContractInteractionMotion]: safeLogoIconName,
  [ExtendedColonyActionType.SafeMultipleTransactionsMotion]: safeLogoIconName,
  [ExtendedColonyActionType.SafeTransferNftMotion]: safeLogoIconName,
  [ExtendedColonyActionType.SafeRawTransactionMotion]: safeLogoIconName,
};
