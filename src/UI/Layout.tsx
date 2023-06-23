import classes from './Layout.module.css';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { userActions } from '../Stores/UserSlice';
import i18n from '../i18n';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.user.language);
  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang_code = e.target.value;
    dispatch(userActions.setLanguage(e.target.value));
    i18n.changeLanguage(lang_code);
  };

  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <Link to={'/'}>
          <img src='/logo.webp' alt='Chatter logo' />
        </Link>
        <select onChange={onChangeLang} value={currentLanguage} id='language'>
          <option value='hr'>🇭🇷</option>
          <option value='en'>🇬🇧</option>
        </select>
      </header>
      {children}
      <footer>
        <a href='https://github.com/KiX7777' target='_blank'>
          Created by Kristian Božić <sup>Ⓡ</sup>
        </a>
      </footer>
    </div>
  );
};

export default Layout;
