import React from 'react'
import { MdOutlineEmojiPeople } from 'react-icons/md'
export default function Vistorslistdash() {
  return (
      <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 w-[20rem] flex-row flex'>
        <div className='p-3 flex'>
          <MdOutlineEmojiPeople className='text-2xl text-black'/>
          <strong className='px-2'>Vistors Currently In</strong>
        </div>
      </div>
  )
}
