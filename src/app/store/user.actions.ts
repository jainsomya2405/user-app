import { createAction, props, Action } from '@ngrx/store';
import { IUser } from '../shared/models/register';

// export const registerUser = createAction(
//   '[User] Register User',
//   props<{ user: IUser[] }>()
// );
// export const editUser = createAction(
//   '[User] Edit User',
//   props<{ userId: number }>()
// );

export enum UserActionTypes {
  getUser = '[User] Get User',
  registerAction = '[User] Register User',
  editUser = '[User] Edit User',
}

export class GetUser implements Action {
  public readonly type = UserActionTypes.getUser;
}

export class RegisterUser implements Action {
  public readonly type = UserActionTypes.registerAction;

  constructor(public payload: IUser) {}
}

export class EditUser implements Action {
  public readonly type = UserActionTypes.editUser;

  constructor(public payload: IUser) {}
}

export type UserActions = GetUser | RegisterUser | EditUser;
