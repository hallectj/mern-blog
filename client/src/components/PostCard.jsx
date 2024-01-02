import moment from 'moment';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function PostCard({post}) {
  const [postUser, setPostUser] = useState({});
  const [ extractedDesc, setExtractedDesc ] = useState('');

  const extractPostExcerpt = (htmlString, maxLength) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const paragraphs = doc.querySelectorAll('p');
    let extractedText = '';
    for (const paragraph of paragraphs) {
      if (extractedText.length > maxLength) {
        break;
      }else{
        extractedText += paragraph.innerText;
        if(extractedText.length > maxLength){
          extractedText = extractedText.substring(0, maxLength) + '...';
          break
        }
      }
    }
    return extractedText;
  }

  useEffect(() => { 
    setExtractedDesc(extractPostExcerpt(post.content, 120));
    const getPostUser = async () => {
      try {
        const res = await fetch(`/api/user/getlimiteduser/${post.userId}`);
        const data = await res.json();
        if(res.ok){
          setPostUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getPostUser();
  }, []); 



  return (
    <div className="flex flex-col items-center h-auto min-w-[300px] flex-1">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
        <img src={`${post.image}`} alt="Mountain" className="object-fill mt-10 p-3 h-[260px] w-full" />
        <div className="p-3">
          <div className='mb-2 h-[60px]'>
            <Link to={`/post/${post.slug}`}>
                <h2 className="text-xl text-center font-bold text-gray-800">{post.title}</h2>
            </Link>
          </div>
          <div className='pb-1 h-[100px]'>
            <p className="text-gray-700 leading-tight mb-4">{extractedDesc}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={postUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full mr-2 object-cover" />
                <span className="text-gray-800 font-semibold">{postUser.username}</span>
            </div>
            <span className="text-gray-600">{moment(post.updatedAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
