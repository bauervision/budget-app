import { f, auth, database } from '../config';

export const registerUser = (email, password) => {
  console.log(email, password);
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(user => console.log(email, password, user))
    .catch(err => console.error(err));
};

export const checkUserLogIn = () => {
  f.auth().onAuthStateChanged(function(user) {
    if (user) {
      //logged in
      // console.log('logged in: ', user);
      return true;
    } else {
      //logged out
      console.log('logged out');
      return false;
    }
  });
};

export const signOutUser = () => {
  auth
    .signOut()
    .then(() => {
      console.log('Logged out: ');
    })
    .catch(err => console.log(err));
};

export async function loginWithFacebook() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    '281172665883437',
    { permissions: ['email', 'public_profile'] }
  );

  if (type === 'success') {
    const credentials = f.auth.FacebookAuthProvider.credential(token);
    f.auth()
      .signInAndRetrieveDataWithCredential(credentials)
      .catch(err => {
        console.log('Error...', err);
      });
  }
}

export async function logoutWithFacebook() {
  auth.signOut();
}

export const loginUserWithEmail = async (email, pass) => {
  if (email != '' && pass != '') {
    try {
      let user = await auth.signInWithEmailAndPassword(email, pass);

      return user;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else {
    alert('Missing email or password');
  }
};
