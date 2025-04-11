import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd'

import { logout } from '../../Store/regSlice'
import { useGetUserQuery, apiSlice } from '../../api/apiSlice'
import { RootState } from '../../Store/store'

import cl from './Header.module.sass'

const Header = () => {
  const user = useSelector((state: RootState) => state.reg.user)
  const { userName } = user || {}
  const token = localStorage.getItem('token')
  const {
    data: userData,
    isLoading,
    error,
  } = useGetUserQuery(undefined, {
    skip: !token,
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logOut = () => {
    dispatch(logout())
    dispatch(apiSlice.util.resetApiState())
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className={cl.wrap}>
        <p>Loading user data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cl.wrap}>
        <p>Failed to load user data.</p>
      </div>
    )
  }

  return (
    <div className={cl.wrap}>
      <Link className={cl.title} to={'/'}>
        Realworld Blog
      </Link>
      {!userName ? (
        <div>
          <Link className={cl.signIn} to={'/sign-in'}>
            <Button>Sign In</Button>
          </Link>
          <Link to={'/sign-up'}>
            <Button className={`${cl.signUp} ${cl.active}`}>Sign Up</Button>
          </Link>
        </div>
      ) : (
        <div className={cl.userInfo}>
          <Link to={'/new-article'}>
            <Button className={cl.active}>Create article</Button>
          </Link>
          <Link
            to={'/profile'}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <p className={cl.userName}>{userName}</p>
            <img
              className={cl.imageUser}
              src={
                userData?.user?.image ||
                'https://s3-alpha-sig.figma.com/img/ec78/8be1/2bf7cbea0e8e0ac709ec6af74b5bc3fa?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IsjM8h~DUA9w-S6BVaBSvv4KGQxj6J9M1PxakhkjEJXi2kQAQUvrlWKd6gT5KB27XD8aKCYdvFvUXev2w8igTJh8naJrkLXFHDNYu2pw27uopRhr~P1bziIqF7xp75EG~Zz51h9~3VKmk-o0D7vTTuya~k7AjysuvGXiPjX~MsHxzXiyJuL6DPpWZuFscRyqe0WUjL8tcuYRIOafRBlyKk~bgAEigKrkcKGryeA~IuM0TC8ygEq3J~gMB~Hsd3C3bHsvI6w22XUGJUcFn1UinhtCKQuJO4bC4N-UdUa3-Or-AnPapc-HCB4cCJDHPUXg9MDjEq25ZzYB2jg~VAzx~g__'
              }
              alt="imageUser"
            />
          </Link>
          <Button onClick={logOut} className={cl.logOut}>
            Log Out
          </Button>
        </div>
      )}
    </div>
  )
}

export default Header
