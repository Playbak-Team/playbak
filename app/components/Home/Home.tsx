import React from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './Home.css';
import { HomeProps } from '../../types';

export default function Home(props: HomeProps): JSX.Element {
  const { name, quote } = props;
  return (
    <div className={styles.container} data-tid="container">
      <Typography variant="h2" color="textPrimary">
        Hello
      </Typography>
      <Typography variant="h2" color="textPrimary">
        {name}
      </Typography>
      <Typography variant="h4" color="textPrimary">
        {quote}
      </Typography>
    </div>
  );
}
