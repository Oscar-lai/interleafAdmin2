import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {normalQ} from './useHWQ';

const useChapterQ = (chapterCode: string): normalQ[] => {
  const [Q, setQ] = useState<normalQ[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(`questions/${chapterCode}/dish`)
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
