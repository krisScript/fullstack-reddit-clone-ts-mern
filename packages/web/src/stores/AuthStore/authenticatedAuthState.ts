import AuthState from '../../types/AuthState';
const authenticatedAuthState: AuthState = {
  isAuth: true,
  token: 'testToken',
  expiryDate: 'date',
  user: {
    userId: '10',
    username: 'testUser',
    email: 'testEmail@mail.com',
  },
};

export default authenticatedAuthState;