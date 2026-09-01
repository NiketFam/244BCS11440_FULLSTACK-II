import React from '.react';
import useTaskStats from './useTaskStats';

function Taskstate(){
    const {total,remaining}=useTaskStats(tasks);
    return(
        <>
        <span>
            ({remaining} remaining / {total} total)
        </span>
        </>
    );
}
export default Taskstate;