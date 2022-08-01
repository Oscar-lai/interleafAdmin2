import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

export interface iQuizInfo {
  terms: TermChapters;
  sets: TermChapters;
}

export interface TermChapters {
  [s: string]: number;
}

const useQuizTerms = (TutorCenterIDs: string[]): iQuizInfo => {
  const ID = TutorCenterIDs ?? '';

  const [terms, setTerms] = useState<iQuizInfo>({terms: {}, sets: {}});

  useEffect(() => {
    const unsubscribe = firestore()
      .doc(`customQuestion/${ID}`)
      .onSnapshot(
        snapshot => {
          const temp: any = {};
          temp.terms = snapshot.data()?.terms ?? {};
          temp.sets = {};

          let sets = snapshot.data()?.sets ?? {};
          for (let termKey in sets) {
            temp.sets[termKey] = Object.keys(sets[termKey]).length;
          }
          setTerms(temp);
          console.log(temp);
        },
        error => {
          console.log(error);
        },
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return terms;
};

export default useQuizTerms;
