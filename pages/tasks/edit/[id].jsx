import {useState} from 'react'
import HeadComponent from '../../../components/Head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../../../styles/EditTask.module.css'
import Link from 'next/link'
import Lego from '../../../Img/lego.svg'

export default function TasksEdit ({user, data})  {
  // Hooks router
  const router = useRouter()
  //el estado title guarda el valor del input tittle
  const [title, setTitle] = useState('')
   //el estado description guarda el valor del input description
  const [description, setDescription] = useState('')
  // el estado completed verifica si la tarea esta completada o no
  const [completed, setCompleted] = useState(false)
  //el estado endDate verifica el estado  de finalizacion de la tarea
  const [enDate, setEnDate] = useState('')


  //esta funcion guarda el valor del input al estado
  const HandleChangeTitle = (e) => {
    setTitle(e.target.value)
  }
    
  //esta funcion guarda el valor del input al estado
  const HandleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const HandleChangeEndate = (e) => {
    setEnDate(e.target.value)
  }

  // Esta function actualiza los valores de la tarea
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    
    const fechaEnd = `${añoActual}-${mesActual}-${hoy}`
    

      if (title && description) {
        const response = await fetch(`http://localhost:3001/tasks/${router.query.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: data.id,
            title: title,
            description: description,
            completed: completed,
            startDate: fechaEnd,
            endDate: enDate,
            personId: data.personId
            })
          })
          const taskUdate = await response.json()
          console.log(taskUdate)
          location.reload();
      }
      

  }

  //Esta funcion redirige al perfil del usuario
  const rout = () => {
    router.push(`/profile/${user.id}`)
  }

  //Esta function cambia el estado de la tarea
  const HandleClickCompleted = () => {
    setCompleted(!completed)
  }

  return (
    <div>
      <div>
        <HeadComponent title='Edit Tasks'/>
      </div>

    {/* barra de navegacion */}
      <header className={styles.HeaderNavegacion}>
          <Image src={Lego} alt='img' width={40} height={40} />
          <Link href='/'><p className={styles.links}>Home</p></Link>
          <Link href='/tasks/new'><p className={styles.links}>Create New Task</p></Link>
      </header>

    {/* datos del usuario al que se le modificara las tareas */}
      <section className={styles.section}>
        <h1 className={styles.nameTaskUser}>Task User</h1>
        <div className={styles.divUser}>
          <div>
            <Image src={user.picture} alt='img' width={100} height={100}/>
          </div>
          <div>
            <h1 className={styles.nameUser}>{user.fullName}</h1>
            <p className={styles.parrafo}>Occupation: <span>{user.occupation}</span> </p>
            <p className={styles.parrafo}>Nickname: <span>{user.nickname}</span> </p>
            <p className={styles.parrafo}>Gender: <span>{user.gender}</span> </p>
            <p className={styles.parrafo}>Age: <span>{user.age}</span> </p>
          </div>
        </div>
      </section>

      {/* id de la tarea a modificara */}
      <div className={styles.numTask}>
        <h1 className={styles.numTaskUser}>Task {data.id}</h1>
      </div>

        {/* formulario que obtiene los valores de los input */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <div className={styles.divInput}>
              <label className={styles.label}>Task Title</label>
              <input 
              type="text" 
              placeholder='Title' 
              className={styles.input} 
              onChange={HandleChangeTitle}/>
            </div>
            <div className={styles.divInput}>
              <label className={styles.label}>Task Description</label>
              <input 
              type="text" 
              placeholder='Description'
              className={styles.input} 
              onChange={HandleChangeDescription}/>
            </div>
            <div className={styles.divInput}>
              <label className={styles.label}>Task endDate</label>
              <input 
              type="text" 
              placeholder='Description'
              className={styles.input} 
              onChange={HandleChangeEndate}/>
            </div>
          </div>
            <div>
              <p className={styles.parrafoCompleted}>completed or not completed</p>
              <button type='button' onClick={HandleClickCompleted} className={styles.btnCompleted}>completed or not completed</button>
            </div>
          <div className={styles.divBtn}>
            <input type="submit" className={styles.btn} value='Send'/>
            <button type='button' onClick={rout} className={styles.btn}>Cancel</button>
          </div>
        </form>
    </div>
  )
}


// Esta funcion hace dos peticion a diferentes api
export async function getServerSideProps({query: { id }}) {
  //esta function trae la tarea del usuario a editar
  const response = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()

  //esta funcion trae los datos del usuario al que le modificara la tarea
  const responseUser = await fetch(`http://localhost:3001/people/${data.personId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const dataUser = await responseUser.json()

  return {
    props: {
      user: dataUser,
      data: data
    }
  }
}
