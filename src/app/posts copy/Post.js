import React from 'react';
import Link from 'next/link';

export default function Post({ id, title_en, status, created_at, deletePost }) {
  return (
    <tr>
      <td className='w-10 border border-slate-300 text-center'>{id}</td>
      <td className='border border-slate-300 text-center'>{title_en}</td>
      <td className='border border-slate-300 text-center'>{status === 1 ? 'active' : 'inactive'}</td>
      <td className='border border-slate-300 text-center'>{created_at}</td>
      <td className='w-52 border border-slate-300'>
        <Link href={`/posts/edit/${id}`} className='bg-blue-500 p-2 inline-block ml-3 text-white text-sm'>Edit</Link>
        <Link href={`/posts/show/${id}`} className='bg-green-500 p-2 inline-block ml-3 text-white text-sm'>View</Link>
        <span onClick={() => deletePost(id)} className='bg-red-500 p-2 inline-block ml-3 text-white text-sm'>Delete</span>
      </td>
    </tr>
  );
}
