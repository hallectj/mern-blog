import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-center text-3xl font-semibold my-7'>About Me</h1>
          <img className='block w-56 h-72 object-cover mx-auto' src='https://dl.dropboxusercontent.com/scl/fi/54202tv1lk6xoacy3ftbu/20180829_140224.jpg?rlkey=snyumtcdgl3t26lcyyxfqqmy7&dl=0'></img>
          <div className='flex flex-col text-md text-gray-500 gap-6'>
            <p>
              Hey you stumbled upon my site. This is a project website I built using React, Redux, Node, Express and MongoDB (MERN stack). This website has authentication for two tiers, a regular user who simply wants to comment and keep abreast of the site and admin users who can post articles and manage the site. In addition to the dashboard, this site has everything you would expect a blog site to have. I built this site to learn more about React and to improve my skills. 
            </p>

            <p>
              So who am I? My name is Travis Halleck and I am a full stack web developer and I love to build things. I have always had an interest in technology and that has fueled my passion to build apps. I built this site using React to improve my skills and to learn more about React. I generally develop using Angular or just plain Vanilla JavaScript. Professionally I haven been a developer for 3+ years working for a large fintech company.
            </p>

            <p>
              My portfolio is still being worked on right now, but if you are interested in seeing some of my work, please feel free to reach out to me at hallectj@gmail.com. I would love to hear from you. If you are curious as to my most recent project, you can check it out here <a className='text-blue-600 font-bold' href='https://www.backthennow.com'>Back Then Now</a>. It's a site about celebrities and nostaglia. It was developed by me using the PEAN stack (Postgres, Express, Angular, Node).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
