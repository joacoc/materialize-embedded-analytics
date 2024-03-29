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
        <title>eCommerce Analytics</title>
        <meta name="description" content="Generated by Materialize" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <Image src="/full_materialize.svg" alt="Materialize Full Logo" width={450} height={95} />
        {config === null && <Source editable config={config || {}} onConfigChange={handleNewConfig} className={"flex flex-col mt-10"} />}
        {config && <Analytics config={config}/>}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://materialize.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={""}>
            <Image src="/materialize.svg" alt="Materialize Logo" width={50} height={10} />
          </span>
        </a>
      </footer>
    </div>
  )
}
