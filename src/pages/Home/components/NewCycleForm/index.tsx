import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { cyclesContext } from "../../../../contexts/CycleContext";

export function NewCycleForm() {

  const { activeCycle } = useContext(cyclesContext)
  const { register} = useFormContext()

  
  return(
    <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            list='task-suggestions'
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id='task-suggestions' >
            <option>project 1</option>
            <option>project 2</option>
            <option>project 3</option>
            <option>maça</option>
            
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            id="minutesAmount" 
            type='number' 
            placeholder="00"
            step={5}
            max={60}
            min={5}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
            />

          <span>minutos.</span>
        </FormContainer>
  )
}