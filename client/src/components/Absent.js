import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Absent = () => {
    const [message, setMessage] = useState(null);
    const [subjects, setSubject] = useState([]);
    const [subjectLecture, setSubjectLecture] = useState([]);
    const [subjectAbsent, setSubjectAbsent] = useState(0);
    const [selectedSubjectOption, setSelectedSubjectOption] = useState(0);
    const [selectedLectureOption, setSelectedLectureOption] = useState(0);
    const [absentnum, setAbsent] = useState(1);
    const [details, setDetails] = useState([]);
    const [messageDel, setMessageDel] = useState(null);

    let name, value;
    const handleChange = (e) => {
        let min = 1;
        let max = subjectAbsent[selectedSubjectOption][selectedLectureOption];
        let value = e.target.value;
        if (value < 0) {
            setAbsent(min);
        }
        else if (value > max) {
            setAbsent(max);
        }
        else {
            setAbsent(value);
        }
    };

    async function deleteAbsent(idx){
        let token = localStorage.getItem('token')
        await axios.delete("/lecture/absentDelete/"+details[idx]._id, { headers: { 'Authorization': token } }).then((res)=>{setMessageDel(res.data.message)}).catch((err)=>{setMessageDel(err.message)});
    }

    async function getDetails() {
        let token = localStorage.getItem('token')
        await axios.get("/lecture/list", { headers: { 'Authorization': token } }).then((res) => { setSubject(res.data[0]); setSubjectLecture(res.data[1]); setSubjectAbsent(res.data[2]); console.log(res.data) }).catch("No successful result");
    }

    async function getAbsentDetails() {
        let token = localStorage.getItem('token')
        await axios.get('/lecture/absentdata', { headers: { 'Authorization': token } }).then((res) => { setDetails(res.data) })
    }

    const sendAbsent = async () => {
        let token = localStorage.getItem('token');
        let absent = { subject: subjects[selectedSubjectOption], date: subjectLecture[selectedSubjectOption][selectedLectureOption], number: absentnum }
        console.log(absent);
        await axios.post('/lecture/absent', absent, { headers: { 'Authorization': token } }).then((res) => {
            setMessage(res.data.message)
        }).catch((err) => setMessage(err.response.data.message));
    }

    useEffect(() => {
        getDetails();
        getAbsentDetails()
    }, [])

    return (
        <div>
            {message == null ? null : <div class="m-5 flex p-4 mb-4 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Info</span>
                <div>
                    {message}
                </div>
            </div>}
            <div className='flex flex basis w-1/2 py-2 px-2'>
                <div className='basis-1/2 font-bold'>Select Subject:</div><select className='border-gray-700 border-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 basis-1/2' onChange={e => { setSelectedSubjectOption(e.target.value); console.log(e.target.value) }} value={selectedSubjectOption}>
                    {subjects.map((sub, idx) => <option value={idx}>{sub}</option>)}
                </select>
            </div>
            {subjectLecture[selectedSubjectOption] == null ? null : <div className='flex flex basis w-1/2 py-2 px-2'>
                <div className='basis-1/2 font-bold'>Select Date:</div><select className='border-gray-700 border-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 basis-1/2' onChange={e => { setSelectedLectureOption(e.target.value); setAbsent(1) }} value={selectedLectureOption}>
                    {subjectLecture[selectedSubjectOption].map((sub, idx) => <option value={idx}>{sub.split('T')[0]}</option>)}
                </select>
            </div>}

            <div className='flex flex basis w-1/2 py-2 px-2'>
                <div className='basis-1/2 font-bold'>Absent lectures:</div><input type='number' className='border-gray-700 border-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 basis-1/2' value={absentnum} onChange={handleChange}>
                </input>
            </div>

            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-2" onClick={sendAbsent}>Add Absent</button>
            <div
                class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
            >
                <p class="text-center font-semibold mx-4 mb-0">Absent Lectures</p>
            </div>
            {messageDel == null ? null : <div class="m-5 flex p-4 mb-4 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Info</span>
                <div>
                    {messageDel}
                </div>
            </div>}
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-2">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Subject
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Lectures Missed
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((sub,idx) => {
                            return <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {sub.date.split('T')[0]}
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {sub.subjects.name}
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {sub.number}
                                </td>
                                <td class="px-6 py-4">
                                    <button type='button' class="font-medium text-red-600 dark:text-red-500" onClick={()=>{deleteAbsent(idx)}}>Remove</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Absent