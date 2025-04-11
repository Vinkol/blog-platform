import { useForm, FieldError } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useUpdateUserMutation } from '../../api/apiSlice'
import { setUser } from '../../Store/regSlice'
import { RootState } from '../../Store/store'

import cl from './Profile.module.sass'

type UserData = {
  email: string
  username: string
  password: string
  image: string
}

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [updateUser] = useUpdateUserMutation()
  const user = useSelector((state: RootState) => state.reg.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
  } = useForm<UserData>()

  useEffect(() => {
    if (user) {
      for (const [key, value] of Object.entries(user)) {
        setValue(key as keyof UserData, value as string)
      }
    }
  }, [setValue, user])

  const onSubmit = async (data: UserData) => {
    console.log(data)
    try {
      const updateData = {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.image,
      }

      const response = await updateUser(updateData).unwrap()
      dispatch(
        setUser({
          userName: response.user.username,
          email: response.user.email,
          token: response.user.token,
          urlImage: response.user.image,
        }),
      )
      reset()
      navigate('/')
    } catch (err) {
      console.error('Ошибка обновления профиля:', err)
    }
  }

  return (
    <div className={cl.signIn}>
      <h1 className={cl.title}>Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cl.wrap}>
          <label className={cl.labelEmail} htmlFor="username">
            User name
          </label>
          <input
            {...register('username', {
              required: 'Enter username',
              minLength: {
                value: 3,
                message: 'The name must be at least 3 characters long',
              },
              maxLength: {
                value: 20,
                message: 'The name must be no more than 20 characters long',
              },
            })}
            placeholder="User name"
            type="text"
            onBlur={() => trigger('username')}
            className={errors.username ? `${cl.userName} ${cl.inputRed}` : cl.userName}
          />
          {errors.username && <p className={cl.error}>{(errors.username as FieldError).message}</p>}

          <label className={cl.labelEmail} htmlFor="email">
            Email address
          </label>
          <input
            {...register('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid mail format',
              },
            })}
            placeholder="Email address"
            onBlur={() => trigger('email')}
            type="email"
            className={errors.email ? `${cl.email} ${cl.inputRed}` : cl.email}
          />
          {errors.email && <p className={cl.error}>{(errors.email as FieldError).message}</p>}

          <label className={cl.labelPassword} htmlFor="password">
            New password
          </label>
          <input
            {...register('password', {
              required: 'Enter your password',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              maxLength: {
                value: 40,
                message: 'The password must be no more than 40 characters long.',
              },
            })}
            placeholder="New password"
            type="password"
            onBlur={() => trigger('password')}
            className={errors.password ? `${cl.password} ${cl.inputRed}` : cl.password}
          />
          {errors.password && <p className={cl.error}>{(errors.password as FieldError).message}</p>}

          <label className={cl.labelPasswordAgain} htmlFor="image">
            Avatar image (url)
          </label>
          <input
            {...register('image', {
              required: 'Enter url',
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: 'Enter correct url',
              },
            })}
            placeholder="Avatar image"
            type="text"
            onBlur={() => trigger('image')}
            className={errors.image ? `${cl.password} ${cl.inputRed}` : cl.password}
          />
          {errors.image && <p className={cl.error}>{(errors.image as FieldError).message}</p>}
        </div>
        <button type="submit" className={cl.btnLogin}>
          Save
        </button>
      </form>
    </div>
  )
}

export default Profile
