/* eslint-disable no-unused-vars */
import React from 'react'
import Squaretest from './Square-test'

function Boardtest({ squares, onClick}) {


    return (
        <div className='board'>
            {squares.map((square, i) => (
                <Squaretest key={i} value={square} onClick={() => onClick(i)} />
            ))}
        </div>
    )
}

export default Boardtest
