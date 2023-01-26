import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markNewCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface createCycleDate {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: createCycleDate ) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProvidersProps {
  children: ReactNode
}



export const cyclesContext = createContext({} as CyclesContextType)


export function CyclesContentProvider({ 
  children,
}: CyclesContextProvidersProps){

  const [cyclesState, dispatch] = useReducer(cyclesReducer,
  {
    cycles: [],
    activeCycleId: null,
  }, () => {
    const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');
    if (storedStateAsJSON) {
      return JSON.parse(storedStateAsJSON);
    }
  })

  const { cycles, activeCycleId} = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(()=> {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])


  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markNewCycleAsFinishedAction())
  }

  function createNewCycle(data: createCycleDate) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return(
    <cyclesContext.Provider 
    value={{ 
      activeCycle, 
      activeCycleId, 
      markCurrentCycleAsFinished, 
      amountSecondsPassed,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle,
      cycles
    }}
  >
    {children}
    </cyclesContext.Provider>
  )
}