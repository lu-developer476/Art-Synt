import AccessSection from '../components/home/AccessSection'
import { useAuthState } from '../hooks/useAuthState'

export default function AccessPageSection() {
  const auth = useAuthState()

  return (
    <section>
      <AccessSection
        authEmail={auth.authEmail}
        authMessage={auth.authMessage}
        authPassword={auth.authPassword}
        isAuthLoading={auth.isAuthLoading}
        isRegisterModalOpen={auth.isRegisterModalOpen}
        onCloseRegisterModal={() => auth.setIsRegisterModalOpen(false)}
        onEmailChange={auth.setAuthEmail}
        onPasswordChange={auth.setAuthPassword}
        onSignIn={auth.handleSignIn}
        onSignOut={auth.signOut}
        onSignUp={auth.handleSignUp}
        user={auth.user}
        verificationCenterUrl={auth.verificationCenterUrl}
      />
    </section>
  )
}
