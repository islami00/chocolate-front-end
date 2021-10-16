import { Review, User } from './jsonTypes';

export interface AppInitState {
  userData?: UserData;
}

export interface AppState {
  userData: UserData;
}
export interface UserData extends User {
  name: string;
  accountAddress: string;
  userReviews: Review[];
  accountType: '' | 'unset' | 'user' | 'project';
}
