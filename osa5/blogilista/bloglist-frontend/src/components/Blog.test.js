import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'First test',
    author: 'New author',
    url: 'www.awesometest',
    likes: 10
  }

  const component = render(
    <Blog blog={blog} />
  )
  const element = component.getByText('First test New author')
  expect(element).toBeDefined()

  expect(component.container).not.toHaveTextContent('likes 10')
  expect(component.container).not.toHaveTextContent('www.awesometest')
})

test('clicking the view button shows url and likes too', () => {
  const blog = {
    title: 'First test',
    author: 'New author',
    url: 'www.awesometest',
    likes: 10,
    user: {
      username: 'root'
    }
  }

  const loggedUser = {
    username: 'root'
  }

  const component = render(
    <Blog blog={blog} loggedUser={loggedUser} />
  )

  expect(component.container).not.toHaveTextContent('likes 10')
  expect(component.container).not.toHaveTextContent('www.awesometest')

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent('likes 10')
  expect(component.container).toHaveTextContent('www.awesometest')
})

test('clicking the like button two times calls event handler twice ', () => {
  const blog = {
    title: 'First test',
    author: 'New author',
    url: 'www.awesometest',
    likes: 10,
    user: {
      username: 'root'
    }
  }

  const loggedUser = {
    username: 'root'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} loggedUser={loggedUser} handleLikes={mockHandler}/>
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

