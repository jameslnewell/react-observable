import * as React from 'react';
import {useObservable} from '../src';
import {ObservableType, createObservable} from './createObservable';
import {ObservableState} from './ObservableState';
import {ObservableConfig} from './ObservableConfig';
import './styles.css';

export default {
  title: 'react-observable/useObservable',
};

export const Demo = () => {
  const [type, setType] = React.useState<ObservableType>(
    ObservableType.Completed,
  );
  const [delay, setDelay] = React.useState(1000);
  const {status, error, value} = useObservable(createObservable(type, delay), [
    type,
    delay,
  ]);

  const handleChange = ({
    type,
    delay,
  }: {
    type: ObservableType;
    delay: number;
  }): void => {
    setType(type);
    setDelay(delay);
  };

  return (
    <>
      <ObservableState status={status} error={error} value={value} />
      <ObservableConfig
        initialType={type}
        initialDelay={delay}
        onChange={handleChange}
      />
    </>
  );
};
