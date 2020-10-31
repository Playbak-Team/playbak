import React from 'react';
import styles from './Home.css';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Hello, __name__</h2>
      <h3>Insert Shitty Quote Here</h3>
    </div>
  );
}
