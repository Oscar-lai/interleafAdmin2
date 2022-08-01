import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

export interface IChapter {
  id: string;
  chineseName: string;
  level: number;
  term: 'a' | 'b';
  timeline: number;
  prerequisite: string[] | null;
  chapters?: IChapter[];
  topic?: string;
  allCamera?: boolean;
}

export interface iTermInfo {
  sets: {[term: string]: {[setId: string]: iSet}};
  chapters: Chapters;
}

export interface Chapters {
  [s: string]: TermChapters;
}

export interface TermChapters {
  [s: string]: number;
}

export interface iSet {
  name: string;
  questionNumber: number;
}

const useQuiz = (TutorCenterID: string): iTermInfo => {
  const ID = TutorCenterID ?? '';

  const [termInfo, setTermInfo] = useState<iTermInfo>({sets: {}, chapters: {}});

  useEffect(() => {
    const unsubscribe = firestore()
      .doc(`customQuestion/${ID}`)
      .onSnapshot(
        snapshot => {
          let temp: any = {};
          temp.chapters = snapshot.data()?.chapters ?? {};
          temp.sets = snapshot.data()?.sets ?? {};
          setTermInfo(temp);
        },
        error => {
          console.log(error);
        },
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return termInfo;
};

export default useQuiz;
