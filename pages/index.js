import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Source from './source'
import Analytics from "./analytics"
import { useState } from "react";

export default function Home() {
  const [config, setConfig] = useState(null);

  const handleNewConfig = (newConfig) => {
      setConfig({...newConfig, ssl: true});
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        {config === null && <Source editable config={config || {}} onConfigChange={handleNewConfig} className={"flex flex-col divide-y divide-dashed divide-gray-500"} />}
        {config && <Analytics config={config}/>}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
