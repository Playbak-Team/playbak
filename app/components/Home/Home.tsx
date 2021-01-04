import React from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './Home.css';
import { HomeProps } from '../../types';

export default function Home(props: HomeProps): JSX.Element {
  const { name, quote } = props;
  return (
    <div className={styles.container} data-tid="container">
      <div style={{ justifySelf: 'center', marginTop: 'auto' }}>
        <Typography variant="h2" color="initial">
          Hello
        </Typography>
        <Typography variant="h2" color="initial">
          {name}
        </Typography>
      </div>
      <div
        style={{
          justifySelf: 'flex-end',
          marginTop: 'auto',
          marginBottom: '5vh',
        }}
      >
        <Typography variant="h4" color="initial">
          {quote}
        </Typography>
      </div>
    </div>
  );
}
