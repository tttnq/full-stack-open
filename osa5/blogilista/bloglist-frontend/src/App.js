import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, errorStatus }) => {
  if (!message) {
    return null
  }

  const errorStyle = {
    color: errorStatus ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div className="notification" style={errorStyle}>{message}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    error: null,
  })

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes))
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login({ username: userObject.username, password: userObject.password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setNotification({ message: `${user.username} logged in`, error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    } catch (exception) {
      console.log('wrong credentials', exception)

      setNotification({ message: 'wrong username or password', error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      blogFormRef.current.toggleVisibility()

      setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    } catch (exception) {
      const errorMsg = exception.response.data.error
      console.log(errorMsg)

      setNotification({ message: errorMsg , error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }

  }

  const handleLikes = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes += 1, user: blog.user.id }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== returnedBlog.id ? b : { ...returnedBlog, user: blog.user }).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      const errorMsg = exception.response.data.error
      console.log(errorMsg)
      setNotification({ message: errorMsg , error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }

  }

  const handleRemove = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }
    } catch (exception) {
      const errorMsg = exception.response.data.error
      console.log(errorMsg)
      setNotification({ message: errorMsg , error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }


  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} errorStatus={notification.error} />
        <LoginForm login={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} errorStatus={notification.error} />
      <p>
        {user.name} logged in
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem('loggedUser')
            setUser(null)
          }}
        >
          logout
        </button>
      </p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={() => handleLikes(blog)}
          handleRemove={() => handleRemove(blog)}
          loggedUser={user}
        />
      ))}
    </div>
  )
}

export default App
