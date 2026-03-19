import { useState, type FormEvent } from 'react'
import ContactSection from '../components/home/ContactSection'
import { addNotification } from '../lib/home'

export default function ContactPageSection() {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactDescription, setContactDescription] = useState('')
  const [contactMessage, setContactMessage] = useState<string | null>(null)

  const handleContactSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setContactMessage(null)

    if (contactDescription.trim().length < 20) {
      setContactMessage('Tu presentación debe tener al menos 20 caracteres para poder evaluarla.')
      return
    }

    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../firebase/config')

      await addDoc(collection(db, 'contactMessages'), {
        name: contactName,
        email: contactEmail,
        description: contactDescription,
        createdAt: serverTimestamp(),
      })

      await addDoc(collection(db, 'mail'), {
        to: [contactEmail],
        message: {
          subject: 'Postulación recibida en la red',
          text: `Hola ${contactName}, recibimos tu perfil para futuras operaciones en Night City: "${contactDescription}"`,
        },
      })

      await addNotification(db, 'Nueva postulación', 'Se recibió una solicitud para unirse a la red', {
        email: contactEmail,
      })

      setContactName('')
      setContactEmail('')
      setContactDescription('')
      setContactMessage('Postulación enviada con éxito. Nuestro equipo de reclutamiento te contactará pronto.')
    } catch {
      setContactMessage('No pudimos enviar tu postulación. Intentá nuevamente en unos minutos.')
    }
  }

  return (
    <section>
      <ContactSection
        contactDescription={contactDescription}
        contactEmail={contactEmail}
        contactMessage={contactMessage}
        contactName={contactName}
        onDescriptionChange={setContactDescription}
        onEmailChange={setContactEmail}
        onNameChange={setContactName}
        onSubmit={handleContactSubmit}
      />
    </section>
  )
}
