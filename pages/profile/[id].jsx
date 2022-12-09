import { useEffect, useState, useRef } from 'react'
import HeadComponent from "../../components/Head";
import Image from 'next/image'
import { useRouter } from 'next/router';
import Link from 'next/link'
import styles from '../../styles/ProfilePeople.module.css'
import Lego from '../../Img/lego.svg'

export default function ProfilePeople({people, tasks})  {
  //Hook router
  const router = useRouter()
  //El estado user guarda el usuario que la api le dio
  const [user, setUser] = useState({})
  // El estado tasks guarda las tareas del usuario
  const [task, setTask] = useState([])
  const button = useRef()

  // guarda los datos de la api
  useEffect(() => {
    setUser(people)
    setTask(tasks)
  }, [people, tasks])


  // Esta funcion actualiza la tarea de verdadero a falso y viceversa 
  const HandleClick = async (id, completed, title, description, startDate, endDate, person) => {

   const response = await fetch(`http://localhost:3001/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        title: title,
        description: description,
        completed: completed ? false : true,
        startDate: startDate,
        endDate: endDate,
        personId: person
      })
      
    })
   const data = await response.json()
    if (data) {
        location.reload();  
    }
  }

  // Esta funcion Elimina la tarea del usuario
  const HandleClickDelete = async (id) => {
    const response = await fetch(`http://localhost:3001/tasks/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log(data)
    location.reload()
  }

  // Esta funcion redirige a la pagina de editar tareas del usuario
  const HandleClickEdit = (id) => {
    router.push(`/tasks/edit/${id}`)
  }

  return (
    <div>
      <div>
        <HeadComponent title={`People - ${user.fullName}`} />
      </div>

      {/* barra de navegacion */}
      <header >
        <nav className={styles.headerNav}>
          <Image src={Lego} alt='img' width={40} height={40}/>
          <Link href='/'><span className={styles.tituloNav}>Home</span></Link>
          <Link href='/tasks/new'><span className={styles.tituloNav}>Create New Task</span></Link>
          <Link href={`/profile/edit/${router.query.id}`}><span className={styles.tituloNav}>Edit User</span></Link>
        </nav>
      </header>

      {/* datos de usuario */}
      <section className={styles.sectUser}>
        <div>
          {user.picture && <Image src={user.picture} alt='img' width={100} height={100} />}
        </div>
        <div>
          <h1 className={styles.name}>{user.fullName}</h1>
          <p className={styles.parrafo}>Occupation: <span>{user.occupation}</span> </p>
          <p className={styles.parrafo}>NickName: <span>{user.nickname}</span> </p>
          <p className={styles.parrafo}>Gender: <span>{user.gender}</span> </p>
          <p className={styles.parrafo}>Age: <span>{user.age}</span> </p>
        </div>
      </section>

      {/* esta es la tabla de las tareas del usuario */}
      <section className={styles.sectTasks}>
        <table className={styles.table}>
          <thead className={styles.divThead}>
            <tr className={styles.tableTr}>
              <th className={styles.tituloTh}>Completed</th>
              <th className={styles.tituloTh}>Title</th>
              <th className={styles.tituloTh}>Description</th>
              <th className={styles.tituloTh}>StartDate</th>
              <th className={styles.tituloTh}>Delete Task</th>
              <th className={styles.tituloTh}>Mark as completed or Mark as not completed</th>
              <th className={styles.tituloTh}>Edit Task</th>
            </tr>
          </thead>
        {
          task.map((item) => {
            return (
              <tbody key={item.id} className={styles.tbody}>
                <tr className={styles.tableTr}>
                  <td data-label='Completed' className={styles.tituloTd}>{item.completed ? 'True' : 'False'}</td>
                  <td data-label='Title' className={styles.tituloTd}>{item.title}</td>
                  <td data-label='Description' className={styles.tituloTd}>{item.description}</td>
                  <td data-label='StartDate' className={styles.tituloTd}>{item.startDate}</td>   
                  <td data-label='Delete Task' className={styles.tituloTd}>
                  {/* esta funcion es la que elimina las tareas */}
                    <button onClick={() => HandleClickDelete(item.id)} className={styles.btnDelete}>Delete</button>
                  </td>
                  <td data-label='Mark as completed or Mark as not completed' className={styles.tituloTd}>
                    {/* esta function actualiza la tarea  */}
                    <button className={styles.btnOne} ref={button}  onClick={() => HandleClick(
                      item.id, 
                      item.completed, 
                      item.title, 
                      item.description, 
                      item.startDate, 
                      item.endDate, 
                      item.personId)} >{item.completed ? 'True' : 'False'}
                    </button>
                  </td>
                                    {/* esta funcion redirige a la pagina de editar tareas del usuario */}
                  <td data-label='Edit Task' className={styles.tituloTd}><button className={styles.btnTwo} onClick={() => HandleClickEdit(item.id)}>Edit Task</button></td>
                </tr>
              </tbody>
            )
          })
        }
        </table>
      </section>
    </div>
  )
}

// Esta funcion llama a dos api 
export async function getServerSideProps({query: { id }}) {
  // esta funcion trae al usuario por id
  const response = await fetch(`http://localhost:3001/people/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
  })
  // esta funcion trae todas las tareas
  const responseTask = await fetch(`http://localhost:3001/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
  })
  const data = await response.json()
  const tasks = await responseTask.json()
  // Este metodo filtra las tareas del usuario por el id
  const task = tasks.filter((item) => item.personId == id)

  return {
    props: {
      people: data,
      tasks: task
    }
  }
}

