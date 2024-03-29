import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {normalQ} from './useHWQ';

const useChapterQ = (chapterCode: string, tut: string): normalQ[] => {
  const [Q, setQ] = useState<normalQ[]>([]);

  useEffect(() => {
    let path = tut
      ? `customQuestion/${tut}/questions/${chapterCode}/dish`
      : `questions/${chapterCode}/dish`;
    const unsubscribe = firestore()
      .collection(path)
      .onSnapshot(
        snapshot => {
          let temp: normalQ[] = [];
          snapshot.forEach(doc => {
            temp.push({
              camera: doc.data().camera,
              id: doc.id,
              sandwiches: doc.data().sandwiches,
              checked: doc.data().checked,
              demo: doc.data().demo,
              tricky: doc.data().tricky,
              objectManipulation: doc.data().objectManipulation ?? false,
            });
          });
          setQ(temp);
        },
        error => {
          console.log(error);
        },
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return Q;
};

export default useChapterQ;
