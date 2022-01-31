import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

export interface HWQ {
  id: string;
  camera: boolean;
  sandwiches: Sandwich[];
  demo: boolean;
  checked: boolean;
  tricky: boolean;
  objectManipulation: boolean;
  time?: number;
  correct?: boolean;
  issuer: Issuer;
}
export interface normalQ {
  id: string;
  camera: boolean;
  sandwiches: Sandwich[];
  demo: boolean;
  checked: boolean;
  tricky: boolean;
  objectManipulation: boolean;
}

export interface Sandwich {
  layer: number[];
  fillings: Filling[];
  type: string;
  bread: {[key: string]: any};
  operator?: string[];
  result?: any;
  conditional?: any;
  condition?: any;
}

export interface Filling {
  type: string;
  length: number;
  food: any[];
  sub_fillings?: SubFilling[];
  ans?: any;
  modelAns: any;
}

export interface SubFilling {
  food: string[];
  length: number;
  modelAns: string;
  type: string;
}

export interface Issuer {
  classes: boolean;
  id: string;
  scheduling: boolean;
}

const useStudentList = (
  SID: string | undefined,
  HWid: string | undefined,
): HWQ[] => {
  const path = SID ?? '';
  const path2 = HWid ?? '';

  const [Q, setQ] = useState<HWQ[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(`homework/${path}/crepe/${path2}/ques`)
      .onSnapshot(
        snapshot => {
          let temp: HWQ[] = [];
          snapshot.forEach(doc => {
            temp.push({
              camera: doc.data().camera,
              id: doc.id,
              sandwiches: doc.data().sandwiches,
              checked: doc.data().checked,
              demo: doc.data().demo,
              tricky: doc.data().tricky,
              objectManipulation: doc.data().objectManipulation ?? false,
              issuer: doc.data().issuer,
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

export default useStudentList;
