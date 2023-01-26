import { Play, HandPalm } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import * as zod from 'zod'
import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'

import {  
  HomeContainer, 
  StartCountDownButton, 
  StopCountDownButton
} from './styles'
import { cyclesContext } from '../../contexts/CycleContext'

const newCycleFormValidationSchema = zod.object({
  task: zod
    .string()
    .min(1, 'Informe a tarefa!'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no minimo 05 minutos')
    .max(60, 'O ciclo precisa ser de no maximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {

  const { activeCycle, createNewCycle, interruptCurrentCycle  } = useContext(cyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), 
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData){
    createNewCycle(data)
    reset()
  }


  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>

        <FormProvider {...newCycleForm} >
          <NewCycleForm />
        </FormProvider>
        
        <CountDown/>

        { activeCycle ? (
            <StopCountDownButton onClick={interruptCurrentCycle} type="button"   >
              <HandPalm size={24}/>
              Interromper
            </StopCountDownButton>
        ) : (
          <StartCountDownButton type="submit" disabled={isSubmitDisabled}  >
            <Play/>
            Começar
          </StartCountDownButton>
        ) }
      </form>
    </HomeContainer>
  )}
