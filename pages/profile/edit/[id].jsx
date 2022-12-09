import {useEffect, useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import styles from '../../../styles/EditProfile.module.css'
import Link from 'next/link'
import Lego from '../../../Img/lego.svg'
import HeadComponent from '../../../components/Head'

export default function EditProfile({people}) {
  //Hooks
  const router = useRouter()
  const [user, setUser] = useState({})
  // Guarda los valores del input
  const [dataInput, setDataInput] = useState({
    Image: user.picture,
    FullName: user.fullName,
    Occupation: user.occupation,
    NickName: user.nickname,
    Gender: user.gender,
    Age: user.age,
  })

  //Guarda en el estado los datos del usuario  a modificar
  useEffect(() => {
    setUser(people)
  }, [people])

  //Gurda en el estado lo que el usuario ingresa
  const HandleChange = (e) => {
    setDataInput({
      ...dataInput,
      [e.target.name]: e.target.value,
    })
  }

  // Esta function envia y actualiza los valores del usuario
  const HandleSubmit = async (e) => {
    e.preventDefault()

      const response = await fetch(`http://localhost:3001/people/${router.query.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          id: user.id,
          fullName: dataInput.FullName,
          age: dataInput.Age,
          occupation: dataInput.Occupation,
          nickname: dataInput.NickName,
          gender: dataInput.Gender,
          picture: dataInput.Image
        })  
      })
      const data = response.json()
      console.log(data)
      location.reload()
   

  }

  return (
    <div>
      <div>
        <HeadComponent title={`Edit User - ${user.fullName}`} />
      </div>

      {/* barra de navegacion */}
      <header className={styles.divNavegacion}>
          <Image src={Lego} alt='img' width={40} height={40} className={styles.imgNav}/>
          <Link href='/'><p className={styles.links}>Home</p></Link>
          <Link href='/profile/new'><p className={styles.links}>Create New User</p></Link>
      </header>

    {/* datos del usuario */}
    <section className={styles.user}>
      <div>
        {user.picture && <Image src={user.picture} alt='img' width={100} height={100}/>}
      </div>
      <div>
        <h1 className={styles.name}>{user.fullName}</h1>
        <p className={styles.parrafo}>Occupation: <span>{user.occupation}</span> </p>
        <p className={styles.parrafo}>NickName: <span>{user.nickname}</span> </p>
        <p className={styles.parrafo}>Gender: <span>{user.gender}</span> </p>
        <p className={styles.parrafo}>Age: <span>{user.age}</span> </p>
      </div>
    </section>

    {/* formulario que obtiene los valores de los input */}
     <form onSubmit={HandleSubmit} className={styles.form}>
      <div className={styles.divInput}>
        <label className={styles.label}>Edit Picture</label>
        <input 
          name='Image' 
          type="text" 
          placeholder="Image" 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Edit FullName</label>
        <input 
          name='FullName' 
          type="text" 
          placeholder='FullName' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Edit Occupation</label>
        <input 
          name='Occupation' 
          type="text" 
          placeholder='Occupation' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Edit NickName</label>
        <input 
          name='NickName' 
          type="text" 
          placeholder='NickName'
          className={styles.input} 
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Edit Gender</label>
        <input 
          name='Gender' 
          type="text" 
          placeholder='Gender' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divInput}>
        <label className={styles.label}>Edit Age</label>
        <input 
          name='Age' 
          type="text" 
          placeholder='Age' 
          className={styles.input}
          onChange={HandleChange}/>
      </div>
      <div className={styles.divBtn}>
        <input type="submit" value="Send" className={styles.btn} />
          {/* esta function redirige al perfil del usuario */}
        <button type="button" className={styles.btn} onClick={() => {router.push(`/profile/${router.query.id}`)}}>Cancel</button>
      </div>
     </form>
    </div>
  )
}


// Esta function llama a la api y se trae al usuario por el id
export async function getServerSideProps({query: { id }}) {
  const response = await fetch(`http://localhost:3001/people/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
  })
  const data = await response.json()

  return {
    props: {
      people: data
    }
  }
}