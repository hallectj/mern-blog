import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsGithub, BsTwitterX } from 'react-icons/bs'
import React from 'react'

export default function FooterComponent() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link to="/" className='self-center whitespace-nowrap px-2 py-1 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm text-center'>
              <span className='px-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-lg text-center'>Travis's</span>
              Blog
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
                <Footer.LinkGroup col>
                  <Footer.Link href='https://www.backthennow.com' target='_blank' rel='noopener noreferrer'>
                    BackThenNow
                  </Footer.Link>
                  <Footer.Link href='/about' target='_blank' rel='noopener noreferrer'>
                    Travis's Blog
                  </Footer.Link>
                </Footer.LinkGroup>
            </div>
          
            <div>
              <Footer.Title title='follow us' />
                <Footer.LinkGroup col>
                  <Footer.Link href='https://github.com/hallectj' target='_blank' rel='noopener noreferrer'>
                    Github
                  </Footer.Link>
                  <Footer.Link href='https://twitter.com/hallectj' target='_blank' rel='noopener noreferrer'>
                    Twitter
                  </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Legal' />
                <Footer.LinkGroup col>
                  <Footer.Link href='#'>
                    Privacy Notice
                  </Footer.Link>
                  <Footer.Link href='#'>
                    Terms and Conditions
                  </Footer.Link>
                </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider />
        <div className='flex w-full justify-between md:grid-cols-1'>
          <Footer.Copyright href='#' by="Travis Halleck" year={new Date().getFullYear()} />
          <div className='flex'>
            <div className='mx-1'><Footer.Icon href='#' icon={BsFacebook} /></div>
            <div className='mx-1'><Footer.Icon href='#' icon={BsGithub} /></div>
            <div className='mx-1'><Footer.Icon href='#' icon={BsTwitterX} /></div>
          </div>
        </div>
      </div>
    </Footer>
  )
}