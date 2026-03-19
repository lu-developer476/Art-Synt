import { useEffect, useState, type FormEvent } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { registerCustomerAccount } from '../firebase/commerce'
import { addNotification } from '../lib/home'

export function useAuthState() {
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault()
    setAuthMessage(null)

    if (!authEmail || !authPassword) {
      setAuthMessage('Ingresá tu correo y tu clave para continuar.')
      return
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, authEmail, authPassword)
      await addNotification(db, 'Ingreso exitoso', 'Usuario autenticado en la red', {
        email: credential.user.email ?? authEmail,
      })
      setAuthMessage('Ingreso confirmado. Tu sesión ya está activa.')
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        setAuthMessage('Credenciales incorrectas. Revisalas e intentá nuevamente.')
        return
      }

      setAuthMessage('No pudimos iniciar tu sesión en este momento.')
    }
  }

  const handleSignUp = async () => {
    setAuthMessage(null)

    if (!authEmail.includes('@') || authPassword.length < 6) {
      setAuthMessage('Usá un correo válido y una clave de al menos 6 caracteres.')
      return
    }

    try {
      const credential = await registerCustomerAccount(auth, db, authEmail, authPassword)
      await addDoc(collection(db, 'mail'), {
        to: [credential.user.email],
        message: {
          subject: 'Bienvenido a la red',
          text: 'Tu cuenta fue creada correctamente. Ya podés explorar y comprar nuestras mejoras.',
        },
      })
      await addNotification(db, 'Registro completado', 'Nuevo usuario registrado para comprar', {
        email: credential.user.email ?? authEmail,
      })
      setAuthMessage('Registro exitoso. Tu perfil ya está listo para operar.')
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setAuthMessage('Ese correo ya está registrado. Probá iniciar sesión.')
        return
      }

      setAuthMessage('No pudimos completar el registro. Revisá los datos e intentá de nuevo.')
    }
  }

  return {
    authEmail,
    authMessage,
    authPassword,
    isAuthenticated: Boolean(user),
    setAuthEmail,
    setAuthPassword,
    signOut: () => signOut(auth),
    handleSignIn,
    handleSignUp,
    setAuthMessage,
    user,
  }
}
