"use client"
import Image from 'next/image'



export default function Index({ img, name, roleName, href }: any) {
    return (
        <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-gray bg-slate-700 w-60">
            <img className="w-full h-40 object-contain" src={img} alt={name} />
            <div className="px-6 py-4">
                {href ? <a target='_blank' href={href} className="font-bold text-xl mb-2 text-slate-300">{name}</a> : <div className="font-bold text-xl mb-2 text-slate-300">{name}</div>}
                <p className="text-slate-300 text-base">
                    {roleName}
                </p>
            </div>
        </div>)
}