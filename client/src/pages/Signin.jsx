import { Alert, Button, Label, TextInput, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'   
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  //const [errorMessage, setErrorMessage] = useState(null);
  //let [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector(state => state.user);

  const handleChange = (event) => {
    setFormData({...formData, [event.target.id]: event.target.value.trim()});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!formData.password || !formData.email){
      //return setErrorMessage("Please fill out all fields");
      return dispatch(signInFailure("Please fill out all fields"));
    }
    try {
      dispatch(signInStart());
      const response = await fetch('./api/auth/signin', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if(data.success === false){
        //setLoading(false);
        //return setErrorMessage(data.message);
        dispatch(signInFailure(data.message));
      }
      //setLoading(false);
      if(response.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      //setErrorMessage(error.message);
      //setLoading(false)
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/** left */}
        <div className='flex-1'>
          <Link to="/" className='font-semibold dark:text-white text-4xl'>
            <span className='px-2 py-1 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium text-center'>Travis's</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign in with your email and password or with Google.
          </p>
        </div>

        {/** right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput type='email' placeholder='name@example.com' id='email' onChange={handleChange} />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type='password' placeholder='**********' id='password' onChange={handleChange} />
            </div>
            <Button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm text-center' type='submit' disabled={loading}>
            {
                loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className='pl-2'>Loading</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to="/sign-up" className='text-blue-500'>Sign Up</Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color="failure">
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
