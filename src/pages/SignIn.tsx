
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';

export default function SignIn() {
  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <AuthForm type="signin" />
        </div>
      </div>
    </Layout>
  );
}
