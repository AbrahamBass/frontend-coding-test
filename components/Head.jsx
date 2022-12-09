import React from 'react'
// import Lego from '../Img/lego.ico'
import Head from 'next/head'

export default function HeadComponent({title})  {
  return (
    <Head>
      <title>{title}</title>
      <link rel="shortcut icon" href='/favicon.ico' />
    </Head>
  )
}

