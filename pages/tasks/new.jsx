import {useEffect, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Lego from '../../Img/lego.svg'
import styles from '../../styles/NewTasks.module.css'
import {useRouter} from 'next/router'
import HeadComponent from '../../components/Head'

export default  function NewTasks({peoples})  {
  // Hooks
  const router = useRouter()
  const [id, setId] = useState()
  const [status, seStatus] = useState()
  const [select, setSelect] = useState(false)
  const [user, setUser] = useState()
  const [people, setPeople] = useState([])
  
  const [dataInput, setDataInput] = useState({
    Title: '',
    Description: '',
  })

  // Esta function obtiene los valores del input
  const HandleChange = (e) => {
    setDataInput({
      ...dataInput,
      [e.target.name]: e.target.value,
    })
  }

  //Ordena los usuario y los guarda en el estado people
  useEffect(() => {
    const peopleSort = peoples.sort(((a, b) => a.age - b.age))
    setPeople(peopleSort)
  }, [peoples])


  // Esta function envia los datos de la tarea
  const HandleSubmit = async (e) => {
    e.preventDefault()
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;

    const fechaEnd = `${añoActual}-${mesActual}-${hoy}`

    if (dataInput.Title && dataInput.Description && id) {
      const response = await fetch(`http://localhost:3001/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: Math.floor(Math.random() * 100),
          title: dataInput.Title,
          description: dataInput.Description,
          completed: false,
          startDate: fechaEnd,
          endDate: null,
          personId: id
        })
      })
      const data =  response.status
        if(data >= 200 && data <= 300){
          seStatus(true)
        }
      location.reload()
    }

  }

  //esta function guarda el id del usuario en el estado
  const HandleClick = (id) => {
    setId(id)
  }

  return (
    <div>
      <div>
        <HeadComponent title='Task New' />
      </div>
    {/* barra de navegacion */}
      <header>
        <nav className={styles.headerNav}>
          <Image src={Lego} alt='img' width={40} height={40}/>
          <Link href='/'><span className={styles.tituloNav}>Home</span></Link>
          <Link href='/profile/new'><span className={styles.tituloNav}>Create New User</span></Link>
        </nav>
      </header>
      
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
          people.map((item) => {
            return (
              <tbody key={item.id}>
                  {/* esta funcion envia el nombre del usuario y cambia el estado a true */}
                <tr className={styles.tableTr} onClick={() => {setSelect(true), setUser(item.fullName) }} >
                  <td data-label='Picture' className={styles.bodyTable}><Image src={item.picture} alt='img' width={50} height={50} className={styles.img} onClick={() => HandleClick(item.id)} /></td>
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

          {/* nombre del usuario */}
        <div className={styles.divUserName}>
          {select && <h1 className={styles.nameClick}>You Selected {user} To Add A Task</h1>}
        </div>

        {/* formulario que obtiene los valores de los input */}
        <form onSubmit={HandleSubmit} className={styles.sectForm}>
          <div className={styles.divInput}>
            <label className={styles.label}>Title</label>
            <input 
              name='Title' 
              type="text" 
              placeholder="Title" 
              className={styles.input}
              onChange={HandleChange}/>
          </div>
          <div className={styles.divInput}>
            <label className={styles.label}>Description</label>
            <input 
              name='Description' 
              type="text" 
              placeholder='Description' 
              className={styles.input}s
              onChange={HandleChange}/>
          </div>
        <div className={styles.divBtn}>
          <input type="submit" value='Send' className={styles.btn}/>
          {/* esta funcion redirige al home */}
          <button className={styles.btn} onClick={() => {router.push('/')}}>Cancel</button>
        </div>
        </form>
        
        {/* muestra si la tarea se agrego o no */}
        <div className={styles.divStatus}>
         {
          status && <h1 className={styles.tituloStatus}>Added Task</h1>
         }
        </div>
    </div>
  )
}

// Esta funcion se trae a todos los usuarios
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3001/people', {
    method: 'GET',
  })

  const data = await response.json()

  return {
    props:{
      peoples: data
    }
  }
}

