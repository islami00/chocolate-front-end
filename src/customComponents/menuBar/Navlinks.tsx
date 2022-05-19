/* eslint-disable import/no-unresolved */
import { useAuthService } from 'chocolate/polkadot-apac-hackathon/common/providers/authProvider';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { UseMutateFunction, useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { LogoutResult, LOGOUT_MUTATION } from '../../modules/Auth/utils';

export function Navlinks(): JSX.Element {
  const { isAuthenticated, logout } = useAuthService();
  // Get logout mutation.
  const logoutMutation = useMutation(LOGOUT_MUTATION);
  // Move to authButtons
  if (logoutMutation.error) {
    // Sth went wrong logging out.
    toast.error('Something went wrong logging you out.');
    logoutMutation.reset();
  }
  useEffect(() => {
    if (logoutMutation.status === 'success') {
      logout();
      logoutMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutMutation.status]);
  const handleLogout = function (
    doLogout: UseMutateFunction<LogoutResult, unknown, void, unknown>
  ) {
    return function () {
      doLogout();
    };
  };
  return (
    <nav className='nav-links'>
      <Link to='/' className='nav-link nav-link__home'>
        Chocolate
      </Link>
      <ul className='nav-links-ul'>
        <li>
          <Link className='nav-link' to='/gallery'>
            Projects
          </Link>
        </li>
        {/* Abstract to authBtns component */}
        {isAuthenticated ? (
          <li>
            <button
              type='button'
              onClick={handleLogout(logoutMutation.mutate)}
              className='ui button purple nav-link'
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link className='nav-link' to='/login'>
                Login
              </Link>
            </li>
            <li>
              <Link className='nav-link' to='/signup'>
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
