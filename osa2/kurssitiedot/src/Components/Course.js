import React from "react";

const Header = (props) => {
    return <h1>{props.course}</h1>;
  };
  
  const Content = (props) => {
    return (
      <div>
        {props.parts.map((part) => <Part key={part.id} part={part.name} exercises={part.exercises}/>)}
      </div>
    );
  };
  
  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercises}
      </p>
    )
  }
  
  const Total = (props) => {
    const total = props.parts.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.exercises
    }, 0)
  
    return (
      <strong>Number of exercises {total}</strong>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts} /> 
      </div>
    )
  }

  export default Course
  