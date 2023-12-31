import { Button } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'


export default function CallToAction({ imgSrc, heading, paragraph, link }) {
  const { theme } = useSelector(state => state.theme);
  const borderStyle = (theme === 'light') ? ({border: '2px solid teal'}) : ({border: '2px solid white'});

  return (
    <aside style={borderStyle} className='flex flex-col sm:flex-row p-3 dark:border-pink-400 items-center justify-center rounded-2xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>{heading}</h2>
        <p className='my-2'>{paragraph}</p>
        <Button>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            Learn More
          </a>
        </Button>
      </div>
      <div className='flex-1 p-7'>
        <img src={imgSrc} alt='' />
      </div>
    </aside>
  )
}
