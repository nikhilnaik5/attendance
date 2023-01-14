import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Timeline = () => {

    const [subjects, setSubjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [toggle, setToggle] = useState({});

    function toggleFunction(id) {
        setToggle({
            ...toggle,
            [id]: !toggle[id],
        });
    }

    function handleAbsentClick(i) {
        const sub = attendance[i][1];
        const name = new Date(attendance[i][0]);
        const update = attendance.map(obj => {
            let x = new Date(obj[0])
            if (name.getTime() <= x.getTime()) {
                obj[5] -= sub;
                return obj;
            }
            return obj;
        });
        setAttendance(update);
    }

    function handlePresentClick(i) {
        const sub = attendance[i][1];
        const name = new Date(attendance[i][0]);
        const update = attendance.map(obj => {
            let x = new Date(obj[0])
            if (name.getTime() <= x.getTime()) {
                obj[5] += sub;
                return obj;
            }
            return obj;
        });
        setAttendance(update);
    }

    const postData = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch("/lecture/sub", {
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
            axios.get("/lecture/getsubjectnames", { headers: { 'Authorization': token } }).then((res) => { setSubjects(res.data); console.log(res.data) }).catch("No successful result");
        }
        subjectResult();
    }, [])

    return (
        <div>
            <form>
                <div className='flex py-2 px-2'>
                    <div className='flex-none w-1/2'>
                    <select className='w-full px-2 py-2' onChange={e => setSelectedOption(e.target.value)} value={selectedOption}>
                    {subjects.map((sub, idx) => <option value={idx}>{sub}</option>)}
                </select>
                    </div>
                    <div className='flex-none w-1/2'>
                    <button type='button' class="w-full rounded inline-block px-6 h-full bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={postData}>See Attendance</button>
                    </div>
                </div>
            </form>
            <div className='px-2 py-2 '>
                <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="py-3 px-6 ">
                                    Date
                                </th>
                                <th scope="col" class="py-3 px-6 ">
                                    Lectures
                                </th>
                                <th scope="col" class="py-3 px-6 ">
                                    Attendance (in %)
                                </th>
                                <th scope="col" class="py-3 px-6 ">
                                    Options
                                </th>
                                <th scope="col" class="py-3 px-6 ">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((sub, i) =>
                                <tr class="bg-white border-b dark:bg-gray-700 ">
                                    <th scope="row" class="py-4 px-6 font-medium text-gray-800 dark:text-white">
                                        {sub[0].split('T')[0]}
                                    </th>
                                    <td class="py-4 px-6 dark:text-white-900">
                                        {sub[5]}/{sub[4]}
                                    </td>
                                    {(() => {
                                        if (((sub[5] / sub[4]) * 100).toFixed(2) < 75.00) {
                                            return (
                                                <td class="py-4 px-6 bg-red-500 text-white">
                                                    {((sub[5] / sub[4]) * 100).toFixed(2)}
                                                </td>
                                            )
                                        } else {
                                            return (
                                                <td class="py-4 px-6 text-gray-800 dark:text-white">
                                                    {((sub[5] / sub[4]) * 100).toFixed(2)}
                                                </td>
                                            )
                                        }
                                    })()}
                                    <td class="py-4 px-6">
                                        {sub[6]==1 ? <p>-</p> : <div></div>}
                                        {(!toggle[i] && sub[6]==0) ? <button type='button' className='bg-red-500 rounded' onClick={() => { handleAbsentClick(i); toggleFunction(i) }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white font-bold">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        </button> :(toggle[i] && sub[6]==0)?  <button type='button' className='bg-green-500 rounded'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white font-bold" onClick={() => { handlePresentClick(i); toggleFunction(i) }}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        </button>:<div></div>}
                                    </td>
                                    {(() => {
                                        if ((sub[3] == 0 && sub[6] == 1)) {
                                            return (
                                                <td class="py-4 px-6 text-green-500 font-bold">
                                                    PRESENT
                                                </td>
                                            )
                                        } else if ((sub[3] == 1 && sub[6] == 1)) {
                                            return (
                                                <td class="py-4 px-6 text-red-500 font-bold">
                                                    ABSENT
                                                </td>
                                            )
                                        }
                                        else if ((sub[6] == 0)) {
                                            return (
                                                <td class="py-4 px-6 text-white font-bold">
                                                    <p>-</p>
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