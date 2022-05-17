import { ColonyRole } from '@colony/colony-js';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPFSAvatarImage {
  image?: string;
}

export type ActionUserRoles = {
  id: ColonyRole;
  setTo: boolean;
};

export interface UserRolesForDomain {
  address: string;
  domainId: number;
  roles: ColonyRole[];
}
