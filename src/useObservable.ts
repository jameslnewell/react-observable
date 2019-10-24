import {useReducer, useEffect, Reducer, useRef} from 'react';
import {Subscription} from '@jameslnewell/observable';
import {Factory, Dependencies} from './types';
import {State} from './utils/State';
import {Action, reset} from './utils/Action';
import {useMounted} from './utils/useMounted';
import {reducer} from './utils/reducer';
import {initialState} from './utils/initialState';
import {invoke} from './utils/invoke';
import {getOutput, Output} from './utils/getOutput';

export function useObservable<T>(
  fn: Factory<T, []> | undefined,
  deps: Dependencies = [],
): Output<T> {
  const subscription = useRef<Subscription | undefined>(undefined);
  const mounted = useMounted();
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (fn) {
      subscription.current = invoke({fn, dispatch, mounted}, []);
    } else {
      dispatch(reset());
    }
    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
        subscription.current = undefined;
      }
    };
  }, deps);

  return getOutput(state);
}
