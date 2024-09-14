/* eslint-disable react-hooks/exhaustive-deps */

import { DependencyList, useEffect, useRef } from "react";
import { Observable, Subject } from "rxjs";

export function useSubject<T>(): Subject<T> {
  const subjectRef = useRef<Subject<T>>();

  if (!subjectRef.current) {
    subjectRef.current = new Subject<T>();
  }

  return subjectRef.current;
}

export function useObservable<T>(
  observable: Observable<T>,
  handler: (value: T) => void,
  deps: DependencyList[],
) {
  useEffect(() => {
    const subscription = observable.subscribe(handler);
    return () => subscription.unsubscribe();
  }, deps);
}
