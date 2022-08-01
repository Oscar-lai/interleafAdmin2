import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

interface iTutor {
  id: string;
  name: string;
  questionNumber: Number;
}

const useTut = (): iTutor[] => {
  const [tutors, setTutors] = useState<iTutor[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('customQuestion')
      .onSnapshot(
        snapshot => {
          let temp: iTutor[] = [];
          snapshot.forEach(doc => {
            temp.push({
              id: doc.id,
              name: doc.data().name,
              questionNumber: doc.data().questionNumber,
            });
          });
          setTutors(temp);
        },
        error => {
          console.log(error);
        },
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return tutors;
};

export default useTut;
