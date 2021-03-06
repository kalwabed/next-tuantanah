import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Form, Col, Button, Badge, InputGroup, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'

import { UserInput, ApiKotaKabResponse, ApiProvinsiResponse } from '@/shared/interface'
import sdk from '@/sdk/property'
import { UserCredential } from '@/contexts/AuthContext'

const ContentEditor = dynamic(() => import('@/shared/ContentEditor'), { loading: () => <Spinner animation="grow" /> })

type Props = {
  user: UserCredential
  dataProvinsi: ApiProvinsiResponse
}

const AddPropertyForm = ({ user, dataProvinsi }: Props) => {
  const { watch, register, handleSubmit, errors, setValue } = useForm<UserInput>()
  const [isLuas, setIsLuas] = useState(false)
  const [label, setLabel] = useState('Unggah foto')
  const [kota, setKota] = useState<number>(11)
  const [description, setDescription] = useState('')
  const { cities, isFetching, isLoading } = sdk.getKotaByProv(kota)
  const { mutateAsync, mutateIsLoading } = sdk.addProperty()

  const onSubmit = async (data: UserInput) => {
    if (!description) return alert('Mohon sertakan deskripsi')

    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('title', data.title)
    formData.append('provinsi', data.provinsi)
    formData.append('kota', data.kota)
    formData.append('description', description)
    formData.append('luas', String(data.luas))
    formData.append('panjang', String(data.panjang))
    formData.append('lebar', String(data.lebar))
    formData.append('price', String(data.price))
    formData.append('userId', user._id)
    formData.append('isLuas', String(isLuas))
    formData.append('mainPicture', data.mainPicture[0])
    formData.append('nego', String(data.nego))
    formData.append('kontak1', String(data.kontak1))
    formData.append('kontak2', String(data.kontak2))
    formData.append('kontak3', String(data.kontak3))
    formData.append('kontak4', String(data.kontak4))
    formData.append('checkKontak1', String(data.checkKontak1))
    formData.append('checkKontak2', String(data.checkKontak2))
    formData.append('checkKontak3', String(data.checkKontak3))
    formData.append('checkKontak4', String(data.checkKontak4))
    formData.append('userKontak1', String(data.userKontak1))
    formData.append('userKontak2', String(data.userKontak2))
    formData.append('userKontak3', String(data.userKontak3))
    formData.append('userKontak4', String(data.userKontak4))

    //? for development purpose!
    // formData.forEach((val, key) => {
    //   console.log(`${key}, ${val}`)
    // })
    //? ----------------------

    try {
      const newProp = await mutateAsync(formData)
      if (newProp?.success) {
        toast.success(newProp.msg)
        setValue('title', '')
        setDescription('')
        setValue('luas', '')
        setIsLuas(false)
        setValue('panjang', '')
        setValue('lebar', '')
        setValue('price', '')
        setLabel('Unggah foto')
      } else {
        toast.error(newProp?.msg)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* fullname dan title */}
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Nama Lengkap / Nama Perusahaan</Form.Label>
            <Form.Control
              ref={register}
              name="fullName"
              placeholder="contoh: Kaliwa Coorporation"
              defaultValue={user.fullName}
              readOnly
              aria-describedby="fullNameHelp"
            />
            <Form.Text id="fullNameHelp" muted>
              Masukan diatas otomatis merujuk pada Nama pengguna
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="input-title" as={Col}>
            <Form.Label>Judul</Form.Label>
            <Form.Control
              ref={register({
                required: 'Mohon sertakan judul yang valid',
                minLength: {
                  value: 5,
                  message: 'Panjang minimal adalah 5 karakter'
                }
              })}
              name="title"
              placeholder="contoh: Kaliwa Residence"
              aria-describedby="titleHelp"
            />
            <Form.Text id="titleHelp" muted>
              Judul bisa diisi dengan nama lahan, nama perumahan, dsb.
            </Form.Text>
            <ErrorMessage
              name="title"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
        </Form.Row>

        {/* lokasi */}
        <Form.Row>
          <Form.Group as={Col} controlId="select-provinsi">
            <Form.Label>Provinsi</Form.Label>
            <Form.Control
              ref={register({ required: 'Mohon sertakan provinsi yang valid' })}
              name="provinsi"
              as="select"
              custom
              disabled={isLoading}
              onChange={e => setKota(+e.target.value)}
            >
              <option value="" disabled>
                -- Provinsi --
              </option>
              {dataProvinsi.provinsi.map(prov => (
                <option key={prov.id} value={prov.id}>
                  {prov.nama}
                </option>
              ))}
              <ErrorMessage
                name="provinsi"
                errors={errors}
                render={({ message }) => <Badge variant="warning">{message}</Badge>}
              />
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="select-kota">
            <Form.Label>Kota / Kabupaten</Form.Label>
            <Form.Control
              ref={register({
                required: 'Mohon sertakan Kota / Kabupaten yang valid'
              })}
              name="kota"
              as="select"
              custom
              disabled={isLoading}
            >
              <option value="" disabled>
                -- Kota --
              </option>
              {cities &&
                cities.kota_kabupaten.map((kota: ApiKotaKabResponse) => (
                  <option key={kota.id} value={kota.id}>
                    {kota.nama}
                  </option>
                ))}
            </Form.Control>
            {isFetching && <span className="text-secondary">Updating...</span>}
            <ErrorMessage
              name="kota"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
        </Form.Row>

        {/* Panjang & lebar */}
        <Form.Row>
          <Form.Group controlId="input-panjang" as={Col}>
            <Form.Label>Panjang</Form.Label>
            <Form.Control
              disabled={isLuas}
              ref={register({
                required: {
                  message: 'Mohon sertakan panjang yang valid',
                  value: !isLuas
                }
              })}
              name="panjang"
              placeholder="contoh: 10"
              aria-describedby="panjangHelp"
            />
            <Form.Text id="panjangHelp" muted>
              Panjang properti berdasarkan ukuran meter (m)
            </Form.Text>
            <ErrorMessage
              name="panjang"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
          <Form.Group controlId="input-lebar" as={Col}>
            <Form.Label>Lebar</Form.Label>
            <Form.Control
              disabled={isLuas}
              ref={register({
                required: {
                  message: 'Mohon sertakan lebar yang valid',
                  value: !isLuas
                }
              })}
              name="lebar"
              placeholder="contoh: 12,7"
              aria-describedby="lebarHelp"
            />
            <Form.Text id="lebarHelp" muted>
              Lebar properti berdasarkan ukuran meter (m)
            </Form.Text>
            <ErrorMessage
              name="lebar"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
        </Form.Row>

        {/* Ceklis pakai luas */}
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Check
              label="Pakai ukuran luas"
              custom
              defaultChecked={isLuas}
              id="pan-luas-check"
              onClick={() => setIsLuas(!isLuas)}
            />
            <Form.Text muted>Pakai luas jika properti Anda bukan berupa rumah (contoh: kebun, lahan, dsb)</Form.Text>
          </Form.Group>
        </Form.Row>

        {/* Luas */}
        <Form.Row>
          <Form.Group as={Col} controlId="input-luas">
            <Form.Label>Luas</Form.Label>
            <InputGroup>
              <Form.Control
                disabled={!isLuas}
                ref={register({
                  required: {
                    message: 'Mohon sertakan luas yang valid',
                    value: isLuas
                  }
                })}
                name="luas"
                placeholder="contoh: 3"
                aria-describedby="luasHelp"
              />
              <InputGroup.Append>
                <InputGroup.Text>Hektar</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text id="luasHelp" muted>
              Luas properti berdasarkan ukuran hektar (ha)
            </Form.Text>
            <ErrorMessage
              name="luas"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
        </Form.Row>

        {/* harga dan foto utama */}
        <Form.Row>
          <Form.Group controlId="input-harga" as={Col}>
            <Form.Label>Harga</Form.Label>
            <InputGroup>
              <Form.Control
                ref={register({
                  required: 'Mohon sertakan harga yang valid',
                  pattern: {
                    // eslint-disable-next-line no-useless-escape
                    value: /^([1-9]\d*(\.|\,)\d*|0?(\.|\,)\d*[1-9]\d*|[1-9]\d*)$/gm,
                    message: 'Hanya menerima masukan angka, koma, dan titik'
                  }
                })}
                name="price"
                placeholder="contoh: 190"
                aria-describedby="priceHelp"
              />
              <InputGroup.Append>
                <InputGroup.Text>Juta</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text id="priceHelp" muted>
              Harga properti dalam format angka, satuan juta (contoh: 90,3 [berarti 90,3 juta])
            </Form.Text>
            <ErrorMessage
              name="price"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
          <Form.Group controlId="input-foto" as={Col}>
            <Form.Label>Foto utama</Form.Label>
            <Form.File
              ref={register({
                required: 'Mohon sertakan gambar yang valid.'
              })}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.files![0].name)}
              id="mainpic-file"
              name="mainPicture"
              label={label}
              accept="image/*"
              custom
              aria-describedby="mainPicHelp"
            />
            <Form.Text id="mainPicHelp" muted>
              Sertakan gambar/foto untuk dipasang sebagai gambar utama
            </Form.Text>
            <ErrorMessage
              name="mainPicture"
              errors={errors}
              render={({ message }) => <Badge variant="warning">{message}</Badge>}
            />
          </Form.Group>
        </Form.Row>

        {/* Ceklis negosiasi */}
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Check
              custom
              name="nego"
              ref={register}
              id="check-nego"
              label="Negosiasi ?"
              type="checkbox"
              aria-describedby="negoHelp"
            />
            <Form.Text muted>Apakah harga properti bisa dinegosiasi? Centang jika iya</Form.Text>
          </Form.Group>
        </Form.Row>

        {/* Deskripsi */}
        <Form.Row className="mb-2">
          <Form.Group as={Col} className="h-100">
            <Form.Label>Deskripsi</Form.Label>
            <ContentEditor setValue={setDescription} />
            <Form.Text muted>Sertakan deskripsi tentang properti secara detail</Form.Text>
          </Form.Group>
        </Form.Row>

        {/* Kontak */}
        <Form.Label className="mt-3">Kontak</Form.Label>
        <Form.Row>
          {/* Kontak 1 */}
          <Form.Group as={Col} controlId="check-kontak1">
            <Form.Control as="select" name="checkKontak1" ref={register()} custom>
              <option value="0">Kosong</option>
              <option value="1">Whatsapp</option>
              <option value="2">Facebook</option>
              <option value="3">Email</option>
            </Form.Control>
            <Form.Control
              name="kontak1"
              ref={register()}
              disabled={watch('checkKontak1') == 0}
              placeholder={
                watch('checkKontak1') == 1
                  ? '628xxxxxxxxx'
                  : watch('checkKontak1') == 2
                  ? 'Facebook username'
                  : watch('checkKontak1') == 3
                  ? 'your@email.com'
                  : ''
              }
            />
            <Form.Control
              className="mt-1"
              name="userKontak1"
              ref={register()}
              placeholder="Nama tampilan"
              disabled={watch('checkKontak1') == 0}
            />
          </Form.Group>
          {/* Kontak 2 */}
          <Form.Group as={Col} controlId="check-kontak2">
            <Form.Control as="select" name="checkKontak2" ref={register()} custom>
              <option value="0">Kosong</option>
              <option value="1">Whatsapp</option>
              <option value="2">Facebook</option>
              <option value="3">Email</option>
            </Form.Control>
            <Form.Control
              name="kontak2"
              ref={register()}
              disabled={watch('checkKontak2') == 0}
              placeholder={
                watch('checkKontak2') == 1
                  ? '628xxxxxxxxx'
                  : watch('checkKontak2') == 2
                  ? 'Facebook username'
                  : watch('checkKontak2') == 3
                  ? 'your@email.com'
                  : ''
              }
            />
            <Form.Control
              className="mt-1"
              name="userKontak2"
              ref={register()}
              placeholder="Nama tampilan"
              disabled={watch('checkKontak2') == 0}
            />
          </Form.Group>
          {/* Kontak 3 */}
          <Form.Group as={Col} controlId="check-kontak3">
            <Form.Control as="select" name="checkKontak3" ref={register()} custom>
              <option value="0">Kosong</option>
              <option value="1">Whatsapp</option>
              <option value="2">Facebook</option>
              <option value="3">Email</option>
            </Form.Control>
            <Form.Control
              name="kontak3"
              ref={register()}
              disabled={watch('checkKontak3') == 0}
              placeholder={
                watch('checkKontak3') == 1
                  ? '628xxxxxxxxx'
                  : watch('checkKontak3') == 2
                  ? 'Facebook username'
                  : watch('checkKontak3') == 3
                  ? 'your@email.com'
                  : ''
              }
            />
            <Form.Control
              className="mt-1"
              name="userKontak3"
              ref={register()}
              placeholder="Nama tampilan"
              disabled={watch('checkKontak3') == 0}
            />
          </Form.Group>
          {/* Kontak 4 */}
          <Form.Group as={Col} controlId="check-kontak4">
            <Form.Control as="select" name="checkKontak4" ref={register()} custom>
              <option value="0">Kosong</option>
              <option value="1">Whatsapp</option>
              <option value="2">Facebook</option>
              <option value="3">Email</option>
            </Form.Control>
            <Form.Control
              name="kontak4"
              ref={register()}
              disabled={watch('checkKontak4') == 0}
              placeholder={
                watch('checkKontak4') == 1
                  ? '628xxxxxxxxx'
                  : watch('checkKontak4') == 2
                  ? 'Facebook username'
                  : watch('checkKontak4') == 3
                  ? 'your@email.com'
                  : ''
              }
            />
            <Form.Control
              className="mt-1"
              name="userKontak4"
              ref={register()}
              placeholder="Nama tampilan"
              disabled={watch('checkKontak4') == 0}
            />
          </Form.Group>
        </Form.Row>
        <Form.Text muted>
          Periksa kembali format isian kontak dengan teliti. Pastikan kontak dapat dihubungi. Jika sudah selesai
          silahkan tekan tombol kirim untuk memproses data
        </Form.Text>

        {/* Tombol submit & cancel */}
        <Form.Row className="mt-2">
          <Form.Group as={Col}>
            <Link href="/dashboard" passHref>
              <Button className="mr-2" variant="secondary" disabled={mutateIsLoading} as="a">
                Kembali
              </Button>
            </Link>
            <Button className="mr-2" variant="success" type="submit" disabled={mutateIsLoading}>
              Kirim
            </Button>
            {mutateIsLoading && (
              <>
                Memproses data Anda <Spinner animation="border" variant="success" />
              </>
            )}
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  )
}

export default AddPropertyForm
