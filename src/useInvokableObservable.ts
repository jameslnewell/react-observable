import {useReducer, useEffect, Reducer, useRef} from 'react';
import {Subscription} from '@jameslnewell/observable';
import {Factory, Dependencies, Metadata} from './types';
import {State} from './utils/State';
import {Action, reset} from './utils/Action';
import {useMounted} from './utils/useMounted';
import {reducer} from './utils/reducer';
import {initialState} from './utils/initialState';
import {invoke} from './utils/invoke';
import {getMetadata} from './utils/getMetadata';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useInvokableObservable<T, E = any, P extends any[] = any[]>(
  fn: Factory<T, P> | undefined,
  deps: Dependencies = [],
): [(...args: P) => void, T | undefined, Metadata<E>] {
  const isMounted = useMounted();
  const subscription = useRef<Subscription | undefined>(undefined);
  const [state, dispatch] = useReducer<Reducer<State<T, E>, Action<T, E>>>(
    reducer,
    initialState,
  );

  // reset observable state whenever the dependencies change i.e. the result returned by the function will be a new observable
  useEffect(() => {
    dispatch(reset());
    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
        subscription.current = undefined;
      }
    };
  }, deps);

  return [
    (...args: P) => {
      if (fn) {
        subscription.current = invoke<T, E, P>({fn, dispatch, isMounted}, args);
      }
    },
    state.value,
    getMetadata(state),
  ];
}
