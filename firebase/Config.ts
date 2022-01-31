// import {
//   Auth,
//   createUserWithEmailAndPassword,
//   EmailAuthProvider,
//   getAuth,
//   reauthenticateWithCredential,
//   signInWithEmailAndPassword,
//   signOut,
//   updatePassword,
// } from 'firebase/auth';
// import {getAnalytics} from 'firebase/analytics';
// import 'firebase/compat/firestore';
// import {initializeApp} from 'firebase/app';
// import {getStorage, ref, getDownloadURL} from 'firebase/storage';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBom4zYJOprWz3CPAEALSM2haYOceVNh6E',
//   authDomain: 'dev-interleaf.firebaseapp.com',
//   projectId: 'dev-interleaf',
//   storageBucket: 'dev-interleaf.appspot.com',
//   messagingSenderId: '320495149858',
//   appId: '1:320495149858:web:37789bf2e4582be4837b7b',
//   measurementId: 'G-FF74G66N6L',
// };

// export const firebaseApp = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(firebaseApp);

// export const auth = getAuth(firebaseApp);

export const AppID = 'dev-interleaf';

export async function register(email: string, password: string) {
  try {
    const res = await auth().createUserWithEmailAndPassword(email, password);
    return 'success';
  } catch (error: any) {
    const code = error.code;
    return code;
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await auth().signInWithEmailAndPassword(email, password);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function signout() {
  auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch(error => {
      // An error happened.
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

export async function ResetPassword(pw: string, newPassword: string) {
  return new Promise<string>(async (resolve, reject) => {
    const email = auth().currentUser?.email;

    if (email) {
      const emailCred = auth.EmailAuthProvider.credential(email, pw);

      await auth()
        .currentUser?.reauthenticateWithCredential(emailCred)
        .then(() => {
          console.log('reauthenticate success');
          auth()
            .currentUser?.updatePassword(newPassword)
            .then(() => {
              resolve('更改成功');
              console.log('更改成功');
            })
            .catch(error => {
              console.log(error);
              reject('更改失敗');
            });
        })
        .catch(err => {
          console.log(err);
          reject('密碼錯誤');
        });
    }
  });
}

export async function GetImageURL(url: string, type: string) {
  var myUrl: string;

  let path = url;

  if (type === 'img') {
    path = 'image/' + url;
  }

  const ImageRef = storage().ref(path);

  // Get the download URL
  let temp = await ImageRef.getDownloadURL().catch(error => {
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        console.log('File doesnt exist: ' + path);
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log('User doesnt have permission: ' + path);
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log('Unknown error occurred: ' + path);
        break;
    }
  });
  myUrl = temp ?? '';
  return myUrl;
}
