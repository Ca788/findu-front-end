import {createAsyncThunk, createSlice, type PayloadAction,} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {
  getCurrentUser as getCurrentUserGateway,
  login as loginGateway,
  logout as logoutGateway,
  register as registerGateway,
} from '@/features/auth/gateway/auth.gateway';
import type {LoginCredentials, RegisterCredentials,} from '@/features/auth/models/auth.model';
import {type AppErrorResult, AppErrorResultMapper, type ErrorResponse,} from '@/infrastructure/AppResponse';
import {appStorage} from '@/infrastructure/storage/StorageBuilder';
import {AppStorageKeys} from '@/constants/AppStorageKeys';
import type {RootState} from '@/store';
import type {User} from '@/models/user.model';

export type AuthStatus = 'idle' | 'loading' | 'authorized' | 'unauthorized';

export interface AuthState {
  user?: User;
  status: AuthStatus;
  loading: boolean;
  isLoggedIn: boolean;
  error?: AppErrorResult;
}

const initialState: AuthState = {
  status: 'idle',
  loading: false,
  isLoggedIn: false,
};

type ThunkConfig = { rejectValue: AppErrorResult };

function toAppError(error: unknown): AppErrorResult {
  return AppErrorResultMapper.fromAxiosError(error as AxiosError<ErrorResponse>);
}

export const login = createAsyncThunk<User, LoginCredentials, ThunkConfig>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginGateway(credentials);
    } catch (error) {
      return rejectWithValue(toAppError(error));
    }
  },
);

export const register = createAsyncThunk<User, RegisterCredentials, ThunkConfig>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      return await registerGateway(credentials);
    } catch (error) {
      return rejectWithValue(toAppError(error));
    }
  },
);

export const logout = createAsyncThunk<void, void, ThunkConfig>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutGateway();
    } catch (error) {
      return rejectWithValue(toAppError(error));
    }
  },
);

export const getUserFromToken = createAsyncThunk<User, void, ThunkConfig>(
  'auth/getUserFromToken',
  async (_, { rejectWithValue }) => {
    const token = appStorage.get<string>(AppStorageKeys.TOKEN);
    if (!token) {
      return rejectWithValue(
        AppErrorResultMapper.fromGeneric('No token in storage', 401),
      );
    }
    try {
      return await getCurrentUserGateway();
    } catch (error) {
      return rejectWithValue(toAppError(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.status = 'authorized';
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'unauthorized';
        state.isLoggedIn = false;
        state.loading = false;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.status = 'authorized';
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'unauthorized';
        state.isLoggedIn = false;
        state.loading = false;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = undefined;
        state.status = 'unauthorized';
        state.isLoggedIn = false;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = undefined;
        state.status = 'unauthorized';
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserFromToken.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(getUserFromToken.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.status = 'authorized';
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(getUserFromToken.rejected, (state, action) => {
        state.user = undefined;
        state.status = 'unauthorized';
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer;

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthorized = (state: RootState) =>
  state.auth.status === 'authorized';
