import PrivateLayout from '@/layouts/PrivateLayout'
import { useCurrentUser } from '@/utils/hooks/useCurrentUser'
import { startTransition } from 'react'
import { useTranslation } from 'react-i18next'

const SettingsPage = () => {
    const { user, status } = useCurrentUser()
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            i18n.changeLanguage(event.target.value);
        });
        // i18n.changeLanguage(event.target.value);
        localStorage.setItem('language', event.target.value)
    };
    return (
        <PrivateLayout>
            <div className='pt-16 w-full h-full sm:w-1/2'>
                <div className="flex-grow border dark:border-black rounded-lg bg-white dark:bg-neutral shadow-default">
                    <div className="py-4 px-7 rounded-t-lg bg-black text-white">
                        <h3 className="font-medium">
                            {t('personal information')}
                        </h3>
                    </div>
                    <div className="p-7">
                        <form action="#">
                            <div className='pb-4 w-full'>
                                <span className="label-text">{t('full name')}</span>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input type="text" className="grow" placeholder={status === 'success' ? user?.attributes.fullName : 'John Doe'} />
                                </label>
                            </div>
                            <div className='pb-4 flex flex-col'>
                                <span className="label-text">{t('language')}</span>
                                <select
                                    className="select w-1/4 min-w-24"
                                    value={currentLanguage}
                                    onChange={handleLanguageChange}>
                                    <option value="cz">🇨🇿 CZ</option>
                                    <option value="en">🇬🇧 EN</option>
                                    <option value="es">🇪🇸 ES</option>
                                    <option value="fr">🇫🇷 FR</option>
                                    <option value="jp">🇯🇵 JP</option>
                                </select>

                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium hover:shadow-1 dark:border-strokedark "
                                    type="submit"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white dark:text-black hover:bg-opacity-90"
                                    type="submit"
                                >
                                    {t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PrivateLayout >

    )
}

export default SettingsPage