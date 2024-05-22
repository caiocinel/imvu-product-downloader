import Image from 'next/image'
import PackageFrame from './components/PackageFrame'

export default async function Main() {
  return (
    <div className='flex h-screen w-full'>
      <div className='flex m-auto w-1/3'>
        <PackageFrame />
      </div>
    </div>
  )
}
