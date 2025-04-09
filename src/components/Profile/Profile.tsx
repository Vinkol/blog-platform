import cl from './Profile.module.sass';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUpdateUserMutation } from '../../store/apiSlice';
import { setUser } from '../../store/registrationSlice';
import { useEffect } from 'react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();
  const user = useSelector((state) => state.registration.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    for (const [key, value] of Object.entries(user)) {
      setValue(key, value);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await updateUser({
        username: data.userName,
        email: data.email,
        password: data.newPassword,
        image: data.urlImage,
      }).unwrap();
      dispatch(
        setUser({
          userName: response.user.username,
          email: response.user.email,
          token: response.user.token,
          urlImage: response.user.image,
        })
      );
      reset();
      navigate('/');
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  return (
    <div className={cl.signIn}>
      <h1 className={cl.title}>Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cl.wrap}>
          <label className={cl.labelEmail} htmlFor="">
            User name
          </label>
          <input
            {...register('userName', {
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
            onBlur={() => trigger('userName')}
            className={errors.userName ? `${cl.userName} ${cl.inputRed}` : cl.userName}
          />
          {errors.userName && <p className={cl.error}>{errors.userName.message}</p>}
          <label className={cl.labelEmail} htmlFor="">
            Email address
          </label>
          <input
            {...register('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid mail format',
              },
            })}
            placeholder="Email address"
            onBlur={() => trigger('email')}
            type="email"
            className={errors.email ? `${cl.email} ${cl.inputRed}` : cl.email}
          />
          {errors.email && <p className={cl.error}>{errors.email.message}</p>}
          <label className={cl.labelPassword} htmlFor="">
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
            onBlur={() => trigger('newPassword')}
            className={
              errors.newPassword ? `${cl.password} ${cl.inputRed}` : cl.password
            }
          />
          {errors.newPassword && <p className={cl.error}>{errors.newPassword.message}</p>}

          <label className={cl.labelPasswordAgain} htmlFor="">
            Avatar image (url)
          </label>
          <input
            {...register('urlImage', {
              required: 'Enter url',
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: 'Enter correct url',
              },
            })}
            placeholder="Avatar image"
            type="text"
            onBlur={() => trigger('urlImage')}
            className={errors.urlImage ? `${cl.password} ${cl.inputRed}` : cl.password}
          />
          {errors.urlImage && <p className={cl.error}>{errors.urlImage.message}</p>}
        </div>
        <button type="submit" className={cl.btnLogin}>
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
