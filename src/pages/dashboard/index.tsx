import { useState } from 'react'
import { Container } from 'react-bootstrap'
import toast from 'react-hot-toast'

import ModalShowProperty from '@/components/dashboard/ModalShowProperty'
import PropertyTable from '@/components/dashboard/PropertyTable'
import sdk from '@/sdk/property'
import { useAuthContext } from '@/contexts/AuthContext'
import StatusBar from '@/components/dashboard/StatusBar'
import useAuth from '@/utils/useAuth'
import DashboardLayout from '@/components/layout/Dashboard'
import AuthLoader from '@/shared/AuthLoader'

const Dashboard = () => {
  const { user } = useAuthContext()
  const { userSignOut } = useAuth()
  const { properties, isLoading, updatedAt, isFetching } = sdk.getPropertyByUserID(user?._id)
  const [showModal, setShowModal] = useState(false)

  const sortedProperties = properties?.sort((a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt)))

  const handleLogout = () => {
    userSignOut('/')
    toast.success('Berhasil keluar')
  }

  if (!user) {
    return <AuthLoader />
  }

  return (
    <DashboardLayout title="Dashboard">
      <Container className="my-3">
        <ModalShowProperty
          isLoading={isLoading}
          properties={properties}
          setShowModal={setShowModal}
          showModal={showModal}
        />

        <StatusBar onLogout={handleLogout} setShowModal={setShowModal} updatedAt={updatedAt} isFetching={isFetching} />
        {isLoading && <AuthLoader />}
      </Container>
      {!isLoading && <PropertyTable properties={sortedProperties} />}
    </DashboardLayout>
  )
}

export default Dashboard
