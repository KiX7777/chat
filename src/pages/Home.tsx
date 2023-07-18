import classes from './Home.module.css';
import Chat from '../Components/Chat';
import { useAppSelector } from '../hooks';
import { motion } from 'framer-motion';
import { PageVariants } from '../utilities/helpers';

const Home = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <motion.div
      variants={PageVariants}
      animate='visible'
      initial='hidden'
      exit='exit'
      className={classes.homeContainer}
    >
      <Chat />
      {user.error && <h1>{user.error}</h1>}
    </motion.div>
  );
};

export default Home;
