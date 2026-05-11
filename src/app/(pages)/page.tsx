import { redirect } from 'next/navigation'
import { auth } from '~/server/auth/index'

const Home = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/api/auth/signin')
  } else {
    redirect('/users')
  }
}

export default Home
