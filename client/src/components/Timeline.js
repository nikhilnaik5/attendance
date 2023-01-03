import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Timeline = () => {

    const [subjects, setSubjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [toggle,setToggle] = useState(true);
    function handleClick(i) {
        const name = new Date(attendance[i][0]);
        const update = attendance.map(obj => {
            let x = new Date(obj[0])
            if (name.getTime()<=x.getTime()) {
                obj[5] -= obj[1];
                return obj;
            }
            return obj;
        });
        console.log(update);
        setAttendance(update);
    }

    const postData = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/lecture/sub", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({ subject: subjects[selectedOption] })
        })
        const res = await response.json();
        console.log(res);
        setAttendance(res);
    }

    useEffect(() => {
        async function subjectResult() {
            const token = localStorage.getItem('token');
            axios.get("http://localhost:5000/lecture/getsubjectnames", { headers: { 'Authorization': token } }).then((res) => { setSubjects(res.data); console.log(res.data) }).catch("No successful result");
        }
        subjectResult();
    }, [])

    return (
        <div>
            <form>
                <select onChange={e => setSelectedOption(e.target.value)} value={selectedOption}>
                    {subjects.map((sub, idx) => <option value={idx}>{sub}</option>)}
                </select>
                <button type='button' class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={postData}>wassup hommie</button>
            </form>
            <div className='w-full'>
                <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="py-3 px-6">
                                    Date
                                </th>
                                <th scope="col" class="py-3 px-6">
                                    Lectures
                                </th>
                                <th scope="col" class="py-3 px-6">
                                    Attendance (in %)
                                </th>
                                <th scope="col" class="py-3 px-6">
                                    Options
                                </th>
                                <th scope="col" class="py-3 px-6">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((sub, i) =>
                                <tr class="bg-white border-b">
                                    <th scope="row" class="py-4 px-6 font-medium text-black">
                                        {sub[0].split('T')[0]}
                                    </th>
                                    <td class="py-4 px-6">
                                        {sub[5]}/{sub[4]}
                                    </td>
                                    <td class="py-4 px-6">
                                        {sub[6]}
                                    </td>
                                    <td class="py-4 px-6">
                                        {toggle?<button type='button' className='bg-green-500 cursor-not-allowed' disabled><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white font-bold">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        </button>:<button type='button' className='bg-green-500'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white font-bold" onClick={()=>{setToggle(false)}}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        </button>}
                                        {toggle?<button type='button' className='bg-red-500' onClick={() => {handleClick(i); setToggle(true)}}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white font-bold">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        </button>:<button type='button' className='bg-red-500' onClick={() => handleClick(i)} disabled><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white font-bold">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        </button>}
                                        
                                    </td>
                                    {(() => {
                                        if ((sub[3] == 0)) {
                                            return (
                                                <td class="py-4 px-6 text-green-500 font-bold">
                                                    PRESENT
                                                </td>
                                            )
                                        } else {
                                            return (
                                                <td class="py-4 px-6 text-red-500 font-bold">
                                                    ABSENT
                                                </td>
                                            )
                                        }
                                    })()}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}

export default Timeline