import { PulseLoader } from 'react-spinners';
import classes from './Loader.module.css';

const Loader = () => {
  return <PulseLoader className={classes.loader} />;
};

export default Loader;
