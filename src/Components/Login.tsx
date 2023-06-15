import React from 'react'
import classes from './Login.module.css'
import { useState, useRef } from 'react'
import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../hooks'
import { userActions } from '../Stores/UserSlice'
import { checkUsername, logOut } from '../firebaseFunctions'
import { login, signUp } from '../Stores/UserSlice'
import { generateName } from '../helpers'
// import { GoogleLogin } from '../store/userStore'

// import { signUp, logIn, logout } from '../store/userStore'

export interface User {
  username: string
  password: string
  email: string
}

const initialValues: User = {
  username: '',
  password: '',
  email: '',
}

const Login = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  // const userStore = useAppSelector((state) => state.user)
  // const cart = useAppSelector((state) => state.cart)
  const userState = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loginMode, setloginMode] = useState(true)
  const specialRegex = /^[\p{L}0-9 .]+$/gu
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return (
    <div className={classes.loginContainer}>
      {/* {!userStore.loggedIn && ( */}
      <div className={classes.loginSwitch}>
        <label htmlFor='switch'>Login</label>
        <input
          type='checkbox'
          id='switch'
          onChange={(e) => {
            setloginMode(!e.target.checked)
          }}
        />
        <label htmlFor='switch'>Sign Up</label>
      </div>
      {/* )} */}
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          // username: Yup.string()
          //   .required('You must select a username.')
          //   .matches(specialRegex),
          username: Yup.string().when('loginMode', (username) =>
            username
              ? Yup.string()
              : Yup.string()
                  .required('You must provide a username')
                  .matches(specialRegex)
          ),
          email: Yup.string().required('Email is required').matches(emailRegex),
          password: Yup.string()
            .required('You must provide a password')
            .min(6, 'Must be at least six characters long'),
        })}
        onSubmit={(values, { resetForm }) => {
          const user = {
            username: values.username || generateName(),
            password: values.password,
            email: values.email,
          }

          if (!loginMode) {
            dispatch(signUp(user))
            resetForm()
          } else {
            if (userState.loggedIn) {
              alert('User is already logged in.')
              return
            }
            dispatch(login(user))
            resetForm()

            return
          }
          // }
        }}
      >
        {(formik) => (
          <form className={classes.login} onSubmit={formik.handleSubmit}>
            {!loginMode && (
              <div className={classes.fieldContainer}>
                <label
                  htmlFor='username'
                  placeholder='Your username'
                  defaultValue={loginMode ? 'login' : ''}
                >
                  Username
                </label>
                <input
                  type='username'
                  ref={nameRef}
                  id='username'
                  {...formik.getFieldProps('username')}
                />
                <button
                  className={classes.randomName}
                  type='button'
                  onClick={() => {
                    const name = generateName()
                    nameRef.current.value = name
                  }}
                >
                  Choose Random Username
                </button>
                {formik.errors.username && formik.touched.username ? (
                  <p className={classes.error}>{formik.errors.username}</p>
                ) : null}
              </div>
            )}
            <div className={classes.fieldContainer}>
              <label htmlFor='emailLogin' placeholder='Your email'>
                Email
              </label>
              <input
                type='email'
                id='emailLogin'
                {...formik.getFieldProps('email')}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className={classes.error}>Email is not valid</p>
              ) : null}
            </div>
            <div className={classes.fieldContainer}>
              <label htmlFor='passwordcheck' placeholder='Your password'>
                Password
              </label>
              <input
                type='password'
                id='passwordcheck'
                {...formik.getFieldProps('password')}
              />
              {formik.errors.password && formik.touched.password ? (
                <p className={classes.error}>{formik.errors.password}</p>
              ) : null}
            </div>

            <div className={classes.btns}>
              <button className={classes.loginBtn} type='submit'>
                {!loginMode ? 'SIGN UP' : 'LOGIN'}
              </button>
            </div>
          </form>
        )}
      </Formik>

      <button
        onClick={() => {
          console.log(userState)
          // checkUsername('kiko')
          console.log(checkUsername('kiko'))
        }}
      >
        state
      </button>
    </div>
  )
}

export default Login
