import React, {useEffect, useState} from 'react'

function Testing() {
    const [count,setCount]=useState(1)
    useEffect(()=>{
        console.log("This is our first use Effect")
    },[])
  return (
    <div>Testing</div>
  )
}

export default Testing