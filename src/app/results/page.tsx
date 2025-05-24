import React from 'react'
import Hero1 from './_components/hero-1'
import Hero2 from './_components/hero-2'
import Hero3 from './_components/hero-3'
import { Provider } from 'jotai'
import Divider from './_components/Divider'
import UpdatedAt from './_components/UpdatedAt'

export default function page() {
  return (
    <Provider>
      <UpdatedAt />
      <main className='w-full px-6 py-32 max-w-7xl m-auto flex flex-col gap-32'>
        <Hero1 />
        <Divider />
        <Hero2 />
        <Divider />
        <Hero3 />
      </main>
    </Provider>
  )
}
