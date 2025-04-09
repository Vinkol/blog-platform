import cl from './SignUp.module.sass';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, FieldError } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/registrationSlice';
import { useCreateUserMutation } from '../../store/apiSlice';
import { Button } from 'antd';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createUser] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const resp = await createUser({
        username: data.userName,
        email: data.email,
        password: data.password,
      }).unwrap();

      if (resp.user && resp.user.token) {
        localStorage.setItem('token', resp.user.token);
      }

      reset();
      dispatch(
        setUser({
          userName: data.userName,
          urlImage: 'https://s3-alpha-sig.figma.com/img/ec78/8be1/2bf7cbea0e8e0ac709ec6af74b5bc3fa?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IsjM8h~DUA9w-S6BVaBSvv4KGQxj6J9M1PxakhkjEJXi2kQAQUvrlWKd6gT5KB27XD8aKCYdvFvUXev2w8igTJh8naJrkLXFHDNYu2pw27uopRhr~P1bziIqF7xp75EG~Zz51h9~3VKmk-o0D7vTTuya~k7AjysuvGXiPjX~MsHxzXiyJuL6DPpWZuFscRyqe0WUjL8tcuYRIOafRBlyKk~bgAEigKrkcKGryeA~IuM0TC8ygEq3J~gMB~Hsd3C3bHsvI6w22XUGJUcFn1UinhtCKQuJO4bC4N-UdUa3-Or-AnPapc-HCB4cCJDHPUXg9MDjEq25ZzYB2jg~VAzx~g__',
          password: data.password,
        })
      );

      navigate('/');
    } catch (err) {
      console.error('Failed to register user: ', err);
      if (err.data && err.data.errors) {
        if (err.data.errors['username']) {
          setError('userName', {
            type: 'server',
            message: 'is already taken',
          });
        } else if (err.data.errors['email']) {
          setError('email', {
            type: 'server',
            message: 'is already taken',
          });
        }
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const password = watch('password');
  const isConsent = watch('consent');

  return (
    <div className={cl.signIn}>
      <h1 className={cl.title}>Create new account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cl.wrap}>
          <label className={cl.labelEmail} htmlFor="userName">
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
          {errors.userName && <p className={cl.error}>{(errors.userName as FieldError).message}</p>}

          <label className={cl.labelEmail} htmlFor="email">
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
            type="email"
            onBlur={() => trigger('email')}
            className={errors.email ? `${cl.email} ${cl.inputRed}` : cl.email}
          />
          {errors.email && <p className={cl.error}>{(errors.email as FieldError).message}</p>}

          <label className={cl.labelPassword} htmlFor="password">
            Password
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
            placeholder="Password"
            type="password"
            className={errors.password ? `${cl.password} ${cl.inputRed}` : cl.password}
            onBlur={() => trigger('password')}
          />
          {errors.password && <p className={cl.error}>{(errors.password as FieldError).message}</p>}

          <label className={cl.labelPasswordAgain} htmlFor="passwordAgain">
            Repeat Password
          </label>
          <input
            {...register('passwordAgain', {
              required: 'Enter your password',

              validate: (value) => value === password || 'The passwords do not match',
            })}
            placeholder="Password"
            type="password"
            onBlur={() => trigger('passwordAgain')}
            className={
              errors.passwordAgain ? `${cl.password} ${cl.inputRed}` : cl.password
            }
          />
          {errors.passwordAgain && <p className={cl.error}>{(errors.passwordAgain as FieldError).message}</p>}

          <div className={cl.agreementWrap}>
            <input {...register('consent')} className={cl.checkbox} type="checkbox" />
            <p className={cl.agreement}>
              I agree to the processing of my personal <br />
              information
            </p>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className={!isConsent ? `${cl.btnLogin} ${cl.disabled}` : `${cl.btnLogin}`}
          disabled={!isConsent}
        >
          Create
        </Button>
      </form>
      <p className={cl.info}>
        Already have an account? <Link to={'/signIn'}>Sign In.</Link>
      </p>
    </div>
  );
};

export default SignUp;