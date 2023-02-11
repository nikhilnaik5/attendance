import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Announcements = () => {
    const [news, setNews] = useState(null);
    useEffect(() => {
        async function getDetails() {
            let token = localStorage.getItem('token')
            await axios.get('/lecture/sendAnnouncements', {
                headers: {
                    Authorization: token
                }
            }).then(res => { setNews(res.data); console.log(res.data) }).catch(err => console.log(err))
        }
        getDetails();
    }, [])

    return (
        <div>
            {news ? news.map((sub) =>
                <div class="block mx-4 my-4 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{sub[0]}</h5>
                    {sub.map((n, idx) => <div>{idx != 0 ? <div class="flex p-1 mb-1 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                        <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Info</span>
                        <div class='grid-row-2'>
                            <span class="font-medium">{n[0]+" on "+n[1].split('T')[0]}</span> {n[2]}
                        </div>
                    </div> : null}</div>)}
                </div>

            ) : null}
        </div>
    )
}

export default Announcements