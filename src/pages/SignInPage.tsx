import PublicLayout from '@/layouts/PublicLayout';
import { useAuth } from '@/utils/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SignInPage = () => {
    const [formErrors, setFormErrors] = useState({ title: '', password: '' })
    const { getAuthUrl, data, status } = useAuth();
    const { t } = useTranslation()

    const handleLogin = () => {
        getAuthUrl()
    }

    useEffect(() => {
        if (status === 'success' && data) {
            window.location.href = data.data.url;
        }
    }, [status, data])

    return (
        <PublicLayout>
            <div className="sm:w-full lg:w-3/5 rounded-sm border border-black rounded-xl bg-white dark:bg-neutral shadow-default">
                <div className="flex flex-wrap items-center">
                    <div className="hidden w-full xl:block xl:w-1/2">
                        <div className="px-8 text-center">
                            <img className='dark:hidden' src='/logo.svg' alt='logo' />
                            <img className='hidden dark:block' src='/Logo7.png' alt='logo' />
                        </div>
                    </div>

                    <div className="w-full border-black xl:w-1/2 xl:border-l-2 h-full">
                        <div className="w-full p-4 sm:pt-12 pl-12 pr-12">
                            <h2 className="mb-8 text-2xl font-bold sm:text-title-xl2">
                                {t("sign in to hikerdo")}
                            </h2>
                            <form>
                                <div className='pb-4'>
                                    <span className="label-text">{t("email")}</span>
                                    <label className="input input-bordered flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><title>email icon</title><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                        <input type="text" className="grow" placeholder={t("email")} />
                                    </label>

                                </div>

                                <div className='pb-8'>
                                    <span className="label-text">{t("password")}</span>
                                    <label className="input input-bordered flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><title>password icon</title><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                        <input type="password" className="grow" placeholder={t("enter password")} />
                                    </label>
                                </div>

                                <button type='submit' className='w-full btn btn-primary text-white dark:text-black mb-4'>{t("sign in")}</button>
                                <button type='button' onClick={handleLogin} className='w-full btn'><span>
                                    <svg className='fill-primary' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Github icon</title><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                </span>{t("sign in with github")}</button>
                                <div className="mt-6 text-center pb-4">
                                    <p>
                                        {t("dont have any account")}{' '}
                                        <Link to="/signup" className='link link-accent'>
                                            {t("sign up")}
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </PublicLayout >
    );
};

export default SignInPage;
