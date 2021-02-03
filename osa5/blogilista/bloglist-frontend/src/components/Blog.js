import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLikes, handleRemove, loggedUser }) => {
  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (showAll) {
    let displayRemoveButton = { display: 'none' }
    if (loggedUser.username) {
      displayRemoveButton = { display: loggedUser.username === blog.user.username ? '' : 'none' }
    }

    return (
      <div className='blog' style={blogStyle}>
        <div>{blog.title} {blog.author} <button onClick={() => setShowAll(!showAll)}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLikes}>like</button></div>
        <div>{blog.user.name}</div>
        <button style={displayRemoveButton} onClick={handleRemove}>remove</button>
      </div>
    )
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setShowAll(!showAll)}>view</button>
    </div>
  )

}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
}

export default Blog
