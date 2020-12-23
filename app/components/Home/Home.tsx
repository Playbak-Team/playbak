import React from 'react';
import styles from './Home.css';
import { HomeProps } from '../../types';

export default function Home(props: HomeProps): JSX.Element {
  const { name } = props;
  return (
    <div className={styles.container} data-tid="container">
      <h2>Hello</h2>
      <h2>{name}</h2>
      <h3>Insert Shitty Quote Here</h3>
    </div>
  );
}
