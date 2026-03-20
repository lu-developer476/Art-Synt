import { useState, type FormEvent } from 'react'
import ContactSection from '../components/home/ContactSection'
import { addNotification } from '../lib/home'
import { postMailService } from '../lib/api'

export default function ContactPageSection() {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactDescription, setContactDescription] = useState('')
  const [contactMessage, setContactMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setContactMessage(null)

    if (contactDescription.trim().length < 20) {
      setContactMessage('Tu presentación debe tener al menos 20 caracteres para poder evaluarla.')
      return
    }

    setIsSubmitting(true)

    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../firebase/config')

      await addDoc(collection(db, 'contactMessages'), {
        name: contactName,
        email: contactEmail,
        description: contactDescription,
        createdAt: serverTimestamp(),
      })

      await postMailService({
        path: '/contact',
        payload: {
          name: contactName,
          email: contactEmail,
          message: contactDescription,
        },
      })

      await addNotification(db, 'Nueva postulación', 'Se recibió una solicitud para unirse a la red', {
        email: contactEmail,
      })

      setContactName('')
      setContactEmail('')
      setContactDescription('')
      setContactMessage('Postulación enviada con éxito. También te mandamos un correo de confirmación para que tengas constancia inmediata.')
    } catch {
      setContactMessage('No pudimos enviar tu postulación. Intentá nuevamente en unos minutos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <ContactSection
        contactDescription={contactDescription}
        contactEmail={contactEmail}
        contactMessage={contactMessage}
        contactName={contactName}
        isSubmitting={isSubmitting}
        onDescriptionChange={setContactDescription}
        onEmailChange={setContactEmail}
        onNameChange={setContactName}
        onSubmit={handleContactSubmit}
      />
    </section>
  )
}
