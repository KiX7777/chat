import classes from './Login.module.css';
import { useState, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login, signUp } from '../Stores/UserSlice';
import { generateName } from '../utilities/helpers';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

const formVariants = {
  hidden: {
    opacity: 0,
  },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export interface User {
  username: string;
  password: string;
  email: string;
}

const initialValues: User = {
  username: '',
  password: '',
  email: '',
};

const Login = () => {
  const { t } = useTranslation();
  const nameRef = useRef<HTMLInputElement>(null);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [loginMode, setloginMode] = useState(true);
  const specialRegex = /^[\p{L}0-9 .]+$/gu;
  const emailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <div className={classes.loginContainer}>
      {/* {!userStore.loggedIn && ( */}
      <div className={classes.loginSwitch}>
        <label htmlFor='switch'>{t('login')}</label>
        <input
          type='checkbox'
          id='switch'
          onChange={(e) => {
            setloginMode(!e.target.checked);
          }}
        />
        <label htmlFor='switch'>{t('SignUp')}</label>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          username: Yup.string().when('loginMode', (username) =>
            username
              ? Yup.string()
              : Yup.string()
                  .required(t('usernameRequired'))
                  .matches(specialRegex)
          ),
          email: Yup.string()
            .required(t('emailRequired'))
            .matches(emailRegex, t('emailIncorrect')),
          password: Yup.string()
            .required(t('passwordRequired'))
            .min(6, t('passwordInvalid')),
        })}
        onSubmit={(values, { resetForm }) => {
          const user = {
            username: values.username || generateName(),
            password: values.password,
            email: values.email,
          };
          //if the login mode is selected, log in the user, otherwise create new account
          if (!loginMode) {
            dispatch(signUp(user));
            resetForm();
          } else {
            if (userState.loggedIn) {
              alert(t('alreadyLogged'));
              return;
            }
            dispatch(login(user));
            resetForm();
            // navigate('/');

            return;
          }
        }}
      >
        {(formik) => (
          <form className={classes.login} onSubmit={formik.handleSubmit}>
            <AnimatePresence mode='popLayout'>
              {!loginMode && (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  key='usernameForm'
                  exit='exit'
                  layout
                  variants={formVariants}
                  className={classes.fieldContainer}
                >
                  <label htmlFor='username' placeholder='Your username'>
                    {t('username')}
                  </label>
                  <input
                    type='username'
                    ref={nameRef}
                    autoComplete='off'
                    id='username'
                    {...formik.getFieldProps('username')}
                  />
                  <button
                    className={classes.randomName}
                    type='button'
                    onClick={() => {
                      const name = generateName();
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      nameRef.current!.value = name;
                      formik.values.username = name;
                    }}
                  >
                    {t('randomUsername')}
                  </button>
                  {formik.errors.username && formik.touched.username ? (
                    <p className={classes.error}>{formik.errors.username}</p>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial='hidden'
              animate='visible'
              key='emailForm'
              layout
              exit='exit'
              variants={formVariants}
              className={classes.fieldContainer}
            >
              <label htmlFor='emailLogin' placeholder='Your email'>
                Email
              </label>
              <input
                type='email'
                id='emailLogin'
                autoComplete='off'
                {...formik.getFieldProps('email')}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className={classes.error}>{formik.errors.email}</p>
              ) : null}
            </motion.div>
            <motion.div
              initial='hidden'
              animate='visible'
              key='passwordForm'
              layout
              exit='exit'
              variants={formVariants}
              className={classes.fieldContainer}
            >
              <label htmlFor='passwordcheck' placeholder='Your password'>
                {t('password')}
              </label>
              <input
                type='password'
                autoComplete='off'
                id='passwordcheck'
                {...formik.getFieldProps('password')}
              />
              {formik.errors.password && formik.touched.password ? (
                <p className={classes.error}>{formik.errors.password}</p>
              ) : null}
            </motion.div>

            <div className={classes.btns}>
              <button className={classes.loginBtn} type='submit'>
                {!loginMode ? t('SignUp') : t('login')}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
