import { IUser } from '../shared/models/register';
import { createReducer, on, Action } from '@ngrx/store';
import * as UserAction from './user.actions';

export interface IUserState {
  user: Array<IUser>;
  isLoading: boolean;
  message: string;
}

export const initialState: IUserState = {
  user: [],
  isLoading: false,
  message: '',
};

export function reducer(state = initialState, action: UserAction.UserActions) {
  switch (action.type) {
    case UserAction.UserActionTypes.getUser: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UserAction.UserActionTypes.editUser:{

    }

    default:
      return state;
  }
}

// const userReducer = createReducer(
//   initialState,
//   on(UserAction.registerUser, (state, { user }) => ({ ...state, user: user }))
// );

// export function reducer(state: IUserState | undefined, action: Action) {
//   return userReducer(state, action);
// }
