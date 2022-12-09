import {useState} from 'react'
import styles from '../../styles/NewUser.module.css'
import Link from 'next/link'
import { useRouter} from 'next/router'
import Lego from '../../Img/lego.svg'
import Image from 'next/image'
import HeadComponent from '../../components/Head'

export default function NewUser ()  {
  // Hooks
  const router = useRouter()
  // Guarda todos los valores ingresados en los input
  const [dataInput, setDataInput] = useState({
    Image: '',
    FullName: '',
    Occupation: '',
    NickName: '',
    Gender: '',
    Age: '',
  })

  // Esat function guarda en el estado lo que el usuario ingreso
  const HandleChange = (e) => {
    setDataInput({
      ...dataInput,
      [e.target.name]: e.target.value,
    })
  }

  //Esta funcion envia los datos ingresados del usuario si estan correctos
  const HandleSubmit = () => {
    const response = fetch(`http://localhost:3001/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Math.floor(Math.random() * 100),
        fullName: dataInput.FullName,
        age: dataInput.Age,
        occupation: dataInput.Occupation,
        nickname: dataInput.NickName,
        gender: dataInput.Gender,
        picture: dataInput.Image
      })
    })

    console.log(response.json())
  }

  return (
    <>
    <div>
      <HeadComponent title='Create New User'/>
    </div>

    {/* barra de navegacion */}
      <div className={styles.divNavegacion}>
        <Image src={Lego} alt='img' width={40} height={40} />
        <Link href='/'><p className={styles.links}>Home</p></Link>
        <Link href='/tasks/new'><p className={styles.links}>Create New Task</p></Link>
      </div>
    <div className={styles.conteiner}>

    {/* formulario que obtiene los valores de los input */}
      <form onSubmit={HandleSubmit} className={styles.form}>
      <div className={styles.divInput}>
        <label className={styles.label}>Picture</label>
        <input 
          name='Image' 
          type="text" 
          placeholder="Image" 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>FullName</label>
        <input 
          name='FullName' 
          type="text" 
          placeholder='FullName' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Occupation</label>
        <input 
          name='Occupation' 
          type="text" 
          placeholder='Occupation' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>NickName</label>
        <input 
          name='NickName' 
          type="text" 
          placeholder='NickName' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Gender</label>
        <input 
          name='Gender' 
          type="text" 
          placeholder='Gender' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Age</label>
        <input 
          name='Age' 
          type="text" 
          placeholder='Age' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      </form>
      <div className={styles.btns}>
        <button className={styles.btn} type='submit'>Send</button>
        {/* esta funcion redirige al home */}
        <button className={styles.btn} onClick={() => {router.push('/')}}>Cancel</button>
      </div>
    </div>
    </>
  )
}

