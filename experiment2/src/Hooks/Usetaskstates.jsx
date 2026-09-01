import {useMemo} from '.react';

function Usetaskstates(){
return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const remaining = total - completed;

    return { total, completed, remaining };
  }, [tasks]);
}

export default useTaskStats;