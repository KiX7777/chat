import Login from '../Components/Login';
import classes from './LoginPage.module.css';
import { motion } from 'framer-motion';
import { PageVariants } from '../utilities/helpers';

const LoginPage = () => {
  return (
    <motion.div
      variants={PageVariants}
      animate='visible'
      initial='hidden'
      exit='exit'
      className={classes.container}
    >
      <Login />
    </motion.div>
  );
};

export default LoginPage;
