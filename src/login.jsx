import { useState } from 'react';
import { getErrorMessage, getMemberId, loginMember, registerMember } from './api.js';

export default function Login({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-slate-100 px-4">
      {isSignup ? (
        <SignupForm onGoLogin={() => setIsSignup(false)} />
      ) : (
        <LoginForm onGoSignup={() => setIsSignup(true)} onLoginSuccess={onLoginSuccess} />
      )}
    </div>
  );
}

function LoginForm({ onGoSignup, onLoginSuccess }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id.trim() || !password.trim()) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const data = await loginMember({
        username: id.trim(),
        password,
      });
      const memberId = getMemberId(data);

      if (!memberId) {
        setErrorMessage('로그인 응답에서 회원 정보를 찾을 수 없습니다.');
        return;
      }

      onLoginSuccess(String(memberId));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '로그인에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-center text-2xl font-bold text-slate-900">로그인</h1>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="login-id">
            아이디
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="login-id"
            name="id"
            placeholder="아이디를 입력하세요"
            type="text"
            value={id}
            onChange={(event) => setId(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="login-password">
            비밀번호
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="login-password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {errorMessage && (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        )}

        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
        <button
          className="w-full rounded-md border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-100"
          type="button"
          onClick={onGoSignup}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

function SignupForm({ onGoLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id.trim() || !password.trim() || !passwordCheck.trim()) {
      setMessage('');
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password !== passwordCheck) {
      setMessage('');
      setErrorMessage('비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');
      setErrorMessage('');
      await registerMember({
        username: id.trim(),
        password,
      });
      setMessage('회원가입이 완료되었습니다. 로그인해주세요.');
      setPassword('');
      setPasswordCheck('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '회원가입에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-center text-2xl font-bold text-slate-900">회원가입</h1>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="signup-id">
            아이디
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="signup-id"
            name="id"
            placeholder="사용할 아이디를 입력하세요"
            type="text"
            value={id}
            onChange={(event) => setId(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="signup-password">
            비밀번호
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="signup-password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="signup-password-check">
            비밀번호 확인
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="signup-password-check"
            name="passwordCheck"
            placeholder="비밀번호를 다시 입력하세요"
            type="password"
            value={passwordCheck}
            onChange={(event) => setPasswordCheck(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {message && (
          <p className="text-sm font-medium text-blue-600">{message}</p>
        )}
        {errorMessage && (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        )}

        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '가입 중...' : '가입하기'}
        </button>
        <button
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          type="button"
          onClick={onGoLogin}
        >
          로그인으로 돌아가기
        </button>
      </form>
    </div>
  );
}
