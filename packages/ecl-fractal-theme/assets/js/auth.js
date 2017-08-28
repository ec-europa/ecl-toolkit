const auth = () => {
  window.addEventListener('load', () => {
    const webAuth = new auth0.WebAuth({
      domain: 'kalinchernev.eu.auth0.com',
      clientID: 'WUMo3n94BWUdPe9afJT8oowW0NYigH22',
      redirectUri: window.location.href,
      audience: 'https://kalinchernev.eu.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid',
      socialButtonStyle: 'big',
      languageDictionary: { title: 'ECL' },
      language: 'en',
      theme: {
        logo:
          'https://ec-europa.github.io/europa-component-library/framework/images/svg/logo/logo--en.svg',
        primaryColor: '#004494',
      },
    });

    const loginBtn = document.getElementById('login');
    const logoutBtn = document.getElementById('logout');

    function setSession(authResult) {
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      toggleAuthButtonsDisplay();
    }

    function isAuthenticated() {
      // Check whether the current time is past the
      // access token's expiry time
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    function handleAuthentication() {
      webAuth.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          setSession(authResult);
          loginBtn.style.display = 'none';
        } else if (err) {
          console.log(err);
        }
        toggleAuthButtonsDisplay();
      });
    }

    function toggleAuthButtonsDisplay() {
      const authLinks = document.querySelectorAll('.ecl-auth-only');

      if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';

        authLinks.forEach(privateLink => {
          privateLink.setAttribute('aria-hidden', 'false');
          privateLink.style.display = 'block';
        });
      } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';

        authLinks.forEach(privateLink => {
          privateLink.setAttribute('aria-hidden', 'true');
          privateLink.style.display = 'none';
        });
      }
    }

    logoutBtn.addEventListener('click', logout);

    loginBtn.addEventListener('click', e => {
      e.preventDefault();
      webAuth.authorize();
    });

    handleAuthentication();
  });
};

module.exports = auth;
