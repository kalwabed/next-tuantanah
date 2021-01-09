import { useMutation } from 'react-query'
import jwt from 'jsonwebtoken'

import { userLogin, userSignUp } from '@/lib/AuthApi'
import { useCookie, useLocalStorage } from '@/lib/auth'
import { v4 } from 'uuid'

export const useLogin = () => {
  const { data, mutateAsync, isLoading } = useMutation(userLogin, {
    onSuccess: res => {
      const token = JSON.stringify(res.token).slice(1, -1)
      const userCred = jwt.sign({ userCred: token }, 'super-secret', { expiresIn: '14d' })
      // set user session and user credentials.
      // don't using this method, I couldn't recommend to implement on real apps
      useCookie('set', v4()) // as session
      useLocalStorage('set', userCred)
    }
  })
  return { mutateUser: mutateAsync, user: data, isLoading }
}

export const useSignUp = () => {
  const { data, mutateAsync, isLoading } = useMutation(userSignUp, {
    onSuccess: res => {
      // TODO: redirect after user register
      console.log(res)
    }
  })

  return { mutateUserSignUp: mutateAsync, isLoading, user: data }
}
