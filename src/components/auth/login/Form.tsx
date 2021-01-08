import { Badge, Form } from 'react-bootstrap'
import { ErrorMessage } from '@hookform/error-message'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import ButtonLoading from '@/shared/ButtonLoading'

interface SignInForm {
  email: string
  password: string
}

const LoginForm = () => {
  const { register, handleSubmit, watch, errors } = useForm<SignInForm>()
  const isLoading = false

  const onSubmit = async (data: SignInForm) => {
    // toast.dismiss()
    toast('Sayangkuu')
    // const res = await mutate({ email: data.email, password: data.password })
    // if (res?.success === true) {
    //   // SUKSES LOGIN
    //   setToken(res.token!, true)
    //   setIsAuthenticated(true)
    // } else {
    //   // GAGAL LOGIN
    //   if (res?.errorCode === 400) {
    //     // bad request
    //     toast.warning(res?.msg)
    //   } else {
    //     // unauthorized
    //     toast.info(res?.msg)
    //   }
    // }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label>Alamat Email</Form.Label>
        <Form.Control
          ref={register({
            required: 'Mohon sertakan Alamat Email yang valid',
            pattern: {
              value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
              message: 'Mohon sertakan format Alamat Email yang valid'
            }
          })}
          name="email"
          autoFocus
          type="email"
          disabled={isLoading}
        />
        <ErrorMessage
          name="email"
          errors={errors}
          render={({ message }) => <Badge variant="warning">{message}</Badge>}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Kata Sandi</Form.Label>
        <Form.Control
          name="password"
          type="password"
          ref={register({
            required: 'Mohon sertakan Kata Sandi yang valid'
          })}
          disabled={isLoading}
        />
        <ErrorMessage
          name="password"
          errors={errors}
          render={({ message }) => <Badge variant="warning">{message}</Badge>}
        />
      </Form.Group>
      <Form.Group className="m-0">
        <ButtonLoading fill="Masuk" block password={watch('password')} loading={isLoading} type="submit" />
      </Form.Group>
      <div className="mt-4 text-center">
        belum punya akun?{' '}
        <Link href="/signup">
          <a>daftar</a>
        </Link>
      </div>
      <p className="text-center">
        kembali ke{' '}
        <Link href="/">
          <a>home</a>
        </Link>
      </p>
    </Form>
  )
}

export default LoginForm
