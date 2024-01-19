"use client"
import { FormEvent, useEffect, useState } from 'react';
import Card from "./_components/Card/Index";
import { CastType } from './type';

export default function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<CastType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  };

  const fetchSearch =  async () => {
    setData([])
    setLoading(true)
    setError("");
    try {
      const apiResponse = await fetch(`/api/google?movieName=${encodeURIComponent(search)}`)
      const cast: CastType[] = await apiResponse.json()
      setData(cast)
    } catch (e) {
      setError("Error in Api")
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-6">
        <label htmlFor="movieName">Enter the movie name in the input box below to see the cast</label>
        <form className='flex gap-2' method='post' onSubmit={onSubmitHandler}>
          <input id="movieName" name="movieName" placeholder='Enter movie name' className='hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700' type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button disabled={loading || !search} className='bg-slate-900 disabled:bg-slate-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400' type='submit' onClick={fetchSearch}>Search</button>
        </form>
        <div className='flex flex-wrap gap-4'>
          {loading && <div>loading...</div>}
          {error && <div>Unable to load data at this moment please try again after some time</div>}
          {data &&
            data.map((info: any) => <Card key={info.name} img={info.img} name={info.name} roleName={info.roleName} href={info.googleUrl} />)}
          {!loading && !error && data && data.length === 0 && <div>Not data found</div>}
        </div>
      </div>
    </main>
  )
}
