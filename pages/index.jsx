
// Import el componente Head para el titulo y el favicon
import HeadComponent from "../components/Head";

// Hooks
import { useEffect, useState } from "react";

//Componente Image de nextJs
import Image from 'next/image'

//Componente useRouter de nextJs
import { useRouter } from 'next/router'

// Import los Stylos 
import styles from '../styles/HomePage.module.css'

//Componente Link de nextJs
import Link from 'next/link'

// Import el logo para el header de navegacion
import Lego from '../Img/lego.svg'



export default function HomePage({people}) {
  //Hook router
  const router = useRouter()
  // En este array se guardan las personas ordenas por su edad
  const [persons, setPersons] = useState([])

  // Este useEffect ordena los Usuario posr su edad y los inserta al estado persons
  useEffect(() => {
    const peoples = people.sort(((a, b) => a.age - b.age))
    setPersons(peoples)
  },[people])

  // Esta function redirige al perfil de la persona con sus datos y sus tareas
  const HandleClick = (id) => {
    router.push(`/profile/${id}`)
  }

  return (
    <div className={styles.conteiner}>
      
      {/* componente Head para el titulo y el favicon */}
      <div>
        <HeadComponent title="Home - Peoples" />
      </div>

      {/* barra de navegacion */}
      <div className={styles.divNavegacion}>
          <Image src={Lego} alt='img' width={40} height={40} />
          <Link href='/tasks/new'><p className={styles.links}>Create New Task</p></Link>
          <Link href='/profile/new'><p className={styles.links}>Create New User</p></Link>
      </div>

      {/* tabla de los usuarios */}
      <section className={styles.divPeoples}>
        <table className={styles.table}>
          <thead className={styles.divThead}>
            <tr className={styles.tableTr}>
              <th className={styles.headTable}>Picture</th>
              <th className={styles.headTable}>FullName</th>
              <th className={styles.headTable}>NickName</th>
              <th className={styles.headTable}>Occupation</th>
              <th className={styles.headTable}>Gender</th>
              <th className={styles.headTable}>Age</th>
            </tr>
          </thead>
              {
                persons.map((item) => {
                  return (
                    <tbody key={item.id}>
                                    {/* esta funcion pasa el id del usuario  */}
                      <tr className={styles.tableTr} onClick={() => HandleClick(item.id)}>
                        <td data-label='Picture' className={styles.bodyTable}><Image src={item.picture} alt='img' width={50} height={50} className={styles.img} /></td>
                        <td data-label='FullName' className={styles.bodyTable}>{item.fullName}</td>
                        <td data-label='NickName' className={styles.bodyTable}>{item.nickname}</td>
                        <td data-label='Occupation' className={styles.bodyTable}>{item.occupation}</td>
                        <td data-label='Gender' className={styles.bodyTable}>{item.gender}</td>
                        <td data-label='Age' className={styles.bodyTable}>{item.age}</td>
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

// Esta funcion hace la peticon a la api y trae todos los usuarios
export async function getServerSideProps() {
    const response = await fetch('http://localhost:3001/people', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    const persons = await response.json()

    return {
      props: {
        people: persons
      }
    }
 
  
}




